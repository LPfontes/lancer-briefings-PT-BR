import json

with open(r'c:\Users\lpfon\Downloads\lancer-data-pt-br\lib\frames.json', 'r', encoding='utf-8') as f:
    data = json.load(f)
    sources = set(item.get('source') for item in data if 'source' in item)
    print("Frames sources:", sources)

with open(r'c:\Users\lpfon\Downloads\lancer-data-pt-br\lib\manufacturers.json', 'r', encoding='utf-8') as f:
    data = json.load(f)
    ids = set(item.get('id') for item in data if 'id' in item)
    print("Manufacturer IDs:", ids)
