import sys, re

def replace_tokens(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Layout changes
    content = content.replace("<main style={{ padding: '40px', marginTop: '60px' }}>", '<main className="dashboard-content">')

    # Recharts specific changes (UsageHistory)
    content = content.replace('fill="#3b82f6"', 'fill="#6c8eef"')

    # General Hex to Var Replacements
    replacements = [
        (r'#111827|#1e1b17|#2e2a25|#1f2937', 'var(--text-primary)'),
        (r'#6b7280|#4b5563|#374151', 'var(--text-secondary)'),
        (r'#9ca3af', 'var(--text-tertiary)'),
        (r'#2563eb|#3b82f6|#4f46e5', 'var(--color-primary-600)'),
        (r'#10b981|#059669', 'var(--color-success-600)'),
        (r'#ef4444|#dc2626|#b91c1c', 'var(--color-danger-600)'),
        (r'#f59e0b|#d97706|#ea580c', 'var(--color-warning-600)'),
        (r'#ffffff', 'var(--bg-card)'),
        (r'#f9fafb|#f3f4f6', 'var(--bg-card-hover)'),
        (r'#e5e7eb|#d1d5db', 'var(--border-default)'),
        (r'#1e3a8a', 'var(--color-primary-900)'),
        (r'#d1fae5|#ecfdf5', 'var(--color-success-50)'),
        (r'#fee2e2|#fef2f2', 'var(--color-danger-50)'),
        (r'#fef3c7|#fffbeb', 'var(--color-warning-50)'),
        (r'#eff6ff|#dbeafe', 'var(--color-primary-50)'),
        (r'#e0e7ff', 'var(--color-primary-100)'),
        (r'#bfdbfe', 'var(--color-primary-200)'),
        (r'#065f46|#047857', 'var(--color-success-700)'),
        (r'#991b1b', 'var(--color-danger-700)'),
        (r'#92400e', 'var(--color-warning-700)'),
        (r'#fde68a', 'var(--color-warning-400)')
    ]

    for pat, rep in replacements:
        content = re.sub(pat, rep, content, flags=re.IGNORECASE)

    # Some additional manual fixes for variables in string templates in MyBills
    content = content.replace("`1px solid ${selectedBill.status === 'PAID' ? 'var(--color-success-50)' : 'var(--color-danger-50)'}`", "`1px solid ${selectedBill.status === 'PAID' ? 'var(--border-default)' : 'var(--color-danger-50)'}`")
    
    # Fix gradients to use vars syntax properly
    content = content.replace("linear-gradient(135deg, var(--color-primary-600), var(--color-primary-600))", "var(--bg-card)")
    content = content.replace("linear-gradient(135deg, var(--color-success-600), var(--color-success-600))", "var(--bg-card)")

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

files = [
    'd:/My projects/water-usage-and-billing-platform/frontend/src/pages/UsageHistory.jsx',
    'd:/My projects/water-usage-and-billing-platform/frontend/src/pages/MyBills.jsx',
    'd:/My projects/water-usage-and-billing-platform/frontend/src/pages/Notifications.jsx',
    'd:/My projects/water-usage-and-billing-platform/frontend/src/pages/Profile.jsx'
]

for file in files:
    replace_tokens(file)
print('Done!')
