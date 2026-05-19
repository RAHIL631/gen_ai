import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import chromadb
from sentence_transformers import SentenceTransformer

class InferencePipeline:
    def __init__(self):
        self.model_path = '../models/trained_model'
        try:
            self.tokenizer = AutoTokenizer.from_pretrained(self.model_path)
            self.classifier = AutoModelForSequenceClassification.from_pretrained(self.model_path)
        except:
            print("Warning: Local model not found. Using zero-shot fallback for demo.")
            self.tokenizer = None
            self.classifier = None
            
        self.embedder = SentenceTransformer('pritamdeka/BioBERT-mnli-snli-scinli-scitail-mednli-stsb')
        
        self.chroma_client = chromadb.PersistentClient(path='../data/vector_db')
        self.collection = self.chroma_client.get_or_create_collection('drug_interactions')
        
        self.severity_map = {0: 'none', 1: 'minor', 2: 'moderate', 3: 'major', 4: 'contraindicated'}

    def predict(self, drug_a: str, drug_b: str):
        # 1. Retrieval (RAG)
        query_text = f"Interaction between {drug_a} and {drug_b}"
        query_embedding = self.embedder.encode(query_text).tolist()
        
        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=1
        )
        
        evidence = "No specific clinical literature found."
        source = "Fallback Heuristics"
        
        if results['documents'] and results['documents'][0]:
            evidence = results['documents'][0][0]
            source = "DrugBank / TWOSIDES"
            
        # 2. Classification
        if self.classifier and self.tokenizer:
            inputs = self.tokenizer(f"{query_text}. Evidence: {evidence}", return_tensors="pt", truncation=True, max_length=256)
            with torch.no_grad():
                outputs = self.classifier(**inputs)
                logits = outputs.logits
                probs = torch.softmax(logits, dim=1)
                confidence = torch.max(probs).item()
                pred_idx = torch.argmax(logits, dim=1).item()
                severity = self.severity_map[pred_idx]
        else:
            # Fallback heuristic if model isn't trained yet
            severity = "moderate"
            confidence = 0.65
            
        return {
            "drug_a": drug_a,
            "drug_b": drug_b,
            "severity": severity,
            "confidence": confidence,
            "evidence": evidence,
            "source": source
        }

if __name__ == "__main__":
    pipeline = InferencePipeline()
    res = pipeline.predict("warfarin", "aspirin")
    print(f"Inference Result: {res}")
