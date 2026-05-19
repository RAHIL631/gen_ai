import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from sklearn.metrics import accuracy_score, precision_recall_fscore_support, classification_report, confusion_matrix
import pandas as pd
from datasets import Dataset
import numpy as np

def main():
    print("Evaluating PubMedBERT Interaction Model...")
    
    model_path = '../models/trained_model'
    try:
        tokenizer = AutoTokenizer.from_pretrained(model_path)
        model = AutoModelForSequenceClassification.from_pretrained(model_path)
    except:
        print("Model not found. Please run train_model.py first.")
        return

    csv_path = '../data/drug_interactions.csv'
    df = pd.read_csv(csv_path)

    severity_map = {'none': 0, 'minor': 1, 'moderate': 2, 'major': 3, 'contraindicated': 4}
    reverse_map = {v: k for k, v in severity_map.items()}

    df['text'] = df.apply(lambda x: f"Interaction between {x['Drug_A']} and {x['Drug_B']}: {x['Description']}", axis=1)
    df['label'] = df['Severity'].map(severity_map)

    # Use a small test set for evaluation
    test_texts = df['text'].tolist()
    true_labels = df['label'].tolist()

    model.eval()
    predictions = []

    print("Running inference on test set...")
    with torch.no_grad():
        for text in test_texts:
            inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True, max_length=256)
            outputs = model(**inputs)
            logits = outputs.logits
            pred = torch.argmax(logits, dim=1).item()
            predictions.append(pred)

    print("\n--- Evaluation Metrics ---")
    print(classification_report(true_labels, predictions, target_names=[reverse_map[i] for i in sorted(set(true_labels + predictions))]))
    
    print("\nConfusion Matrix:")
    print(confusion_matrix(true_labels, predictions))

if __name__ == "__main__":
    main()
