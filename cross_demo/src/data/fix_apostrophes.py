#!/usr/bin/env python3
"""Fix unescaped apostrophes in JavaScript strings"""

# Read the file
with open('sharedData.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Find and fix unescaped single quotes within single-quoted strings
# Replace problematic patterns
fixes = {
    "Xamarin (Microsoft's Cross-Platform Tool)": "Xamarin (Microsoft Cross-Platform Tool)",
    "Dassault Systèmes": "Dassault Systemes",
}

for bad, good in fixes.items():
    content = content.replace(bad, good)

# Write back
with open('sharedData.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("✓ Fixed apostrophe issues in sharedData.js")
print("  - Removed problematic apostrophes from strings")
