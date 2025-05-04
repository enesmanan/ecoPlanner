"""
Flask server for the sustainability chatbot with Gemini AI.
This server provides API endpoints for the chatbot and serves the frontend.
"""

import os
import tempfile
from flask import Flask, request, jsonify, send_from_directory, render_template
from flask_cors import CORS
from werkzeug.utils import secure_filename
from dotenv import load_dotenv
from main import SustainabilityChatbot

# Load environment variables
load_dotenv()

# Create Flask app
app = Flask(__name__, static_folder="../frontend", static_url_path="")

# Configure CORS - localde ve deploy ortamında farklı kaynaklara izin ver
if os.environ.get('ENV') == 'production':
    # Production ortamında sadece belirli kaynaklara izin ver veya aynı origin kullan
    CORS(app, resources={r"/api/*": {"origins": os.environ.get('FRONTEND_URL', '*')}})
else:
    # Geliştirme ortamında tüm kaynaklara izin ver
    CORS(app, resources={r"/api/*": {"origins": "*"}})

# Initialize chatbot instances for each session
chatbot_sessions = {}

# Allowed file extensions for uploads
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    """Check if the file has an allowed extension."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# API Routes
@app.route('/api/chat', methods=['POST'])
def chat():
    """Handle chat messages from the frontend."""
    # Get or create a session ID
    session_id = request.cookies.get('session_id', str(hash(request.remote_addr)))
    
    # Create a new chatbot instance if one doesn't exist for this session
    if session_id not in chatbot_sessions:
        chatbot_sessions[session_id] = SustainabilityChatbot()
    
    # Get the chatbot for this session
    chatbot = chatbot_sessions[session_id]
    
    # Get message from request
    message = request.form.get('message', '')
    
    # Check if an image was uploaded
    image_path = None
    if 'image' in request.files:
        image = request.files['image']
        if image and allowed_file(image.filename):
            # Create a temporary file for the image
            with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(image.filename)[1]) as temp:
                image.save(temp.name)
                image_path = temp.name
    
    try:
        # Process the message with the chatbot
        response = chatbot.send_message(message, image_path)
        
        # Delete the temporary image file if it was created
        if image_path and os.path.exists(image_path):
            os.unlink(image_path)
        
        # Return the response
        return jsonify({'response': response})
    
    except Exception as e:
        # Clean up image if there was an error
        if image_path and os.path.exists(image_path):
            os.unlink(image_path)
        
        # Return the error
        return jsonify({'error': str(e)}), 500

@app.route('/api/chat/reset', methods=['POST'])
def reset_chat():
    """Reset the chat session."""
    # Get session ID
    session_id = request.cookies.get('session_id', str(hash(request.remote_addr)))
    
    # Create a new chatbot instance for this session
    chatbot_sessions[session_id] = SustainabilityChatbot()
    
    return jsonify({'status': 'success'})

# Health check için endpoint - Render deployment için önemli
@app.route('/api/health', methods=['GET'])
def health_check():
    """Basic health check endpoint for Render."""
    return jsonify({'status': 'healthy', 'service': 'ekoplanner-api'}), 200

# Frontend Routes
@app.route('/', defaults={'path': 'index.html'})
@app.route('/<path:path>')
def serve_frontend(path):
    """Serve the frontend files."""
    return send_from_directory(app.static_folder, path)

@app.route('/chatbot')
def chatbot_page():
    """Redirect /chatbot to the chatbot.html page."""
    return send_from_directory(app.static_folder, 'chatbot.html')

if __name__ == '__main__':
    # Get port from environment variable or use 5000 as default
    port = int(os.environ.get('PORT', 5000))
    
    # Set debug mode based on environment
    debug = os.environ.get('ENV', 'development') == 'development'
    
    # Run the app
    app.run(host='0.0.0.0', port=port, debug=debug) 