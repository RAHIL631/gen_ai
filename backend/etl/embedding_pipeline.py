from sentence_transformers import SentenceTransformer
import pandas as pd
import chromadb
import os

def main():
    print("Loading SentenceTransformer model...")
    model = SentenceTransformer('pritamdeka/BioBERT-mnli-snli-scinli-scitail-mednli-stsb')

    # Ensure vector_db directory exists
    db_path = '../data/vector_db'
    os.makedirs(db_path, exist_ok=True)
    
    client = chromadb.PersistentClient(path=db_path)
    collection = client.get_or_create_collection('drug_interactions')

    csv_path = '../data/drug_interactions.csv'
    
    # Check if dataset exists, if not provide a dummy one for testing
    if not os.path.exists(csv_path):
        print(f"Dataset not found at {csv_path}. Please run train_model.py first to generate sample data.")
        return

    print("Loading dataset...")
    df = pd.read_csv(csv_path)

    print(f"Embedding {len(df)} records...")
    for idx, row in df.iterrows():
        text = f"{row['Drug_A']} and {row['Drug_B']}: {row['Description']}"

        embedding = model.encode(text).tolist()

        collection.add(
            ids=[str(idx)],
            embeddings=[embedding],
            documents=[text],
            metadatas=[{
                'severity': row['Severity'],
                'drug_a': row['Drug_A'],
                'drug_b': row['Drug_B']
            }]
        )
    print("Vector embedding pipeline complete.")

if __name__ == '__main__':
    main()
