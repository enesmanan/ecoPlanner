"""
Sustainability AI Service main entry point.
This file starts the Flask server for the ecoPlanner AI service.
"""

import os
from server import app

# Not: Health check endpointi server.py'de tanımlandı

if __name__ == '__main__':
    # Get port from environment variable or use 5000 as default
    port = int(os.environ.get('PORT', 5000))
    
    # Production modunda Debug kapalı olarak çalıştır
    debug = os.environ.get('ENV', 'development') == 'development'
    
    # Run the app
    app.run(host='0.0.0.0', port=port, debug=debug) 