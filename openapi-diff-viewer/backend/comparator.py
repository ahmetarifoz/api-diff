import prance
from deepdiff import DeepDiff
import os

def load_spec(path):
    if not os.path.exists(path):
        raise FileNotFoundError(f"File not found: {path}")
    # backend='openapi-spec-validator' is default for prance[osv]
    # Disable validation for this tool to be more robust to imperfect specs
    parser = prance.ResolvingParser(path, validation_backend=None)
    return parser.specification

def compare_specs(old_path, new_path):
    old_spec = load_spec(old_path)
    new_spec = load_spec(new_path)
    
    old_paths = old_spec.get('paths', {})
    new_paths = new_spec.get('paths', {})
    
    return old_paths, new_paths, old_spec, new_spec
