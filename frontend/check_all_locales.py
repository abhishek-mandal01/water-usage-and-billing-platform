import os
import re
import json

locales_dir = r"d:\My projects\water-usage-and-billing-platform\frontend\src\locales"
src_dir = r"d:\My projects\water-usage-and-billing-platform\frontend\src"

locales = {}
for loc in ["en", "hi", "bn", "ta", "te", "mr"]:
    path = os.path.join(locales_dir, f"{loc}.json")
    with open(path, "r", encoding="utf-8") as f:
        locales[loc] = json.load(f)

pattern = re.compile(r'\bt\(\s*["\']([^"\'\n]+)["\']')

all_keys = set()
for root, _, files in os.walk(src_dir):
    for file in files:
        if file.endswith(".jsx") or file.endswith(".js"):
            file_path = os.path.join(root, file)
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()
                matches = pattern.findall(content)
                for k in matches:
                    all_keys.add(k)

# Add category keys
all_keys.add("communityAdmin.GENERAL")
all_keys.add("communityAdmin.MAINTENANCE")
all_keys.add("communityAdmin.CONSERVATION")
all_keys.add("communityAdmin.URGENT")
all_keys.add("chat.tooltip")

def get_nested(data, key):
    parts = key.split(".")
    curr = data
    for p in parts:
        if isinstance(curr, dict) and p in curr:
            curr = curr[p]
        else:
            return None
    return curr

for loc, data in locales.items():
    missing_in_loc = []
    for k in sorted(all_keys):
        if get_nested(data, k) is None:
            missing_in_loc.append(k)
    print(f"Locale {loc}: {len(missing_in_loc)} missing keys")
    if missing_in_loc:
        print(f"  First 10: {missing_in_loc[:10]}")
