#!/bin/bash

# Install requirements if needed
pip install -r requirements.txt

# Run the test
python scheduler/blog_scheduler.py test
