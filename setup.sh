#!/bin/bash

# Create virtual environment for Python backend
python3 -m venv venv
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Create React app and install dependencies
npx create-react-app frontend
cd frontend
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material react-router-dom axios react-webcam recharts

# Copy our components into the React app
mkdir -p src/components

# Start the development servers
echo "Setup complete! To start the servers:"
echo "1. Backend: source venv/bin/activate && cd backend && uvicorn main:app --reload"
echo "2. Frontend: cd frontend && npm start"
