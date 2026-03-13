#!/usr/bin/env python3
"""Fix encoding issues in sharedData.js"""

# Read the file
with open('sharedData.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix common encoding issues
fixes = {
    'â‚¹': '₹',  # Rupee symbol
    'Ã¨': 'è',   # e with grave
    'Ã©': 'é',   # e with acute
    'Ã ': 'à',   # a with grave
    'Ã¢': 'â',   # a with circumflex
    'Ã´': 'ô',   # o with circumflex
    'Ã§': 'ç',   # c with cedilla
    'Ã«': 'ë',   # e with diaeresis
    'Ã¯': 'ï',   # i with diaeresis
    'Ã¼': 'ü',   # u with diaeresis
}

for bad, good in fixes.items():
    content = content.replace(bad, good)

# Write back with proper encoding
with open('sharedData.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("✓ Fixed encoding issues in sharedData.js")
print("  - Replaced corrupted Rupee symbols (₹)")
print("  - Fixed special character encodings")
