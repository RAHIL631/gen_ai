from datasets import Dataset
from transformers import (
    AutoTokenizer,
    AutoModelForSequenceClassification,
    TrainingArguments,
    Trainer
)
import pandas as pd
from sklearn.model_selection import train_test_split
import os

def main():
    # Ensure data directory exists
    os.makedirs('../data', exist_ok=True)
    
    csv_path = '../data/drug_interactions.csv'
    
    # Check if dataset exists, if not provide a dummy one for testing
    if not os.path.exists(csv_path):
        print(f"Dataset not found at {csv_path}. Creating a sample dataset...")
        sample_data = {
            'Drug_A': ['warfarin', 'fluoxetine', 'metformin', 'aspirin', 'ibuprofen'],
            'Drug_B': ['aspirin', 'selegiline', 'alcohol', 'clopidogrel', 'naproxen'],
            'Severity': ['major', 'contraindicated', 'moderate', 'major', 'minor'],
            'Description': [
                'Bleeding risk increases...',
                'Severe serotonin syndrome...',
                'Lactic acidosis risk...',
                'Increased risk of gastrointestinal bleeding.',
                'May reduce efficacy and increase GI risk.'
            ]
        }
        pd.DataFrame(sample_data).to_csv(csv_path, index=False)
        print("Sample dataset created.")

    # Load dataset
    df = pd.read_csv(csv_path)

    severity_map = {
        'none': 0,
        'minor': 1,
        'moderate': 2,
        'major': 3,
        'contraindicated': 4
    }

    # Create text
    df['text'] = df.apply(
        lambda x: f"Interaction between {x['Drug_A']} and {x['Drug_B']}: {x['Description']}",
        axis=1
    )

    # Labels
    df['label'] = df['Severity'].map(severity_map)

    # In case there are not enough samples for 0.2 split, handle gracefully
    if len(df) > 5:
        train_df, test_df = train_test_split(df, test_size=0.2, random_state=42)
    else:
        train_df, test_df = df, df

    train_dataset = Dataset.from_pandas(train_df)
    test_dataset = Dataset.from_pandas(test_df)

    model_name = 'microsoft/BiomedNLP-PubMedBERT-base-uncased-abstract-fulltext'

    tokenizer = AutoTokenizer.from_pretrained(model_name)

    def tokenize(batch):
        return tokenizer(
            batch['text'],
            truncation=True,
            padding='max_length',
            max_length=256
        )

    train_dataset = train_dataset.map(tokenize, batched=True)
    test_dataset = test_dataset.map(tokenize, batched=True)

    model = AutoModelForSequenceClassification.from_pretrained(
        model_name,
        num_labels=5
    )

    training_args = TrainingArguments(
        output_dir='../models/results',
        evaluation_strategy='epoch',
        learning_rate=2e-5,
        per_device_train_batch_size=8,
        per_device_eval_batch_size=8,
        num_train_epochs=5,
        weight_decay=0.01,
        save_strategy='epoch'
    )

    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=train_dataset,
        eval_dataset=test_dataset
    )

    print("Starting training...")
    trainer.train()

    print("Saving model...")
    trainer.save_model('../models/trained_model')
    tokenizer.save_pretrained('../models/trained_model')
    print("Training complete.")

if __name__ == '__main__':
    main()
