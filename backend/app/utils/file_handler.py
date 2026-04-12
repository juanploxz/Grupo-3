from __future__ import annotations

from pathlib import Path

from app.core.config import settings


def save_upload(filename: str, content: bytes) -> Path:
    upload_dir = Path(settings.upload_dir)
    upload_dir.mkdir(parents=True, exist_ok=True)
    path = upload_dir / filename
    path.write_bytes(content)
    return path
