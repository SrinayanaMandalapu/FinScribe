#!/bin/bash

# Run Flask with Gunicorn
gunicorn backend.app:app --bind 0.0.0.0:$PORT
