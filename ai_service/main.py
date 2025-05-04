"""
Main module for the Gemini-based sustainability chatbot.
This module handles initialization, chat history, and interaction with the Gemini API.
"""

import os
import base64
from typing import List, Dict, Optional, Union
from dotenv import load_dotenv
import google.generativeai as genai
from config import MODEL_NAME, GENERATION_CONFIG, SAFETY_SETTINGS, SYSTEM_PROMPT

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("GEMINI_API_KEY environment variable not set. Please check your .env file.")

genai.configure(api_key=api_key)

class SustainabilityChatbot:
    """
    A chatbot that uses Gemini 2.0 Flash to provide sustainability advice based on
    user conversations and images.
    """
    
    def __init__(self):
        """
        Initialize the chatbot with the Gemini model and an empty chat history.
        """
        # Initialize the Gemini model
        self.model = genai.GenerativeModel(
            model_name=MODEL_NAME,
            generation_config=GENERATION_CONFIG,
            safety_settings=SAFETY_SETTINGS
        )
        
        # Start a new chat session with the system prompt
        self.chat_session = self.model.start_chat(history=[
            {
                "role": "user",
                "parts": ["Merhaba, sen kimsin?"]
            },
            {
                "role": "model",
                "parts": [SYSTEM_PROMPT]
            }
        ])
    
    def encode_image(self, image_path: str) -> str:
        """
        Encode an image to base64 for sending to the Gemini API.
        
        Args:
            image_path: Path to the image file
            
        Returns:
            Base64 encoded image string
        """
        if not os.path.exists(image_path):
            raise FileNotFoundError(f"Image file not found: {image_path}")
            
        with open(image_path, "rb") as image_file:
            return base64.b64encode(image_file.read()).decode('utf-8')
    
    def send_message(self, message: str, image_path: Optional[str] = None) -> str:
        """
        Send a message to the chatbot, optionally with an image, and get a response.
        
        Args:
            message: The text message from the user
            image_path: Optional path to an image file to include
            
        Returns:
            The chatbot's response
        """
        try:
            # Prepare the content parts
            content_parts = []
            
            # Add text message
            content_parts.append({"text": message})
            
            # Add image if provided
            if image_path:
                try:
                    image_data = self.encode_image(image_path)
                    mime_type = "image/jpeg" if image_path.lower().endswith(("jpg", "jpeg")) else "image/png"
                    
                    content_parts.append({
                        "inline_data": {
                            "mime_type": mime_type,
                            "data": image_data
                        }
                    })
                except Exception as e:
                    return f"Görsel işlenirken bir hata oluştu: {str(e)}"
            
            # Send the message to the chat session
            response = self.chat_session.send_message(content_parts)
            
            # Return the text response
            return response.text
            
        except Exception as e:
            return f"Bir hata oluştu: {str(e)}"
    
    def get_chat_history(self) -> List[Dict[str, Union[str, List]]]:
        """
        Get the current chat history.
        
        Returns:
            List of chat messages with roles and contents
        """
        return self.chat_session.history
    
    def reset_chat(self) -> None:
        """
        Reset the chat session to start a new conversation.
        """
        self.chat_session = self.model.start_chat(history=[
            {
                "role": "user",
                "parts": ["Merhaba, sen kimsin?"]
            },
            {
                "role": "model",
                "parts": [SYSTEM_PROMPT]
            }
        ])

if __name__ == "__main__":
    chatbot = SustainabilityChatbot()
    
    print("Sürdürülebilirlik Danışmanı Chatbot'a Hoş Geldiniz!")
    print("Hayatınızla ilgili detayları paylaşın veya görsel yükleyin, chatbot size sürdürülebilir yaşam tavsiyeleri sunacaktır.")
    print("Çıkmak için 'çıkış' yazın. Sohbeti sıfırlamak için 'sıfırla' yazın.")
    print("Görsel yüklemek için 'görsel:/dosya/yolu' formatını kullanın.")
    print("-" * 50)
    
    while True:
        user_input = input("\nSiz: ")
        
        if user_input.lower() == "çıkış":
            print("Chatbot kapatılıyor. Güle güle!")
            break
        
        elif user_input.lower() == "sıfırla":
            chatbot.reset_chat()
            print("Sohbet sıfırlandı. Yeni bir konuşma başlatabilirsiniz.")
            continue
        
        # Check if the user wants to upload an image
        if user_input.startswith("görsel:"):
            # Split the input to get the image path
            parts = user_input.split(":", 1)
            if len(parts) == 2:
                image_path = parts[1].strip()
                text_message = input("Görsel ile ilgili mesajınız (opsiyonel): ") or "Bu görseli sürdürülebilirlik açısından değerlendirir misin?"
                
                # Send the message with the image
                response = chatbot.send_message(text_message, image_path)
            else:
                response = "Lütfen geçerli bir görsel yolu girin: 'görsel:/dosya/yolu' formatında"
        else:
            # Send a text-only message
            response = chatbot.send_message(user_input)
        
        print(f"\nChatbot: {response}") 