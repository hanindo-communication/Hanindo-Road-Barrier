"""Pack a static export with Unix permissions required by shared hosting."""

from datetime import date, datetime
from pathlib import Path
import shutil
import stat
import zipfile


root = Path(__file__).resolve().parents[1]
source = root / "out"
target = root / "deployment" / f"roadbarrier-static-{date.today().isoformat()}.zip"
target.parent.mkdir(exist_ok=True)

with zipfile.ZipFile(target, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=6) as archive:
    for item in sorted(source.rglob("*")):
        name = item.relative_to(source).as_posix()
        if item.is_dir():
            info = zipfile.ZipInfo(name + "/")
            info.create_system = 3
            info.external_attr = ((stat.S_IFDIR | 0o755) << 16) | 0x10
            archive.writestr(info, b"")
        elif item.is_file():
            info = zipfile.ZipInfo(name)
            info.date_time = datetime.fromtimestamp(item.stat().st_mtime).timetuple()[:6]
            info.create_system = 3
            info.external_attr = (stat.S_IFREG | 0o644) << 16
            info.compress_type = zipfile.ZIP_DEFLATED
            with item.open("rb") as reader, archive.open(info, "w") as writer:
                shutil.copyfileobj(reader, writer)

print(f"{target} ({target.stat().st_size:,} bytes)")
