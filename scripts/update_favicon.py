import os
import re

PUBLIC_DIR = r"D:\desktop\AIML Developer Profile\public"
ROOT_INDEX = r"D:\desktop\AIML Developer Profile\index.html"

FAVICON_PUBLIC = "/image/tag.png"
FAVICON_ROOT = "public/image/tag.png"

LINK_TAG_TEMPLATE = '<link rel="icon" type="image/png" href="{href}">'

icon_link_regex = re.compile(r"<link[^>]*rel=[\"']icon[\"'][^>]*>", re.IGNORECASE)
href_attr_regex = re.compile(r"href=([\"'])(.*?)(\1)", re.IGNORECASE)
head_open_regex = re.compile(r"<head[^>]*>", re.IGNORECASE)


def ensure_favicon(content: str, href: str) -> str:
    if icon_link_regex.search(content):
        def replace_href(match):
            tag = match.group(0)
            if href_attr_regex.search(tag):
                tag = href_attr_regex.sub(lambda m: f"href={m.group(1)}{href}{m.group(1)}", tag)
            else:
                tag = tag[:-1] + f' href="{href}">'
            return tag
        content = icon_link_regex.sub(replace_href, content, count=1)
        return content

    head_match = head_open_regex.search(content)
    if not head_match:
        return content

    insert_pos = head_match.end()
    new_content = content[:insert_pos] + "\n    " + LINK_TAG_TEMPLATE.format(href=href) + content[insert_pos:]
    return new_content


def process_html_file(path: str, href: str) -> bool:
    try:
        with open(path, "r", encoding="utf-8") as f:
            original = f.read()
        updated = ensure_favicon(original, href)
        updated = updated.replace("href=\"image/tag.png\"", f"href=\"{FAVICON_PUBLIC}\"")
        updated = updated.replace("href='image/tag.png'", f"href='{FAVICON_PUBLIC}'")
        if updated != original:
            with open(path, "w", encoding="utf-8") as f:
                f.write(updated)
            print(f"Updated favicon in: {path}")
            return True
        else:
            print(f"No change needed: {path}")
            return False
    except Exception as e:
        print(f"Error processing {path}: {e}")
        return False


def main():
    changes = 0
    for root, dirs, files in os.walk(PUBLIC_DIR):
        for name in files:
            if name.lower().endswith(".html"):
                file_path = os.path.join(root, name)
                if process_html_file(file_path, FAVICON_PUBLIC):
                    changes += 1
    if os.path.exists(ROOT_INDEX):
        if process_html_file(ROOT_INDEX, FAVICON_ROOT):
            changes += 1
    print(f"Total files updated: {changes}")


if __name__ == "__main__":
    main()