import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
import re
import os

def clean_text(text):
    if pd.isna(text):
        return ""
    # Remove HTML tags, special chars
    text = re.sub(r'<[^>]+>', '', text)
    text = re.sub(r'[^a-zA-Z0-9\s.,;-]', '', text)
    return text.lower().strip()

def main():
    print("Starting dataset preprocessing...")
    data_dir = '../data'
    os.makedirs(data_dir, exist_ok=True)
    
    input_file = os.path.join(data_dir, 'raw_interactions.csv')
    output_file = os.path.join(data_dir, 'drug_interactions.csv')
    
    if not os.path.exists(input_file):
        print(f"No raw data found at {input_file}. Creating synthetic data for training.")
        df = pd.DataFrame({
            'Drug_A': ['warfarin', 'fluoxetine', 'metformin', 'aspirin', 'ibuprofen', 'lisinopril', 'amiodarone'],
            'Drug_B': ['aspirin', 'selegiline', 'alcohol', 'clopidogrel', 'naproxen', 'potassium', 'digoxin'],
            'Severity': ['major', 'contraindicated', 'moderate', 'major', 'minor', 'major', 'major'],
            'Description': [
                'Increases bleeding risk due to synergistic antiplatelet/anticoagulant effects.',
                'Severe serotonin syndrome risk. Do not combine.',
                'Increased risk of lactic acidosis.',
                'Increased risk of gastrointestinal bleeding.',
                'May reduce efficacy and increase GI risk.',
                'Risk of severe hyperkalemia.',
                'Amiodarone increases digoxin toxicity.'
            ]
        })
    else:
        df = pd.read_csv(input_file)

    # 1. Drop duplicates
    df = df.drop_duplicates()

    # 2. Clean Text
    df['Drug_A'] = df['Drug_A'].apply(clean_text)
    df['Drug_B'] = df['Drug_B'].apply(clean_text)
    df['Description'] = df['Description'].apply(clean_text)

    # 3. Handle Missing Values
    df = df.dropna(subset=['Drug_A', 'Drug_B', 'Severity'])
    df['Description'] = df['Description'].fillna("No description available.")

    # 4. Standardize Severity
    valid_severities = ['none', 'minor', 'moderate', 'major', 'contraindicated']
    df['Severity'] = df['Severity'].apply(lambda x: x if x in valid_severities else 'unknown')
    df = df[df['Severity'] != 'unknown']

    print(f"Preprocessed {len(df)} records. Saving to {output_file}")
    df.to_csv(output_file, index=False)

if __name__ == "__main__":
    main()
