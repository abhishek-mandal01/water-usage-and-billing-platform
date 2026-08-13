import os
import re

src_dir = r"d:\My projects\water-usage-and-billing-platform\frontend\src"

pattern = re.compile(r'\bt\(([^)]+)\)')

for root, _, files in os.walk(src_dir):
    for file in files:
        if file.endswith(".jsx") or file.endswith(".js"):
            file_path = os.path.join(root, file)
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                lines = f.readlines()
                for i, line in enumerate(lines):
                    for match in pattern.finditer(line):
                        expr = match.group(1).strip()
                        if 'communityAdmin' in expr or 'GENERAL' in expr or '`' in expr or not (expr.startswith('"') or expr.startswith("'")):
                            print(f"{file}:{i+1} -> t({expr})")
