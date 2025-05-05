# ecoPlanner: Your Guide to Sustainable Living

ecoPlanner is a comprehensive web application designed to help users live a more sustainable lifestyle through personalized recommendations, planning tools, and an AI-powered sustainability chatbot.

**This project was created as part of the [AI and Technology Academy](https://yapayzekaveteknolojiakademisi.com/) Hackathon.**

## Technical Architecture

### 1. Frontend
- **Technology Stack**: HTML5, CSS3, JavaScript (ES6+)
- **Build Tool**: Vite.js
- **UI/UX**: Custom CSS with responsive design principles
- **Features**:
  - Dashboard for tracking sustainability metrics
  - Daily planner for scheduling eco-friendly activities
  - Learning path for sustainability education
  - AI-powered chatbot interface
  - About and information pages

### 2. Backend (AI Service)
- **Technology Stack**: Python 3.10+, Flask 3.0.3
- **AI Integration**: Google Gemini 2.0 Flash API
- **Features**:
  - RESTful API endpoints
  - Image processing capabilities
  - Stateful chat sessions
  - Cross-origin resource sharing (CORS) support
  - Health check endpoints for monitoring

## Local Setup Instructions

### Prerequisites
- Python 3.10 or higher
- Node.js 16 or higher
- npm or yarn
- Google Gemini API key

### Backend Setup (AI Service)

1. Clone the repository:
   ```bash
   git clone https://github.com/enesmanan/ecoPlanner.git
   cd ekoplanner
   ```

2. Set up a virtual environment (recommended):
   ```bash
   cd ai_service
   python -m venv venv
   
   # On Windows
   venv\Scripts\activate
   
   # On macOS/Linux
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file in the `ai_service` directory with your API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

5. Navigate to the frontend directory:

   ```bash
   cd ..
   cd frontend
   npm install
   cd ..
   ```

6. Run the backend server:
   ```bash
   cd ai_service

   # On Windows
   run.bat
   
   # On macOS/Linux
   bash run.sh
   
   # Or directly with Python
   python server.py
   ```

   The server will start on `http://localhost:5000`


## Project Structure

```
ekoplanner/
├── ai_service/             # Backend AI service
│   ├── app.py              # Entry point for production deployment
│   ├── config.py           # Configuration settings for the AI model
│   ├── main.py             # Core chatbot functionality
│   ├── requirements.txt    # Python dependencies
│   ├── run.bat             # Windows startup script
│   ├── run.sh              # Unix startup script
│   └── server.py           # Flask server implementation
├── frontend/               # Web frontend
│   ├── css/                # Stylesheets
│   ├── js/                 # JavaScript files
│   ├── public/             # Static assets
│   ├── about.html          # About page
│   ├── chatbot.html        # AI chatbot interface
│   ├── dashboard.html      # User dashboard
│   ├── index.html          # Login page
│   ├── learning.html       # Sustainability learning path
│   ├── package.json        # Frontend dependencies
│   ├── planner.html        # Daily planner interface
│   └── style.css           # Global styles
├── build.sh                # Build script for deployment
├── Dockerfile              # Docker configuration
└── render.yaml             # Render.com deployment configuration
```

## Todo Features

- [ ] Add value proposition to the homepage "About ecoPlanner" section
- [ ] Improve the Planner section with more logical foundation
- [ ] Fix the ecoAssistant section in the Planner
- [ ] Rename AI consultant to "ecoPlanner" and improve UI with symmetrical design
- [ ] Add markdown parser support to the AI consultant UI
- [ ] Replace "Jane Smith" profile with a Turkish name
- [ ] Update team member profiles and photos in About section
- [ ] Remove "Our Impact" section from About page
- [ ] Test whether LLM language and recommendations work as expected

## Team

- Enes Fehmi Manan - [LinkedIn](https://www.linkedin.com/in/enesfehmimanan/)
- Furkan Demirci - [LinkedIn](https://www.linkedin.com/in/furkan-demirci-x/)
- Team Member 3 - [LinkedIn](https://linkedin.com/in/teammember3)
- Team Member 4 - [LinkedIn](https://linkedin.com/in/teammember4)
- Team Member 5 - [LinkedIn](https://linkedin.com/in/teammember5)
