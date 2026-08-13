import os
import re

src_dir = r"d:\My projects\water-usage-and-billing-platform\frontend\src"

pattern = re.compile(r'\bt\(([^)]+)\)')

dynamic_calls = []

for root, _, files in os.walk(src_dir):
    for file in files:
        if file.endswith(".jsx") or file.endswith(".js"):
            file_path = os.path.join(root, file)
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()
                matches = pattern.findall(content)
                for m in matches:
                    if '`' in m or '${' in m or ('+' in m and '"' in m) or (not m.strip().startswith('"') and not m.strip().startswith("'")):
                        dynamic_calls.append((file, m))

print(f"Total dynamic t() calls: {len(dynamic_calls)}")
for f, m in dynamic_calls:
    print(f"{f}: t({m})")
