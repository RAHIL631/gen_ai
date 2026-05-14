import os
import sys

# Add the root directory to sys.path
root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.append(root_dir)

print(f"Python Path: {sys.path}")
print(f"Root Dir Contents: {os.listdir(root_dir)}")

try:
    from backend.main import app
    print("Successfully imported FastAPI app")
except Exception as e:
    print(f"Failed to import app: {e}")
    raise e
