"""
Sustainability AI Service main entry point.
This file starts the Flask server for the ecoPlanner AI service.
"""

import os
from server import app

# Sağlık kontrolü için basit bir endpoint ekliyoruz
@app.route('/api/health', methods=['GET'])
def health_check():
    """Basic health check endpoint for monitoring."""
    return {'status': 'healthy', 'service': 'ekoplanner-api'}, 200

if __name__ == '__main__':
    # Get port from environment variable or use 5000 as default
    port = int(os.environ.get('PORT', 5000))
    
    # Production modunda Debug kapalı olarak çalıştır
    debug = os.environ.get('ENV', 'development') == 'development'
    
    # Run the app
    app.run(host='0.0.0.0', port=port, debug=debug) 