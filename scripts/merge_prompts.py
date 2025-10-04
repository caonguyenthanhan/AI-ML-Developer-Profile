import json
from pathlib import Path

PUBLIC_PATH = Path('public/data/prompts.json')
VIP_PATH = Path('private/prompts_vip.json')
PLACEHOLDER = 'liên hệ admin'

def load_json(path: Path):
    with path.open('r', encoding='utf-8') as f:
        return json.load(f)

def save_json(path: Path, data):
    with path.open('w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

def main():
    if not PUBLIC_PATH.exists():
        print(f'Missing {PUBLIC_PATH}')
        return
    if not VIP_PATH.exists():
        print(f'Missing {VIP_PATH}')
        return

    public_data = load_json(PUBLIC_PATH)
    vip_data = load_json(VIP_PATH)

    public_by_id = {item.get('id'): item for item in public_data}
    added = 0
    updated = 0

    for vip in vip_data:
        vid = vip.get('id')
        if vid in public_by_id:
            item = public_by_id[vid]
            if item.get('prompt') != PLACEHOLDER:
                item['prompt'] = PLACEHOLDER
                updated += 1
        else:
            stub = {
                'id': vip.get('id'),
                'title': vip.get('title'),
                'prompt': PLACEHOLDER,
                'imagePath': vip.get('imagePath'),
                'category': vip.get('category')
            }
            public_data.append(stub)
            public_by_id[vid] = stub
            added += 1

    save_json(PUBLIC_PATH, public_data)
    print(f'VIP merge completed. Added: {added}, Updated: {updated}, Total: {len(public_data)}')

if __name__ == '__main__':
    main()