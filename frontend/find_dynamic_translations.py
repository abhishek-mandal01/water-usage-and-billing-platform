import os
import re
import json

src_dir = r"d:\My projects\water-usage-and-billing-platform\frontend\src"

pattern_dyn = re.compile(r'\bt\(\s*(`[^`]+`|[a-zA-Z0-9_]+(?:\.[a-zA-Z0-9_]+)*)\s*\)')

for root, _, files in os.walk(src_dir):
    for file in files:
        if file.endswith(".jsx") or file.endswith(".js"):
            file_path = os.path.join(root, file)
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()
                matches = pattern_dyn.findall(content)
                for m in matches:
                    if not (m.startswith('"') or m.startswith("'")):
                        print(f"Dynamic in {file}: t({m})")
