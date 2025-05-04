"""
Flask server for the sustainability chatbot with Gemini AI.
This server provides API endpoints for the chatbot and serves the frontend.
"""

import os
import tempfile
import logging
from flask import Flask, request, jsonify, send_from_directory, render_template
from flask_cors import CORS
from werkzeug.utils import secure_filename
from dotenv import load_dotenv
from main import SustainabilityChatbot

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Create Flask app - path düzeltme
current_dir = os.path.dirname(os.path.abspath(__file__))
static_folder = os.path.join(current_dir, "frontend") if os.path.exists(os.path.join(current_dir, "frontend")) else "frontend"
app = Flask(__name__, static_folder=static_folder, static_url_path="")

# CORS ayarlarını genişletme
CORS(app)  # Tüm routelar için CORS'u etkinleştir

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
    try:
        # Get or create a session ID
        session_id = request.cookies.get('session_id', str(hash(request.remote_addr)))
        
        logger.info(f"Processing request for session {session_id}")
        
        # Create a new chatbot instance if one doesn't exist for this session
        if session_id not in chatbot_sessions:
            logger.info(f"Creating new chatbot instance for session {session_id}")
            chatbot_sessions[session_id] = SustainabilityChatbot()
        
        # Get the chatbot for this session
        chatbot = chatbot_sessions[session_id]
        
        # Get message from request
        message = request.form.get('message', '')
        logger.info(f"Received message: {message}")
        
        # Check if an image was uploaded
        image_path = None
        if 'image' in request.files:
            image = request.files['image']
            if image and allowed_file(image.filename):
                # Create a temporary file for the image
                with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(image.filename)[1]) as temp:
                    image.save(temp.name)
                    image_path = temp.name
                    logger.info(f"Image saved to {image_path}")
        
        # Process the message with the chatbot
        response = chatbot.send_message(message, image_path)
        
        # Delete the temporary image file if it was created
        if image_path and os.path.exists(image_path):
            os.unlink(image_path)
        
        # Return the response
        return jsonify({'response': response})
    
    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}", exc_info=True)
        # Clean up image if there was an error
        if 'image_path' in locals() and image_path and os.path.exists(image_path):
            os.unlink(image_path)
        
        # Return the error
        return jsonify({'error': str(e)}), 500

@app.route('/api/chat/reset', methods=['POST'])
def reset_chat():
    """Reset the chat session."""
    try:
        # Get session ID
        session_id = request.cookies.get('session_id', str(hash(request.remote_addr)))
        
        # Create a new chatbot instance for this session
        chatbot_sessions[session_id] = SustainabilityChatbot()
        logger.info(f"Chat session reset for {session_id}")
        
        return jsonify({'status': 'success'})
    except Exception as e:
        logger.error(f"Error in reset endpoint: {str(e)}", exc_info=True)
        return jsonify({'error': str(e)}), 500

# Frontend Routes - index.html ve catchall routelar
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_frontend(path):
    """Serve the frontend files."""
    if path == "":
        return send_from_directory(app.static_folder, 'index.html')
    try:
        return send_from_directory(app.static_folder, path)
    except Exception as e:
        logger.error(f"Error serving static file {path}: {str(e)}")
        return send_from_directory(app.static_folder, 'index.html')  # SPA için fallback

@app.route('/chatbot')
def chatbot_page():
    """Redirect /chatbot to the chatbot.html page."""
    return send_from_directory(app.static_folder, 'chatbot.html')

# Health check endpoint
@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint for monitoring."""
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    # Get port from environment variable or use 10000 as default
    port = int(os.environ.get('PORT', 10000))
    
    logger.info(f"Starting server on port {port}")
    
    # Run the app with debug mode enabled (geliştirme için)
    # Deployment için debug=False olmalı
    debug_mode = os.environ.get('DEBUG', 'False').lower() == 'true'
    app.run(host='0.0.0.0', port=port, debug=debug_mode)