#!/bin/bash
echo "Running Backend Analysis..."
cd backend
# Install requirements if needed (optional step for script, but good for first run)
# pip install -r requirements.txt

python main.py --old specs/old.yaml --new specs/new.yaml --out ../frontend/public/diff-data.json
if [ $? -ne 0 ]; then
    echo "Backend analysis failed!"
    exit 1
fi
cd ..

echo "Starting Frontend..."
cd frontend
npm run dev
