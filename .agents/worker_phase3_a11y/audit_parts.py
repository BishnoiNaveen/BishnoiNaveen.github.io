import base64
parts = []
parts.append(base64.b64decode('SGVsbG8gV29ybGQh').decode('utf-8'))
with open('.agents/ACCESSIBILITY_AUDIT.md', 'w', encoding='utf-8') as out:
    out.write(''.join(parts))
