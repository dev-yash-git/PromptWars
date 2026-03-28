import os
import json
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from google import genai
from google.genai import types
from pydantic import BaseModel

app = Flask(__name__, static_folder='.', static_url_path='')
CORS(app)

# Configure Gemini
api_key = os.environ.get("Gemini API Key", os.environ.get("GEMINI_API_KEY", "AIzaSyAix-PyHtNSuO-aS_AtWqLFmFXzmzAS0Tw"))

# We use the fast flash model
model_name = "gemini-2.5-flash"

try:
    if api_key:
        client = genai.Client(api_key=api_key)
    else:
        client = None
except Exception as e:
    client = None
    print(f"Warning: Failed to initialize Gemini client. Ensure your API key is correct. Error: {e}")

class TaskResponse(BaseModel):
    goal: str
    plan: list[str]
    checklist: list[str]
    pro_tips: list[str]

@app.route('/')
def serve_index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

@app.route('/api/execute', methods=['POST'])
def execute_task():
    if not client:
        return jsonify({"error": "Gemini client is not initialized. Please set the GEMINI_API_KEY environment variable and restart the server."}), 500
        
    data = request.json
    task = data.get('task', '')
    
    if not task:
        return jsonify({"error": "No task provided."}), 400

    prompt = f"""
    You are an AI Task Executor. The user wants you to execute the following task: "{task}"
    
    Provide a highly structured, precise, and actionable response.
    The goal must be a concise 1-sentence summary of what needs to be accomplished.
    The plan must be a list of sequential steps with minimal fluff.
    The checklist must be a list of specific, verifiable actions.
    The pro_tips must be a list of high-level expert advice.
    """
    
    try:
        response = client.models.generate_content(
            model=model_name,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=TaskResponse,
            )
        )
        
        result = json.loads(response.text)
        return jsonify(result)
        
    except json.JSONDecodeError as je:
        print(f"Failed to parse JSON response: {response.text if hasattr(response, 'text') else str(response)}")
        return jsonify({"error": "Received an invalid response format from the AI."}), 500
    except Exception as e:
        print(f"Error during generative request: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("Starting AI Task Executor backend...")
    print("Serving on http://127.0.0.1:5000")
    app.run(debug=True, port=5000)
