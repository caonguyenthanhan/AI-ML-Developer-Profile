import json
import os
from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

class handler(BaseHTTPRequestHandler):
    def send_response_with_cors(self, code):
        """Gửi response với CORS headers"""
        self.send_response(code)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Content-Type', 'application/json')
        self.end_headers()

    def do_OPTIONS(self):
        """Xử lý preflight CORS requests"""
        self.send_response_with_cors(200)
        self.wfile.write(b'')

    def do_GET(self):
        """Xử lý GET request - lấy danh sách prompts"""
        try:
            # Đường dẫn đến file prompts.json
            prompts_file = os.path.join(os.path.dirname(__file__), '..', 'public', 'data', 'prompts.json')
            
            # Kiểm tra file có tồn tại không
            if not os.path.exists(prompts_file):
                self.send_response_with_cors(404)
                response = {
                    'error': 'Prompts file not found',
                    'message': 'File public/data/prompts.json không tồn tại'
                }
                self.wfile.write(json.dumps(response, ensure_ascii=False).encode('utf-8'))
                return

            # Đọc file prompts.json
            with open(prompts_file, 'r', encoding='utf-8') as f:
                prompts_data = json.load(f)

            # Parse query parameters
            parsed_url = urlparse(self.path)
            query_params = parse_qs(parsed_url.query)
            
            # Lọc theo category nếu có
            category = query_params.get('category', [None])[0]
            if category:
                filtered_prompts = [p for p in prompts_data if p.get('category', '').lower() == category.lower()]
            else:
                filtered_prompts = prompts_data

            # Trả về response
            self.send_response_with_cors(200)
            response = {
                'success': True,
                'data': filtered_prompts,
                'total': len(filtered_prompts),
                'message': f'Lấy {len(filtered_prompts)} prompts thành công'
            }
            self.wfile.write(json.dumps(response, ensure_ascii=False).encode('utf-8'))

        except json.JSONDecodeError:
            self.send_response_with_cors(400)
            response = {
                'error': 'Invalid JSON format',
                'message': 'File prompts.json có định dạng không hợp lệ'
            }
            self.wfile.write(json.dumps(response, ensure_ascii=False).encode('utf-8'))

        except Exception as e:
            self.send_response_with_cors(500)
            response = {
                'error': 'Internal server error',
                'message': f'Lỗi server: {str(e)}'
            }
            self.wfile.write(json.dumps(response, ensure_ascii=False).encode('utf-8'))

    def do_POST(self):
        """Xử lý POST request - thêm prompt mới"""
        try:
            # Đọc dữ liệu từ request body
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            # Parse JSON data
            try:
                new_prompt = json.loads(post_data.decode('utf-8'))
            except json.JSONDecodeError:
                self.send_response_with_cors(400)
                response = {
                    'error': 'Invalid JSON',
                    'message': 'Dữ liệu JSON không hợp lệ'
                }
                self.wfile.write(json.dumps(response, ensure_ascii=False).encode('utf-8'))
                return

            # Validate required fields
            required_fields = ['title', 'prompt']
            missing_fields = [field for field in required_fields if field not in new_prompt or not new_prompt[field]]
            
            if missing_fields:
                self.send_response_with_cors(400)
                response = {
                    'error': 'Missing required fields',
                    'message': f'Thiếu các trường bắt buộc: {", ".join(missing_fields)}'
                }
                self.wfile.write(json.dumps(response, ensure_ascii=False).encode('utf-8'))
                return

            # Đường dẫn đến file prompts.json
            prompts_file = os.path.join(os.path.dirname(__file__), '..', 'public', 'data', 'prompts.json')
            
            # Đọc dữ liệu hiện tại hoặc tạo mới nếu file không tồn tại
            if os.path.exists(prompts_file):
                with open(prompts_file, 'r', encoding='utf-8') as f:
                    prompts_data = json.load(f)
            else:
                # Tạo thư mục nếu chưa tồn tại
                os.makedirs(os.path.dirname(prompts_file), exist_ok=True)
                prompts_data = []

            # Tạo ID mới cho prompt
            new_id = max([p.get('id', 0) for p in prompts_data], default=0) + 1
            
            # Thêm thông tin mặc định cho prompt mới
            new_prompt.update({
                'id': new_id,
                'category': new_prompt.get('category', 'general'),
                'tags': new_prompt.get('tags', []),
                'created_at': new_prompt.get('created_at', ''),
                'author': new_prompt.get('author', 'Anonymous')
            })

            # Thêm prompt mới vào danh sách
            prompts_data.append(new_prompt)

            # Ghi lại file
            with open(prompts_file, 'w', encoding='utf-8') as f:
                json.dump(prompts_data, f, ensure_ascii=False, indent=2)

            # Trả về response thành công
            self.send_response_with_cors(201)
            response = {
                'success': True,
                'data': new_prompt,
                'message': f'Thêm prompt "{new_prompt["title"]}" thành công'
            }
            self.wfile.write(json.dumps(response, ensure_ascii=False).encode('utf-8'))

        except Exception as e:
            self.send_response_with_cors(500)
            response = {
                'error': 'Internal server error',
                'message': f'Lỗi server: {str(e)}'
            }
            self.wfile.write(json.dumps(response, ensure_ascii=False).encode('utf-8'))