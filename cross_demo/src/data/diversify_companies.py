import re
from collections import defaultdict
import json

# Read the sharedData.js file
with open('sharedData.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Parse deals line by line
current_deal = {}
deals = []
in_deals_section = False

for i, line in enumerate(lines):
    line = line.strip()
    
    if 'export const allDeals' in line:
        in_deals_section = True
        continue
    
    if in_deals_section:
        if line.startswith('export const') and 'allDeals' not in line:
            break
            
        # Extract fields
        if 'company:' in line:
            match = re.search(r"company:\s*'([^']+)'", line)
            if match:
                current_deal['company'] = match.group(1)
        elif 'value:' in line and 'valueFormatted' not in line:
            match = re.search(r'value:\s*([\d.]+)', line)
            if match:
                current_deal['value'] = float(match.group(1))
        elif 'region:' in line:
            match = re.search(r"region:\s*'([^']+)'", line)
            if match:
                current_deal['region'] = match.group(1)
        elif 'repId:' in line:
            match = re.search(r'repId:\s*(\d+)', line)
            if match:
                current_deal['repId'] = int(match.group(1))
        elif 'industry:' in line and 'sector' not in line:
            match = re.search(r"industry:\s*'([^']+)'", line)
            if match:
                current_deal['industry'] = match.group(1)
        
        # Check if deal is complete
        if line.strip() == '},' or line.strip() == '}':
            if len(current_deal) >= 5:  # Has all required fields
                deals.append(current_deal.copy())
            current_deal = {}

print(f"Found {len(deals)} deals")

# Group by region and company
region_companies = defaultdict(lambda: defaultdict(lambda: {'total_value': 0, 'deals': 0, 'industry': ''}))

for deal in deals:
    company = deal.get('company', '')
    value = deal.get('value', 0)
    region = deal.get('region', '')
    rep_id = deal.get('repId', 0)
    industry = deal.get('industry', '')
    
    if all([company, region, rep_id, industry]):
        region_companies[region][company]['total_value'] += value
        region_companies[region][company]['deals'] += 1
        region_companies[region][company]['industry'] = industry
        region_companies[region][company]['rep_id'] = rep_id

# Print analysis
print("=" * 80)
print("COMPANIES BY REGION ANALYSIS")
print("=" * 80)

# Debug: Show what regions we found
print(f"\nRegions found: {list(region_companies.keys())}")
for region in sorted(region_companies.keys()):
    print(f"\n{region}:")
    for company, stats in sorted(region_companies[region].items(), key=lambda x: x[1]['total_value'], reverse=True):
        print(f"  {company}: ₹{stats['total_value']:.2f} Cr ({stats['deals']} deals)")

# Collect ALL unique companies across all regions
all_companies = {}
for region in region_companies:
    for company, stats in region_companies[region].items():
        if company not in all_companies:
            all_companies[company] = {'total_value': 0, 'deals': 0, 'industry': stats['industry'], 'regions': []}  
        all_companies[company]['total_value'] += stats['total_value']
        all_companies[company]['deals'] += stats['deals']
        if region not in all_companies[company]['regions']:
            all_companies[company]['regions'].append(region)

print(f"\n{'='*80}")
print(f"TOTAL UNIQUE COMPANIES: {len(all_companies)}")
print(f"{'='*80}")
for company, stats in sorted(all_companies.items(), key=lambda x: x[1]['total_value'], reverse=True):
    print(f"{company}:")
    print(f"  Total Pipeline: ₹{stats['total_value']:.2f} Cr | Total Deals: {stats['deals']}")
    print(f"  Regions: {', '.join(stats['regions'])}")
    print()

rep_assignments = {
    1: {'name': 'Rahul Sharma', 'regions': ['North']},
    2: {'name': 'Priya Mehta', 'regions': ['South']},
    3: {'name': 'Amit Kumar', 'regions': ['East', 'Central']},
    4: {'name': 'Neha Singh', 'regions': ['West']}
}

all_assigned_companies = set()
target_companies_output = []

# Since there are only 3 unique companies, assign all to each rep but with different priorities based on regional strength
for rep_id, rep_info in sorted(rep_assignments.items()):
    print(f"\n{'='*80}")
    print(f"Rep {rep_id}: {rep_info['name']} - {', '.join(rep_info['regions'])}")
    print(f"{'='*80}")
    
    # Collect all companies from this rep's regions with their stats
    rep_companies = {}
    for region in rep_info['regions']:
        if region in region_companies:
            for company, stats in region_companies[region].items():
                if company not in rep_companies:
                    rep_companies[company] = {'total_value': 0, 'deals': 0, 'industry': stats['industry']}
                rep_companies[company]['total_value'] += stats['total_value']
                rep_companies[company]['deals'] += stats['deals']
    
    # Sort by total value in this rep's region(s)
    sorted_companies = sorted(rep_companies.items(), key=lambda x: x[1]['total_value'], reverse=True)
    
    rep_targets = []
    for i, (company, stats) in enumerate(sorted_companies):
        # Assign priority and status based on position
        if i == 0:
            priority = 'high'
            status = 'active'
            next_action = 'Close pending deals this quarter'
        elif i == 1:
            priority = 'medium'
            status = 'active'
            next_action = 'Schedule executive alignment call'
        else:
            priority = 'medium'
            status = 'warm-prospect'
            next_action = 'Demo presentation scheduled'
        
        print(f"  #{i+1} - {company}")
        print(f"       Status: {status} | Priority: {priority}")
        print(f"       Pipeline: ₹{stats['total_value']:.2f} Cr | Active Deals: {stats['deals']}")
        print(f"       Next Action: {next_action}")
        print()
        
        rep_targets.append({
            'company': company,
            'total_value': stats['total_value'],
            'deals': stats['deals'],
            'industry': stats['industry'],
            'status': status,
            'priority': priority,
            'next_action': next_action
        })
    
    # Generate targetCompanies entry
    target_entry = f"""  {{
    repId: {rep_id},
    repName: '{rep_info['name']}',
    targets: ["""
    
    for i, target in enumerate(rep_targets):
        target_entry += f"""
      {{
        company: '{target['company']}',
        status: '{target['status']}',
        priority: '{target['priority']}',
        activeDeals: {target['deals']},
        pipelineValue: '₹{target['total_value']:.1f} Cr',
        nextAction: '{target['next_action']}',
        industry: '{target['industry']}'
      }}"""
        if i < len(rep_targets) - 1:
            target_entry += ","
    
    target_entry += """
    ]
  }"""
    
    target_companies_output.append(target_entry)

print("\n" + "=" * 80)
print("GENERATED targetCompanies ARRAY")
print("=" * 80)
print("\nexport const targetCompanies = [")
print(",\n".join(target_companies_output))
print("\n];")

# Save to file
with open('target_companies_updated.txt', 'w', encoding='utf-8') as f:
    f.write("export const targetCompanies = [\n")
    f.write(",\n".join(target_companies_output))
    f.write("\n];")

print("\n✓ Output saved to target_companies_updated.txt")
