#!/bin/bash

# Run Flask with Gunicorn
#!/bin/bash
gunicorn backend.app:app --workers 1 --threads 2 --bind 0.0.0.0:$PORT

