#!/usr/bin/env python3
"""
Simple script to generate diff-data.json from two OpenAPI spec files.
Usage: python generate_diff.py <old_spec> <new_spec> <output_json>
"""
import sys
import json
from report_generator import generate_report

def main():
    if len(sys.argv) != 4:
        print("Usage: python generate_diff.py <old_spec> <new_spec> <output_json>")
        sys.exit(1)
    
    old_spec = sys.argv[1]
    new_spec = sys.argv[2]
    output_file = sys.argv[3]
    
    print(f"Analyzing differences between:")
    print(f"  Old: {old_spec}")
    print(f"  New: {new_spec}")
    
    try:
        report = generate_report(old_spec, new_spec)
        
        # Read raw file contents for full diff view
        with open(old_spec, 'r', encoding='utf-8') as f:
            old_content = f.read()
        with open(new_spec, 'r', encoding='utf-8') as f:
            new_content = f.read()
        
        # Add raw contents to report
        report["raw_files"] = {
            "old": old_content,
            "new": new_content
        }
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
        
        print(f"✓ Successfully generated: {output_file}")
        print(f"  Total changes: {len(report.get('changes', []))}")
        
    except Exception as e:
        print(f"✗ Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
