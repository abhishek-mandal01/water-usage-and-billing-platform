import os
import re
import json

src_dir = r"d:\My projects\water-usage-and-billing-platform\frontend\src"
locales_path = os.path.join(src_dir, "locales", "en.json")

with open(locales_path, "r", encoding="utf-8") as f:
    en_data = json.load(f)

def get_nested(data, key):
    parts = key.split(".")
    curr = data
    for p in parts:
        if isinstance(curr, dict) and p in curr:
            curr = curr[p]
        else:
            return None
    return curr

# Find all t("...") calls
pattern = re.compile(r'\bt\(\s*["\']([^"\'\n]+)["\'](?:\s*,\s*["\']([^"\'\n]+)["\'])?')

missing = {}
found_calls = []

for root, _, files in os.walk(src_dir):
    for file in files:
        if file.endswith(".jsx") or file.endswith(".js"):
            file_path = os.path.join(root, file)
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()
                matches = pattern.findall(content)
                for key, default_val in matches:
                    found_calls.append((key, default_val, file))
                    val = get_nested(en_data, key)
                    if val is None:
                        if key not in missing:
                            missing[key] = []
                        missing[key].append((file, default_val))

print(f"Total t() calls found: {len(found_calls)}")
print(f"Total unique missing keys: {len(missing)}")
for k, files in sorted(missing.items()):
    print(f"MISSING: {k} -> in {list(set(f[0] for f in files))}")
