#!/bin/bash

# Activate virtual environment if you have one
# source venv/bin/activate

# Install requirements if needed
pip install -r requirements.txt

# Run the scheduler
python scheduler/blog_scheduler.py
