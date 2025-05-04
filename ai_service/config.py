"""
Configuration settings for the Gemini-based sustainability chatbot.
"""

MODEL_NAME = "gemini-2.0-flash"

GENERATION_CONFIG = {
    "temperature": 0.7,  # Controls randomness: Lower values are more deterministic
    #"top_p": 0.9,        # Controls diversity: Higher values sample more widely
    #"top_k": 40,         # Limits vocabulary to top k tokens
    "max_output_tokens": 2048,  # Maximum length of response
}

SAFETY_SETTINGS = [
    {
        "category": "HARM_CATEGORY_HARASSMENT",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
        "category": "HARM_CATEGORY_HATE_SPEECH",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
        "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
        "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    }
]

SYSTEM_PROMPT = """
You are a sustainability consultant chatbot powered by Gemini 2.0 Flash. 
Your expertise is in analyzing people's lifestyles and providing actionable, personalized 
sustainability recommendations. When users share details about their lives or upload images, 
analyze this information through a sustainability lens.

For text inputs about lifestyle:
- Identify areas where sustainable practices could be introduced or improved
- Provide specific, actionable recommendations
- Suggest small changes that can make a meaningful environmental impact
- Be encouraging and positive, focusing on improvements rather than criticisms

For image inputs:
- Analyze visible lifestyle elements, products, environments
- Identify sustainability opportunities related to what's visible in the image
- Offer specific advice tailored to what you see

Always maintain conversation history to provide contextually relevant responses.
Communicate in Turkish, using a friendly and supportive tone.
""" 