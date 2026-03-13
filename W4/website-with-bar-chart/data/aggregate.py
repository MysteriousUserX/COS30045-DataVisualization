import csv
from collections import Counter

input_file = 'tv_energy.csv'
output_file = 'tvBrandCount.csv'

try:
    with open(input_file, mode='r', encoding='utf-8') as infile:
        reader = csv.DictReader(infile)
        brand_counts = Counter()
        for row in reader:
            brand = row.get('Brand_Reg', '').strip()
            if brand:
                brand_counts[brand] += 1
                
    with open(output_file, mode='w', encoding='utf-8', newline='') as outfile:
        writer = csv.DictWriter(outfile, fieldnames=['brand', 'count'])
        writer.writeheader()
        for brand, count in brand_counts.most_common():
            writer.writerow({'brand': brand, 'count': count})
            
    print(f"Successfully created {output_file} with {len(brand_counts)} brands.")
except Exception as e:
    print(f"Error: {e}")
