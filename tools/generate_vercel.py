import json
import os

ROOT = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(os.path.dirname(ROOT), "public", "data", "links.json")
VERCEL = os.path.join(os.path.dirname(ROOT), "vercel.json")

def load_links():
    with open(DATA, "r", encoding="utf-8") as f:
        return json.load(f)

def make_rewrites(links):
    rewrites = []
    rewrites.append({"source": "/api/:match*", "destination": "/api/:match*"})
    home = None
    for link in links.get("links", []):
        if link.get("id") == "home":
            home = link
        for p in link.get("paths", []):
            rewrites.append({"source": p, "destination": link.get("destination")})
    return {"rewrites": rewrites}

def main(write=True):
    links = load_links()
    cfg = make_rewrites(links)
    text = json.dumps(cfg, ensure_ascii=False, indent=2)
    if write:
        with open(VERCEL, "w", encoding="utf-8") as f:
            f.write(text + "\n")
    else:
        print(text)

if __name__ == "__main__":
    main()
