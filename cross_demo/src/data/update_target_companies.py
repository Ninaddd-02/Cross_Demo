#!/usr/bin/env python3
"""Generate targetCompanies and update other data structures from real deals"""

import json

# Read the sharedData.js file
with open('sharedData.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract company names from allDeals section
import re

# Find all company names in allDeals
companies_by_rep = {1: set(), 2: set(), 3: set(), 4: set()}
industry_map = {}

# Parse the deals to extract unique companies per rep
deals_pattern = r"company: '([^']+)',.*?repId: (\d+).*?industry: '([^']+)',.*?sector: '([^']+)',"
matches = re.findall(deals_pattern, content, re.DOTALL)

for company, rep_id, industry, sector in matches:
    rep_id = int(rep_id)
    companies_by_rep[rep_id].add(company)
    if company not in industry_map:
        industry_map[company] = {'industry': industry, 'sector': sector}

# Count deals per company per rep
deals_count = {}
for match in re.finditer(r"company: '([^']+)',.*?repId: (\d+)", content, re.DOTALL):
    company, rep_id = match.groups()
    rep_id = int(rep_id)
    key = (rep_id, company)
    deals_count[key] = deals_count.get(key, 0) + 1

# Generate targetCompanies structure
target_companies_js = """export const targetCompanies = [
"""

rep_names = {
    1: 'Rahul Sharma',
    2: 'Priya Mehta',
    3: 'Amit Kumar',
    4: 'Neha Singh'
}

for rep_id in [1, 2, 3, 4]:
    target_companies_js += f"""  {{
    repId: {rep_id},
    repName: '{rep_names[rep_id]}',
    targets: [
"""
    
    # Get top companies for this rep
    companies = list(companies_by_rep[rep_id])[:4]  # Top 4 companies per rep
    
    for idx, company in enumerate(companies):
        deal_count = deals_count.get((rep_id, company), 0)
        info = industry_map.get(company, {'industry': 'Technology', 'sector': 'IT Services'})
        
        # Determine status based on deal count
        if deal_count >= 3:
            status = 'active'
            priority = 'high'
        elif deal_count >= 2:
            status = 'active'
            priority = 'medium'
        elif deal_count == 1:
            status = 'warm-prospect'
            priority = 'medium'
        else:
            status = 'new-prospect'
            priority = 'low'
        
        # Calculate approximate pipeline value (simplified)
        pipeline_value = f'₹{deal_count * 7.5:.1f} Cr' if deal_count > 0 else '₹0 Cr'
        
        # Generate next action
        actions = [
            'Follow-up on proposal review',
            'Schedule executive alignment call',
            'Demo presentation next week',
            'Contract negotiation in progress',
            'Initial discovery call scheduled',
            'Research requirements and pain points'
        ]
        next_action = actions[idx % len(actions)]
        
        target_companies_js += f"""      {{
        company: '{company}',
        status: '{status}',
        priority: '{priority}',
        activeDeals: {deal_count},
        pipelineValue: '{pipeline_value}',
        nextAction: '{next_action}',
        industry: '{info['sector']}'
      }}"""
        
        if idx < len(companies) - 1:
            target_companies_js += ","
        target_companies_js += "\n"
    
    target_companies_js += "    ]"
    if rep_id < 4:
        target_companies_js += ","
    target_companies_js += "\n  }\n"

target_companies_js += """];

// Get activities for a specific rep"""

# Find the targetCompanies section in the file
start_marker = "export const targetCompanies = ["
end_marker = "// Get activities for a specific rep"

start_pos = content.find(start_marker)
end_pos = content.find(end_marker)

if start_pos == -1 or end_pos == -1:
    print("Error: Could not find targetCompanies markers")
    exit(1)

# Replace the section
new_content = content[:start_pos] + target_companies_js + content[end_pos:]

# Write back
with open('sharedData.js', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("✓ Successfully updated targetCompanies with real data")
print(f"  - Generated target companies for 4 reps")
for rep_id in [1, 2, 3, 4]:
    print(f"  - Rep {rep_id} ({rep_names[rep_id]}): {len(companies_by_rep[rep_id])} unique companies")
