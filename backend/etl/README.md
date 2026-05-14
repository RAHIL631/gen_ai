# PharmAI ETL Pipeline

This directory contains the data pipeline scripts to parse the **DrugBank XML** dataset, extract drug interaction data, process/clean it, and generate vectorized ready chunks for Pinecone and LLM context execution.

## Pipeline Architecture

- `extractor.py`: Parses the massive DrugBank XML iteratively using `xml.etree.ElementTree` to keep memory consumption low.
- `transformer.py`: Deduplicates symmetric relationships (e.g. A->B vs B->A), implements heuristics to infer Severity levels since DrugBank uses raw prose description, and crafts semantic chunks for OpenAI embeddings.
- `pipeline.py`: Orchestrates extraction and transformation and saving outputs into `backend/data/`.

## Running the Pipeline
You must have Python 3.10+ installed and the required dependencies. Ensure you place the `full_database.xml` from DrugBank into `backend/data/`.
If you do not supply the XML file, the extractor gracefully degrades to use mock interaction data.

```bash
# Run from the root directory
python -m backend.etl.pipeline
```
