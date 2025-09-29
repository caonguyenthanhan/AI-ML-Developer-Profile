#!/usr/bin/env python3
import json
import os
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import threading
import time

class APIHandler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        """Handle CORS preflight requests"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_GET(self):
        """Handle GET requests"""
        parsed_path = urlparse(self.path)
        
        if parsed_path.path == '/api/prompts':
            self.get_prompts()
        else:
            self.send_error(404, "Not Found")

    def do_POST(self):
        """Handle POST requests"""
        parsed_path = urlparse(self.path)
        
        if parsed_path.path == '/api/prompts':
            self.add_prompt()
        else:
            self.send_error(404, "Not Found")

    def get_prompts(self):
        """Get all prompts from JSON file"""
        try:
            prompts_file = os.path.join('public', 'data', 'prompts.json')
            
            if os.path.exists(prompts_file):
                with open(prompts_file, 'r', encoding='utf-8') as f:
                    prompts = json.load(f)
            else:
                prompts = []
            
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            response = json.dumps(prompts, ensure_ascii=False, indent=2)
            self.wfile.write(response.encode('utf-8'))
            
        except Exception as e:
            self.send_error(500, f"Internal Server Error: {str(e)}")

    def add_prompt(self):
        """Add a new prompt to JSON file"""
        try:
            # Read request body
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            new_prompt = json.loads(post_data.decode('utf-8'))
            
            # Validate required fields
            required_fields = ['title', 'prompt', 'category', 'imagePath']
            for field in required_fields:
                if field not in new_prompt:
                    self.send_error(400, f"Missing required field: {field}")
                    return
            
            prompts_file = os.path.join('public', 'data', 'prompts.json')
            
            # Load existing prompts
            if os.path.exists(prompts_file):
                with open(prompts_file, 'r', encoding='utf-8') as f:
                    prompts = json.load(f)
            else:
                prompts = []
            
            # Generate new ID
            if prompts:
                new_id = max(prompt['id'] for prompt in prompts) + 1
            else:
                new_id = 1
            
            new_prompt['id'] = new_id
            
            # Add new prompt
            prompts.append(new_prompt)
            
            # Save back to file
            os.makedirs(os.path.dirname(prompts_file), exist_ok=True)
            with open(prompts_file, 'w', encoding='utf-8') as f:
                json.dump(prompts, f, ensure_ascii=False, indent=4)
            
            # Send response
            self.send_response(201)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            response = json.dumps(new_prompt, ensure_ascii=False, indent=2)
            self.wfile.write(response.encode('utf-8'))
            
        except json.JSONDecodeError:
            self.send_error(400, "Invalid JSON")
        except Exception as e:
            self.send_error(500, f"Internal Server Error: {str(e)}")

def run_api_server(port=3001):
    """Run the API server"""
    server_address = ('', port)
    httpd = HTTPServer(server_address, APIHandler)
    print(f"API Server running on http://localhost:{port}")
    httpd.serve_forever()

if __name__ == '__main__':
    # Run API server in a separate thread
    api_thread = threading.Thread(target=run_api_server, daemon=True)
    api_thread.start()
    
    print("API Server started on port 3001")
    print("Press Ctrl+C to stop")
    
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nShutting down...")