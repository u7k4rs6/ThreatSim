import logging
from typing import Any

import httpx

logger = logging.getLogger(__name__)

NVD_URL = "https://services.nvd.nist.gov/rest/json/cves/2.0"


async def fetch_sample_cve(
    client: httpx.AsyncClient,
    *,
    nvd_api_key: str | None,
    results_per_page: int = 15,
) -> dict[str, Any] | None:
    params: dict[str, str | int] = {"resultsPerPage": results_per_page}
    if nvd_api_key:
        params["apiKey"] = nvd_api_key
    try:
        r = await client.get(NVD_URL, params=params, timeout=45.0)
        r.raise_for_status()
    except httpx.HTTPError as e:
        logger.warning("NVD request failed: %s", e)
        return None

    data = r.json()
    for item in data.get("vulnerabilities", []):
        cve = item.get("cve") or {}
        cid = cve.get("id")
        if not cid:
            continue
        desc = ""
        for d in cve.get("descriptions", []):
            if d.get("lang") == "en":
                desc = (d.get("value") or "").strip()
                break
        if not desc:
            continue
        return {"id": cid, "description": desc[:4000]}
    return None


def fallback_cve() -> dict[str, Any]:
    return {
        "id": "CVE-EDU-0000",
        "description": (
            "Synthetic training placeholder: practice reviewing user-controlled input "
            "that reaches dangerous sinks (eval/exec/subprocess) in Python. "
            "Replace this with a live NVD record when the network is available."
        ),
    }
