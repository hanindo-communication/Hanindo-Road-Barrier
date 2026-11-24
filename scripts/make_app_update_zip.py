"""Package the current static app, preserving hosting timestamps and permissions.

Legacy pages/assets are excluded. Use make_deploy_zip.py for a full export.
"""

from datetime import date, datetime
from pathlib import Path
import stat
import zipfile

root = Path(__file__).resolve().parents[1]
source = root / "out"
if not (source / "index.html").is_file():
    raise SystemExit("Run npm run build before packaging the app.")

target = root / "deployment" / f"roadbarrier-app-update-{date.today().isoformat()}.zip"
target.parent.mkdir(exist_ok=True)
with zipfile.ZipFile(target, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=6) as archive:
    for item in sorted(source.rglob("*")):
        relative = item.relative_to(source)
        if relative.parts[0] in {"legacy-assets", "pelajari-lebih-lanjut"}:
            continue
        directory = item.is_dir()
        info = zipfile.ZipInfo(relative.as_posix() + ("/" if directory else ""))
        info.date_time = datetime.fromtimestamp(item.stat().st_mtime).timetuple()[:6]
        info.create_system = 3
        info.external_attr = ((stat.S_IFDIR | 0o755) if directory else (stat.S_IFREG | 0o644)) << 16
        if directory:
            info.external_attr |= 0x10
        else:
            info.compress_type = zipfile.ZIP_DEFLATED
        archive.writestr(info, b"" if directory else item.read_bytes())

print(f"{target} ({target.stat().st_size:,} bytes)")
