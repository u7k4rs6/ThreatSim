import json
import logging
import re
from typing import Any

from .config import Settings

logger = logging.getLogger(__name__)

DEFAULT_ARTIFACT = "vuln.py"


def _fallback_mission(cve: dict[str, Any]) -> dict[str, Any]:
    cid = cve.get("id", "CVE-UNKNOWN")
    desc = (cve.get("description") or "")[:800]
    briefing = (
        f"## Mission briefing\n\n"
        f"**{cid}** — training sandbox (no Gemini).\n\n"
        f"**Intel excerpt:** {desc}\n\n"
        f"**Objective:** Inspect `{DEFAULT_ARTIFACT}` under `/mission`, "
        f"identify the unsafe pattern, and remediate it using only safe APIs.\n"
    )
    content = f'''"""
ThreatSim training artifact for {cid}
Deliberately unsafe for an isolated lab — do not reuse patterns in production.
"""
import sys


def run_user_logic(user_input: str) -> None:
    # CWE-94 style unsafe evaluation (training only)
    eval(user_input)


if __name__ == "__main__":
    raw = sys.argv[1] if len(sys.argv) > 1 else "__import__('os').system('id')"
    run_user_logic(raw)
'''
    return {
        "briefing": briefing,
        "artifact_name": DEFAULT_ARTIFACT,
        "artifact_content": content,
        "source": "fallback",
    }


def _parse_json_object(text: str) -> dict[str, Any] | None:
    text = text.strip()
    try:
        obj = json.loads(text)
        return obj if isinstance(obj, dict) else None
    except json.JSONDecodeError:
        pass
    m = re.search(r"\{[\s\S]*\}\s*$", text)
    if m:
        try:
            obj = json.loads(m.group(0))
            return obj if isinstance(obj, dict) else None
        except json.JSONDecodeError:
            return None
    return None


def generate_mission_with_gemini(
    settings: Settings,
    cve: dict[str, Any],
) -> dict[str, Any]:
    key = settings.gemini_api_key
    if not key:
        return _fallback_mission(cve)

    import google.generativeai as genai

    genai.configure(api_key=key)
    model = genai.GenerativeModel(
        settings.gemini_model,
        generation_config={
            "temperature": 0.35,
            "response_mime_type": "application/json",
        },
    )

    cid = cve.get("id", "")
    desc = cve.get("description", "")
    prompt = f"""You are ThreatSim's scenario engine. Given this CVE record, produce a SMALL self-contained
Python training artifact (stdlib only, runs on Python 3.10+) that illustrates the core mistake class
in a way a defender can find and fix in a terminal-only lab. The code must be obviously for education.

CVE ID: {cid}
Description (from NVD-style feed):
{desc}

Return ONLY a JSON object with these keys:
- "briefing": string, Markdown mission brief for the analyst (2–4 short paragraphs + bullet objectives).
- "artifact_name": string, filename only, e.g. "vuln.py"
- "artifact_content": string, full Python source (single file).

Rules for artifact_content:
- Must be valid Python.
- Must be intentionally vulnerable in a way related to the CVE theme, but safe to run inside an isolated container
  (no fork bombs, no crypto miners, no large exfiltration; no raw shell one-liners as the default path).
- Include a short module docstring stating it is a deliberately vulnerable training file.
"""

    try:
        resp = model.generate_content(prompt)
        text = (resp.text or "").strip()
    except Exception as e:
        logger.warning("Gemini generate_content failed: %s", e)
        return _fallback_mission(cve)

    parsed = _parse_json_object(text)
    if not parsed:
        logger.warning("Gemini returned non-JSON; using fallback mission")
        return _fallback_mission(cve)

    name = parsed.get("artifact_name") or DEFAULT_ARTIFACT
    if not isinstance(name, str) or "/" in name or ".." in name:
        name = DEFAULT_ARTIFACT
    content = parsed.get("artifact_content")
    briefing = parsed.get("briefing")
    if not isinstance(content, str) or not isinstance(briefing, str):
        return _fallback_mission(cve)

    return {
        "briefing": briefing,
        "artifact_name": name,
        "artifact_content": content,
        "source": "gemini",
    }
