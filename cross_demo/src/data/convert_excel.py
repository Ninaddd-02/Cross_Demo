import pandas as pd
import json
import sys

# Read Excel file
excel_path = r'C:\Users\Lenovo\Desktop\Prototype\cross_demo\cross_demo\src\data\data_tenant1.xlsx'
csv_path = r'C:\Users\Lenovo\Desktop\Prototype\cross_demo\cross_demo\src\data\data_tenant1.csv'

try:
    print("Reading Excel file...")
    df = pd.read_excel(excel_path)
    
    # Save as CSV
    print("Converting to CSV...")
    df.to_csv(csv_path, index=False)
    
    print(f"\n✓ Successfully converted to CSV")
    print(f"\nData Analysis:")
    print(f"Total rows: {len(df)}")
    print(f"\nColumns ({len(df.columns)}):")
    for col in df.columns:
        print(f"  - {col}")
    
    # Check for salesregion column
    if 'salesregion' in df.columns:
        print(f"\nRegional distribution:")
        region_counts = df['salesregion'].value_counts()
        for region, count in region_counts.items():
            print(f"  {region}: {count} deals")
    
    print(f"\nFirst row sample:")
    print(df.head(1).to_string())
    
except Exception as e:
    print(f"✗ Error: {e}")
    sys.exit(1)
