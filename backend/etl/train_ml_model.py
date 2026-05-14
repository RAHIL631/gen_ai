import os
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import LabelEncoder
import joblib

def train_model():
    base_dir = os.path.dirname(os.path.dirname(__file__))
    data_path = os.path.join(base_dir, 'data', 'real_interactions.csv')
    model_dir = os.path.join(base_dir, 'models')
    os.makedirs(model_dir, exist_ok=True)
    model_path = os.path.join(model_dir, 'interaction_model.pkl')
    label_encoder_path = os.path.join(model_dir, 'label_encoder.pkl')

    if not os.path.exists(data_path):
        from backend.etl.generate_dataset import generate_dataset
        generate_dataset()

    print(f"Loading data from {data_path}...")
    df = pd.read_csv(data_path)

    # We will train a model to predict severity based on drug pair names
    # In a real deep learning scenario, we'd use chemical structures, but text + RF is a solid baseline for a "real project"
    df['drug_pair'] = df['drug_a'].str.lower() + " " + df['drug_b'].str.lower()
    
    # We will also predict the mechanism and recommendation! 
    # To keep it simple, the classifier predicts a unique interaction ID, and we look up the details.
    # Wait, a better ML approach: Predict Severity based on TF-IDF of drug pair.
    
    X = df['drug_pair']
    y = df['severity']

    le = LabelEncoder()
    y_encoded = le.fit_transform(y)

    print("Training ML pipeline (TF-IDF + Random Forest)...")
    pipeline = Pipeline([
        ('tfidf', TfidfVectorizer(ngram_range=(1, 2))),
        ('clf', RandomForestClassifier(n_estimators=100, random_state=42))
    ])

    pipeline.fit(X, y_encoded)

    print(f"Saving model to {model_path}...")
    joblib.dump(pipeline, model_path)
    joblib.dump(le, label_encoder_path)
    
    # Also save the raw dataframe for lookup of mechanisms/recommendations
    df.to_pickle(os.path.join(model_dir, 'interactions_db.pkl'))
    
    print("Model training complete! Accuracy on training set: {:.2f}%".format(pipeline.score(X, y_encoded) * 100))

if __name__ == "__main__":
    train_model()
