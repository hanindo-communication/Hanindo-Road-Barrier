"""Snapshot the public WordPress site into the local legacy section.

Run from the project root: python scripts/mirror_legacy.py
The script only reads the public site and writes under legacy-mirror/ and
public/legacy-assets/. It does not change the live WordPress installation.
"""

from __future__ import annotations

import argparse
import concurrent.futures
import html
import re
import time
import urllib.error
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from pathlib import Path


ORIGIN = "https://roadbarrierindonesia.com"
PREFIX = "/pelajari-lebih-lanjut"
ROOT = Path(__file__).resolve().parents[1]
PAGES = ROOT / "legacy-mirror" / "pages"
ASSETS = ROOT / "public" / "legacy-assets"
SITEMAP = ORIGIN + "/wp-sitemap.xml"
HEADERS = {"User-Agent": "Mozilla/5.0 (compatible; RoadBarrierArchive/1.0)"}
ASSET_PREFIXES = ("/wp-content/", "/wp-includes/")
ASSET_SUFFIXES = (".css", ".js", ".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg", ".woff", ".woff2", ".ttf", ".eot", ".mp4", ".pdf", ".ico")
URL_RE = re.compile(r"(?:(?:https?:)?//roadbarrierindonesia\.com)?(/(?:wp-content|wp-includes)/[^\s\"'<>),;]+)", re.I)
CSS_URL_RE = re.compile(r"url\(\s*['\"]?([^)'\"]+)", re.I)
CSS_IMPORT_RE = re.compile(r"@import\s+(?:url\()?\s*['\"]([^'\"]+)", re.I)
LOCAL_ASSET_RE = re.compile(r"/legacy-assets/(?:wp-content|wp-includes)/[^\s\"'<>),;?]+", re.I)


def get(url: str, attempts: int = 3) -> bytes:
    last_error: Exception | None = None
    for attempt in range(attempts):
        try:
            request = urllib.request.Request(url, headers=HEADERS)
            with urllib.request.urlopen(request, timeout=35) as response:
                return response.read()
        except (OSError, urllib.error.URLError) as error:
            last_error = error
            time.sleep(0.5 * (attempt + 1))
    raise RuntimeError(f"Could not fetch {url}: {last_error}")


def canonical(url: str) -> str:
    parsed = urllib.parse.urlsplit(url)
    return urllib.parse.urlunsplit((parsed.scheme, parsed.netloc, parsed.path, "", ""))


def page_path(url: str) -> Path:
    parsed = urllib.parse.urlsplit(url)
    path = urllib.parse.unquote(parsed.path).strip("/")
    return PAGES / path / "index.html" if path else PAGES / "index.html"


def asset_path(url: str) -> Path:
    path = urllib.parse.unquote(urllib.parse.urlsplit(url).path).lstrip("/")
    target = ASSETS / path
    if not target.resolve().is_relative_to(ASSETS.resolve()):
        raise ValueError(f"Unsafe asset path: {url}")
    return target


def is_asset(url: str) -> bool:
    parsed = urllib.parse.urlsplit(url)
    return (parsed.hostname in ("roadbarrierindonesia.com", "www.roadbarrierindonesia.com")
            and parsed.path.startswith(ASSET_PREFIXES)
            and parsed.path.lower().endswith(ASSET_SUFFIXES))


class AssetParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.urls: set[str] = set()

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        for name, value in attrs:
            if not value:
                continue
            if name in {"src", "href", "poster", "content", "data-src", "data-rocket-src", "data-bg", "data-background", "data-lazy-src", "data-srcset", "srcset"}:
                candidates = re.split(r"\s*,\s*|\s+\d+(?:w|x)(?:\s|$)", value)
                for candidate in candidates:
                    url = urllib.parse.urljoin(ORIGIN + "/", candidate.strip())
                    if is_asset(url):
                        self.urls.add(canonical(url))
            for match in URL_RE.finditer(value):
                url = ORIGIN + html.unescape(match.group(1))
                if is_asset(url):
                    self.urls.add(canonical(url))


class LinkParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.links: set[str] = set()
        self.assets: set[str] = set()

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = dict(attrs)
        if tag == "a" and values.get("href"):
            self.links.add(values["href"] or "")
        for name in ("src", "href", "poster", "data-src", "data-rocket-src", "data-lazy-src"):
            value = values.get(name)
            if value and value.startswith("/legacy-assets/"):
                self.assets.add(value.split("?", 1)[0])


def audit() -> None:
    missing_pages: set[str] = set()
    missing_assets: set[str] = set()
    page_count = 0
    for page in PAGES.rglob("index.html"):
        page_count += 1
        parser = LinkParser()
        parser.feed(page.read_text(encoding="utf-8"))
        for link in parser.links:
            path = urllib.parse.urlsplit(link).path
            if path.startswith(PREFIX + "/") or path == PREFIX:
                target = page_path(ORIGIN + path.removeprefix(PREFIX))
                if not target.exists():
                    missing_pages.add(path)
        for asset in parser.assets:
            if not (ROOT / "public" / asset.lstrip("/")).exists():
                missing_assets.add(asset)
    for stylesheet in ASSETS.rglob("*.css"):
        source = stylesheet.read_text(encoding="utf-8", errors="replace")
        for match in CSS_URL_RE.finditer(source):
            reference = match.group(1).strip()
            if reference.startswith(("data:", "http:", "https:", "//", "#")):
                continue
            path = urllib.parse.unquote(urllib.parse.urlsplit(reference).path)
            if not path:
                continue
            target = ROOT / "public" / path.lstrip("/") if path.startswith("/") else stylesheet.parent / path
            if not target.resolve().exists():
                missing_assets.add(f"{stylesheet.relative_to(ROOT)} -> {reference}")
    print(f"Archived pages: {page_count}")
    print(f"Linked pages not archived: {len(missing_pages)}")
    for path in sorted(missing_pages):
        print("PAGE", path)
    print(f"Referenced assets not saved: {len(missing_assets)}")
    for path in sorted(missing_assets):
        print("ASSET", path)


def linked_urls() -> list[str]:
    urls: set[str] = set()
    for page in PAGES.rglob("index.html"):
        parser = LinkParser()
        parser.feed(page.read_text(encoding="utf-8"))
        for link in parser.links:
            path = urllib.parse.urlsplit(link).path
            if path.startswith(PREFIX + "/") or path == PREFIX:
                url = ORIGIN + path.removeprefix(PREFIX)
                if not page_path(url).exists():
                    urls.add(url)
    return sorted(urls)


def repair_missing_assets() -> None:
    pages = list(PAGES.rglob("index.html"))
    replacements: dict[str, str] = {}
    for page in pages:
        for local_url in LOCAL_ASSET_RE.findall(page.read_text(encoding="utf-8")):
            if local_url in replacements:
                continue
            local_path = ROOT / "public" / local_url.lstrip("/")
            if local_path.exists():
                continue
            alternative = local_path.with_suffix(".webp")
            alternative_url = local_url[: -len(local_path.suffix)] + ".webp"
            remote_url = ORIGIN + alternative_url.removeprefix("/legacy-assets")
            try:
                body = get(remote_url, attempts=1)
            except RuntimeError:
                continue
            alternative.parent.mkdir(parents=True, exist_ok=True)
            alternative.write_bytes(body)
            replacements[local_url] = alternative_url
    for page in pages:
        source = page.read_text(encoding="utf-8")
        updated = source.replace(' lang=\\"id\\"', "")
        for old, new in replacements.items():
            updated = updated.replace(old, new)
        if updated != source:
            page.write_text(updated, encoding="utf-8")
    print(f"Repaired missing images with available WebP originals: {len(replacements)}")
    for old, new in sorted(replacements.items()):
        print(old, "=>", new)


def sitemap_urls() -> list[str]:
    namespace = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    index = ET.fromstring(get(SITEMAP))
    maps = [node.text for node in index.findall("s:sitemap/s:loc", namespace) if node.text]
    urls: set[str] = set()
    for sitemap in maps:
        document = ET.fromstring(get(sitemap))
        urls.update(canonical(node.text) for node in document.findall("s:url/s:loc", namespace) if node.text)
    return sorted(urls)


def rewrite_html(source: str) -> str:
    # Use local assets so replacing the domain at launch cannot break images or styles.
    for old in (ORIGIN, "http://roadbarrierindonesia.com", "//roadbarrierindonesia.com"):
        for prefix in ASSET_PREFIXES:
            source = source.replace(old + prefix, "/legacy-assets" + prefix)
    for prefix in ASSET_PREFIXES:
        source = source.replace('="' + prefix, '="/legacy-assets' + prefix)
        source = source.replace("='" + prefix, "='/legacy-assets" + prefix)
    for old in (ORIGIN, "http://roadbarrierindonesia.com", "//roadbarrierindonesia.com"):
        source = source.replace(old + "/", PREFIX + "/")
    # Relative root links in attributes also belong to the archived site.
    source = re.sub(r"((?:href|action)\s*=\s*['\"])/(?!/|legacy-assets/|pelajari-lebih-lanjut/|wp-content/|wp-includes/)",
                    r"\1" + PREFIX + "/", source, flags=re.I)
    # Make WP Rocket's deferred styles immediately available in a static snapshot.
    source = re.sub(r"rel=(['\"])preload\1(?=[^>]*\bas=(['\"])style\2)", "rel='stylesheet'", source, flags=re.I)
    return source


def fetch_page(url: str) -> tuple[str, str, set[str]]:
    source = get(url).decode("utf-8", "replace")
    parser = AssetParser()
    parser.feed(source)
    for match in URL_RE.finditer(source):
        candidate = ORIGIN + html.unescape(match.group(1))
        if is_asset(candidate):
            parser.urls.add(canonical(candidate))
    return url, rewrite_html(source), parser.urls


def fetch_asset(url: str) -> tuple[str, bytes, set[str]]:
    body = get(url)
    nested: set[str] = set()
    if urllib.parse.urlsplit(url).path.lower().endswith(".css"):
        css = body.decode("utf-8", "replace")
        for regex in (CSS_URL_RE, CSS_IMPORT_RE):
            for match in regex.finditer(css):
                candidate = urllib.parse.urljoin(url, html.unescape(match.group(1).strip()))
                if is_asset(candidate):
                    nested.add(canonical(candidate))
        # Absolute same-origin asset paths need the local asset prefix.
        for old in (ORIGIN, "http://roadbarrierindonesia.com", "//roadbarrierindonesia.com"):
            for prefix in ASSET_PREFIXES:
                css = css.replace(old + prefix, "/legacy-assets" + prefix)
        body = css.encode("utf-8")
    return url, body, nested


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--inventory", action="store_true")
    parser.add_argument("--audit", action="store_true")
    parser.add_argument("--fill-linked", action="store_true")
    parser.add_argument("--repair-assets", action="store_true")
    args = parser.parse_args()
    if args.audit:
        audit()
        return
    if args.repair_assets:
        repair_missing_assets()
        return
    urls = linked_urls() if args.fill_linked else sitemap_urls()
    print(f"Pages to fetch: {len(urls)}")
    if args.inventory:
        for url in urls:
            print(url)
        return

    assets: set[str] = set()
    errors: list[str] = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as executor:
        for future in concurrent.futures.as_completed({executor.submit(fetch_page, url): url for url in urls}):
            try:
                url, source, found = future.result()
                target = page_path(url)
                target.parent.mkdir(parents=True, exist_ok=True)
                target.write_text(source, encoding="utf-8")
                assets.update(found)
                print(f"PAGE {url}")
            except Exception as error:
                errors.append(str(error))

    fetched: set[str] = set()
    assets = {url for url in assets if not asset_path(url).exists()}
    while assets - fetched:
        pending = sorted(assets - fetched)
        with concurrent.futures.ThreadPoolExecutor(max_workers=8) as executor:
            futures = {executor.submit(fetch_asset, url): url for url in pending}
            for future in concurrent.futures.as_completed(futures):
                url = futures[future]
                fetched.add(url)
                try:
                    _, body, nested = future.result()
                    target = asset_path(url)
                    target.parent.mkdir(parents=True, exist_ok=True)
                    target.write_bytes(body)
                    assets.update(nested)
                except Exception as error:
                    errors.append(f"{url}: {error}")
        print(f"Assets saved: {len(fetched)} / {len(assets)}")

    print(f"Pages saved: {len(urls) - len([e for e in errors if e.startswith('Could not fetch')])}; assets saved: {len(fetched)}")
    if errors:
        print("Errors:")
        for error in errors:
            print(error)
        raise SystemExit(1)


if __name__ == "__main__":
    main()
