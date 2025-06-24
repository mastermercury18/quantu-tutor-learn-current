# scripts/dump_aquarat.py
#!/usr/bin/env python3
"""
Load the DeepMind AquaRAT dataset via HuggingFace datasets
and dump it to a local JSON file for your frontend to consume.
"""

import json
import argparse
from datasets import load_dataset

def main(split: str, out_path: str):
    # Load the requested split
    ds = load_dataset('deepmind/aqua_rat', split=split)

    # Convert each record to plain dict
    records = []
    for item in ds:
        records.append({
            'id': item.get('id', ''),
            'question': item['question'],
            'options': item.get('options', []),
            'answer': item.get('correct', ''),
            'explanation': item.get('rationale', '')
        })

    # Write out as a JSON array
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(records, f, ensure_ascii=False, indent=2)

    print(f"Dumped {len(records)} AquaRAT items to {out_path}")

if __name__ == '__main__':
    parser = argparse.ArgumentParser(
        description="Dump deepmind/aqua_rat to a local JSON file"
    )
    parser.add_argument(
        '--split', '-s',
        default='train',
        help="Which split to load (train, validation, test, etc.)"
    )
    parser.add_argument(
        '--out', '-o',
        default='src/data/aquarat.json',
        help="Where to write the JSON file"
    )
    args = parser.parse_args()
    main(args.split, args.out)
