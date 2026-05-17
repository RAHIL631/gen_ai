import os
import sys

# Add the root directory to sys.path to allow absolute imports of the 'backend' package
path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
if path not in sys.path:
    sys.path.insert(0, path)

from backend.main import app

# Vercel needs the 'app' variable to be available at the module level
# We imported it above, so it is now available as api.index.app
