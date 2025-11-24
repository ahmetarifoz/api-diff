from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import shutil
import os
import uuid
from .report_generator import generate_report
from fastapi.staticfiles import StaticFiles
import pathlib

app = FastAPI()
frontend_path = pathlib.Path(__file__).parent.parent / "static"
app.mount("/", StaticFiles(directory=frontend_path, html=True), name="frontend")
# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/api/analyze")
async def analyze_specs(old_file: UploadFile = File(...), new_file: UploadFile = File(...)):
    try:
        # Create unique directory for this request to avoid collisions
        request_id = str(uuid.uuid4())
        request_dir = os.path.join(UPLOAD_DIR, request_id)
        os.makedirs(request_dir, exist_ok=True)
        
        old_file_path = os.path.join(request_dir, "old.yaml")
        new_file_path = os.path.join(request_dir, "new.yaml")
        
        with open(old_file_path, "wb") as buffer:
            shutil.copyfileobj(old_file.file, buffer)
            
        with open(new_file_path, "wb") as buffer:
            shutil.copyfileobj(new_file.file, buffer)
            
        # Run comparison
        report = generate_report(old_file_path, new_file_path)
        
        # Read raw file contents for full diff view
        with open(old_file_path, "r", encoding="utf-8") as f:
            old_content = f.read()
        with open(new_file_path, "r", encoding="utf-8") as f:
            new_content = f.read()
        
        # Add raw contents to report
        report["raw_files"] = {
            "old": old_content,
            "new": new_content
        }
        
        # Cleanup (optional, maybe keep for debugging or cleanup later)
        shutil.rmtree(request_dir)
        
        return report
        
    except Exception as e:
        # Clean up if error
        if 'request_dir' in locals() and os.path.exists(request_dir):
            shutil.rmtree(request_dir)
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
