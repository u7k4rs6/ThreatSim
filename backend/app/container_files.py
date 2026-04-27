import io
import logging
import tarfile
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from docker.models.containers import Container

logger = logging.getLogger(__name__)


def put_file_in_container(
    container: "Container",
    dest_dir: str,
    filename: str,
    content: bytes,
) -> None:
    """Write a single file under dest_dir using Docker put_archive."""
    tar_buf = io.BytesIO()
    with tarfile.open(fileobj=tar_buf, mode="w") as tar:
        info = tarfile.TarInfo(name=filename)
        info.size = len(content)
        info.mode = 0o644
        tar.addfile(info, io.BytesIO(content))
    tar_buf.seek(0)
    data = tar_buf.read()
    try:
        ok = container.put_archive(dest_dir, data)
    except Exception as e:
        logger.exception("put_archive raised for %s/%s", dest_dir, filename)
        raise RuntimeError(f"put_archive failed: {e}") from e
    if ok is False:
        raise RuntimeError(f"put_archive returned False for {dest_dir}/{filename}")
