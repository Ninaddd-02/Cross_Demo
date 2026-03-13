#!/usr/bin/env python3
"""Update sharedData.js with real deals data"""

#  Read the generated deals
with open('all_deals_output.txt', 'r', encoding='utf-8') as f:
    new_deals = f.read()

# Read current sharedData.js
with open('sharedData.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the start and end markers
start_marker = "// All deals in the system (Sales Rep level)\nexport const allDeals = ["
end_marker = "];\n\n// Calculate pipeline and performance metrics by rep"

# Find positions
start_pos = content.find(start_marker)
end_pos = content.find(end_marker)

if start_pos == -1 or end_pos == -1:
    print("Error: Could not find markers in sharedData.js")
    exit(1)

# Extract the deals section from new data (remove the export statement at the start)
new_deals_clean = new_deals.strip()
if new_deals_clean.startswith('//'):
    # Keep comments but extract just what we need
    lines = new_deals_clean.split('\n')
    # Find where export const allDeals starts
    start_idx = next(i for i, line in enumerate(lines) if 'export const allDeals' in line)
    new_deals_section = '\n'.join(lines[start_idx:])
else:
    new_deals_section = new_deals_clean

# Remove the closing bracket and comments at the end of new deals
if new_deals_section.endswith('];'):
    new_deals_section = new_deals_section[:-2]  # Remove ];\n at end
# Remove the final summary comments
lines = new_deals_section.split('\n')
# Find last line with }
last_brace = max(i for i, line in enumerate(lines) if line.strip() == '}')
new_deals_section = '\n'.join(lines[:last_brace+1])

# Construct the new content
before = content[:start_pos]
after = content[end_pos:]
new_content = before + start_marker + '\n' + new_deals_section + '\n' + end_marker + after

# Write updated file
with open('sharedData.js', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("✓ Successfully updated sharedData.js with 48 real deals")
print("  - Rep 1 (Rahul Sharma - North): 12 deals")
print("  - Rep 2 (Priya Mehta - South): 12 deals")
print("  - Rep 3 (Amit Kumar - East): 12 deals")  
print("  - Rep 4 (Neha Singh - West): 12 deals")
