#!/usr/bin/env python3
"""Generate AI recommendations from cross_sell and up_sell data"""

import pandas as pd
import random

# Read the CSV
df = pd.read_csv('data_tenant1.csv')

# Filter to deals we're showing in the app (top value deals per region)
north_deals = df[df['SalesRegion'] == 'North'].nlargest(12, 'ProjectValue')
south_deals = df[df['SalesRegion'] == 'South'].nlargest(12, 'ProjectValue')
east_deals = df[df['SalesRegion'] == 'East'].nlargest(8, 'ProjectValue')
central_deals = df[df['SalesRegion'] == 'Central'].nlargest(4, 'ProjectValue')
west_deals = df[df['SalesRegion'] == 'West'].nlargest(12, 'ProjectValue')

selected_deals = pd.concat([north_deals, south_deals, east_deals, central_deals, west_deals])

print(f"Generating AI recommendations from {len(selected_deals)} deals...")

recommendations = []
rec_id = 1

for idx, deal in selected_deals.iterrows():
    deal_id = rec_id  # Will match our generated deal IDs
    company = deal['AccountName']
    
    # Process Cross Sell opportunities
    for i in range(1, 4):  # Cross Sell 1, 2, 3
        service_col = f'Cross Sell {i} Service'
        tech_col = f'Cross Sell {i} Technology'
        partner_col = f'Cross Sell {i} Partner'
        value_col = f'Cross Sell {i} Projected Value'
        cm_col = f'Cross Sell {i} CM'
        
        if pd.notna(deal[service_col]) and pd.notna(deal[value_col]):
            try:
                value = float(deal[value_col]) / 10_000_000  # Convert to Crores
                cm = float(deal[cm_col]) / 10_000_000 if pd.notna(deal[cm_col]) else value * 0.25
                
                #  Calculate confidence score (60-95% based on value and margin)
                base_confidence = 60 + (value / 10 * 20)  # Higher value = higher confidence
                confidence = min(95, max(60, int(base_confidence)))
                
                tech = deal[tech_col] if pd.notna(deal[tech_col]) else 'Technology Services'
                partner = deal[partner_col] if pd.notna(deal[partner_col]) else 'Various Partners'
                
                rec = {
                    'id': len(recommendations) + 1,
                    'dealId': deal_id,
                    'company': company,
                    'type': 'cross-sell',
                    'service': deal[service_col],
                    'technology': tech,
                    'partner': partner,
                    'projectedValue': round(value, 2),
                    'cm': round(cm, 2),
                    'confidence': confidence,
                    'priority': 'high' if value > 3 else ('medium' if value > 1 else 'low')
                }
                recommendations.append(rec)
            except (ValueError, TypeError):
                pass
    
    # Process Up Sell opportunities
    for i in range(1, 4):  # Up Sell 1, 2, 3
        service_col = f'Up Sell {i} Service'
        tech_col = f'Up Sell {i} Technology'
        partner_col = f'Up Sell {i} Partner'
        value_col = f'Up Sell {i} Projected Value'
        cm_col = f'Up Sell {i} CM'
        
        if pd.notna(deal[service_col]) and pd.notna(deal[value_col]):
            try:
                value = float(deal[value_col]) / 10_000_000
                cm = float(deal[cm_col]) / 10_000_000 if pd.notna(deal[cm_col]) else value * 0.25
                
                base_confidence = 70 + (value / 10 * 15)  # Up-sells typically higher confidence
                confidence = min(95, max(65, int(base_confidence)))
                
                tech = deal[tech_col] if pd.notna(deal[tech_col]) else 'Technology Upgrade'
                partner = deal[partner_col] if pd.notna(deal[partner_col]) else 'Various Partners'
                
                rec = {
                    'id': len(recommendations) + 1,
                    'dealId': deal_id,
                    'company': company,
                    'type': 'up-sell',
                    'service': deal[service_col],
                    'technology': tech,
                    'partner': partner,
                    'projectedValue': round(value, 2),
                    'cm': round(cm, 2),
                    'confidence': confidence,
                    'priority': 'high' if value > 3 else ('medium' if value > 1 else 'low')
                }
                recommendations.append(rec)
            except (ValueError, TypeError):
                pass
    
    rec_id += 1

print(f"\n✓ Generated {len(recommendations)} AI recommendations")
print(f"  - Cross-sell opportunities: {len([r for r in recommendations if r['type'] == 'cross-sell'])}")
print(f"  - Up-sell opportunities: {len([r for r in recommendations if r['type'] == 'up-sell'])}")

# Generate JavaScript format
js_output = "// AI RECOMMENDATIONS extracted from real data\n"
js_output += f"// Generated from {len(selected_deals)} deals with cross-sell/up-sell opportunities\n\n"
js_output += "export const aiRecommendations = [\n"

for rec in recommendations[:50]:  # Limit to top 50 for performance
    js_output += f"  {{\n"
    js_output += f"    id: {rec['id']},\n"
    js_output += f"    dealId: {rec['dealId']},\n"
    js_output += f"    company: '{rec['company']}',\n"
    js_output += f"    type: '{rec['type']}',\n"
    js_output += f"    title: '{rec['service']} - {rec['technology']}',\n"
    js_output += f"    service: '{rec['service']}',\n"
    js_output += f"    technology: '{rec['technology']}',\n"
    js_output += f"    partner: '{rec['partner']}',\n"
    js_output += f"    projectedValue: {rec['projectedValue']},\n"
    js_output += f"    valueFormatted: '₹{rec['projectedValue']} Cr',\n"
    js_output += f"    cm: {rec['cm']},\n"
    js_output += f"    cmFormatted: '₹{rec['cm']} Cr',\n"
    js_output += f"    confidence: {rec['confidence']},\n"
    js_output += f"    priority: '{rec['priority']}',\n"
    js_output += f"    recommendedFor: 'deal-{rec['dealId']}'\n"
    js_output += f"  }},\n"

js_output = js_output.rstrip(',\n') + "\n];\n"

# Save recommendations
with open('ai_recommendations_output.txt', 'w', encoding='utf-8') as f:
    f.write(js_output)

print(f"\n✓ Saved top 50 recommendations to: ai_recommendations_output.txt")
