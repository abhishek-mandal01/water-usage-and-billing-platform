import re

path = r"d:\My projects\water-usage-and-billing-platform\frontend\src\pages\Profile.jsx"

with open(path, "r", encoding="utf-8") as f:
    content = f.read()

def replace_prop(m):
    prop = m.group(1)
    colon = m.group(2)
    parts = prop.split('-')
    camel = parts[0] + ''.join(p.capitalize() for p in parts[1:])
    return f"{camel}{colon}"

new_content = re.sub(r'([a-z]+-[a-z]+)(\s*:)', replace_prop, content)

with open(path, "w", encoding="utf-8") as f:
    f.write(new_content)

print("Fixed camelCase style properties in Profile.jsx")
