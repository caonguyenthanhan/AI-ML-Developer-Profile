import json
import os
from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

class handler(BaseHTTPRequestHandler):
    def send_response_with_cors(self, code):
        """Gửi response với CORS headers"""
        self.send_response(code)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Content-Type', 'application/json')
        self.end_headers()

    def do_OPTIONS(self):
        """Xử lý preflight CORS requests"""
        self.send_response_with_cors(200)
        self.wfile.write(b'')

    def do_GET(self):
        """Xử lý GET request - lấy danh sách prompts (hỗ trợ hợp nhất VIP)"""
        try:
            # Parse query parameters
            parsed_url = urlparse(self.path)
            query_params = parse_qs(parsed_url.query)
            include_vip = query_params.get('include_vip', ['false'])[0].lower() == 'true'
            sanitize = query_params.get('sanitize', ['false'])[0].lower() == 'true'

            # Đường dẫn đến các file dữ liệu
            base_dir = os.path.join(os.path.dirname(__file__), '..')
            prompts_file = os.path.join(base_dir, 'public', 'data', 'prompts.json')
            vip_file = os.path.join(base_dir, 'private', 'prompts_vip.json')

            # Đọc file prompts.json (public)
            if not os.path.exists(prompts_file):
                self.send_response_with_cors(404)
                response = {
                    'error': 'Prompts file not found',
                    'message': 'File public/data/prompts.json không tồn tại'
                }
                self.wfile.write(json.dumps(response, ensure_ascii=False).encode('utf-8'))
                return

            with open(prompts_file, 'r', encoding='utf-8') as f:
                public_prompts = json.load(f)

            merged_prompts = public_prompts[:]

            # Nếu cần hợp nhất VIP thì đọc và gộp
            if include_vip and os.path.exists(vip_file):
                with open(vip_file, 'r', encoding='utf-8') as vf:
                    vip_prompts = json.load(vf)
                # Ánh xạ theo ID để ghi đè
                by_id = {p.get('id'): p for p in public_prompts if 'id' in p}
                for vip in vip_prompts:
                    vid = vip.get('id')
                    if vid in by_id:
                        by_id[vid] = vip
                    else:
                        by_id[vid] = vip
                merged_prompts = list(by_id.values())

                # Sanitize nội dung prompt cho đầu công khai nếu yêu cầu
                if sanitize:
                    for p in merged_prompts:
                        # Chỉ che nội dung của mục có nguồn VIP (giả định có trường 'is_vip' hoặc nằm trong vip_prompts)
                        # Nếu không có trường đánh dấu, dùng heuristic theo ID trùng trong vip_prompts
                        try:
                            is_vip_item = any(v.get('id') == p.get('id') for v in vip_prompts)
                        except Exception:
                            is_vip_item = False
                        if is_vip_item:
                            p['prompt'] = 'Liên hệ admin để xem đầy đủ nội dung prompt'

            # Lọc theo category nếu có
            category = query_params.get('category', [None])[0]
            if category:
                filtered_prompts = [p for p in merged_prompts if str(p.get('category', '')).lower() == category.lower()]
            else:
                filtered_prompts = merged_prompts

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

    def do_PUT(self):
        """Xử lý PUT request - cập nhật prompt"""
        try:
            # Parse URL để lấy ID
            parsed_url = urlparse(self.path)
            path_parts = parsed_url.path.strip('/').split('/')
            
            if len(path_parts) < 3 or path_parts[0] != 'api' or path_parts[1] != 'prompts':
                self.send_response_with_cors(400)
                response = {
                    'error': 'Invalid URL',
                    'message': 'URL phải có dạng /api/prompts/{id}'
                }
                self.wfile.write(json.dumps(response, ensure_ascii=False).encode('utf-8'))
                return
            
            try:
                prompt_id = int(path_parts[2])
            except ValueError:
                self.send_response_with_cors(400)
                response = {
                    'error': 'Invalid ID',
                    'message': 'ID phải là số nguyên'
                }
                self.wfile.write(json.dumps(response, ensure_ascii=False).encode('utf-8'))
                return

            # Đọc dữ liệu từ request body
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            # Parse JSON data
            try:
                updated_prompt = json.loads(post_data.decode('utf-8'))
            except json.JSONDecodeError:
                self.send_response_with_cors(400)
                response = {
                    'error': 'Invalid JSON',
                    'message': 'Dữ liệu JSON không hợp lệ'
                }
                self.wfile.write(json.dumps(response, ensure_ascii=False).encode('utf-8'))
                return

            # Đường dẫn đến file prompts.json
            prompts_file = os.path.join(os.path.dirname(__file__), '..', 'public', 'data', 'prompts.json')
            
            if not os.path.exists(prompts_file):
                self.send_response_with_cors(404)
                response = {
                    'error': 'File not found',
                    'message': 'File prompts.json không tồn tại'
                }
                self.wfile.write(json.dumps(response, ensure_ascii=False).encode('utf-8'))
                return

            # Đọc dữ liệu hiện tại
            with open(prompts_file, 'r', encoding='utf-8') as f:
                prompts_data = json.load(f)

            # Tìm prompt cần cập nhật
            prompt_index = None
            for i, prompt in enumerate(prompts_data):
                if prompt.get('id') == prompt_id:
                    prompt_index = i
                    break

            if prompt_index is None:
                self.send_response_with_cors(404)
                response = {
                    'error': 'Prompt not found',
                    'message': f'Không tìm thấy prompt với ID {prompt_id}'
                }
                self.wfile.write(json.dumps(response, ensure_ascii=False).encode('utf-8'))
                return

            # Cập nhật prompt (giữ nguyên ID)
            updated_prompt['id'] = prompt_id
            prompts_data[prompt_index] = updated_prompt

            # Ghi lại file
            with open(prompts_file, 'w', encoding='utf-8') as f:
                json.dump(prompts_data, f, ensure_ascii=False, indent=2)

            # Trả về response thành công
            self.send_response_with_cors(200)
            response = {
                'success': True,
                'data': updated_prompt,
                'message': f'Cập nhật prompt "{updated_prompt.get("title", "")}" thành công'
            }
            self.wfile.write(json.dumps(response, ensure_ascii=False).encode('utf-8'))

        except Exception as e:
            self.send_response_with_cors(500)
            response = {
                'error': 'Internal server error',
                'message': f'Lỗi server: {str(e)}'
            }
            self.wfile.write(json.dumps(response, ensure_ascii=False).encode('utf-8'))

    def do_DELETE(self):
        """Xử lý DELETE request - xóa prompt"""
        try:
            # Parse URL để lấy ID
            parsed_url = urlparse(self.path)
            path_parts = parsed_url.path.strip('/').split('/')
            
            if len(path_parts) < 3 or path_parts[0] != 'api' or path_parts[1] != 'prompts':
                self.send_response_with_cors(400)
                response = {
                    'error': 'Invalid URL',
                    'message': 'URL phải có dạng /api/prompts/{id}'
                }
                self.wfile.write(json.dumps(response, ensure_ascii=False).encode('utf-8'))
                return
            
            try:
                prompt_id = int(path_parts[2])
            except ValueError:
                self.send_response_with_cors(400)
                response = {
                    'error': 'Invalid ID',
                    'message': 'ID phải là số nguyên'
                }
                self.wfile.write(json.dumps(response, ensure_ascii=False).encode('utf-8'))
                return

            # Đường dẫn đến file prompts.json
            prompts_file = os.path.join(os.path.dirname(__file__), '..', 'public', 'data', 'prompts.json')
            
            if not os.path.exists(prompts_file):
                self.send_response_with_cors(404)
                response = {
                    'error': 'File not found',
                    'message': 'File prompts.json không tồn tại'
                }
                self.wfile.write(json.dumps(response, ensure_ascii=False).encode('utf-8'))
                return

            # Đọc dữ liệu hiện tại
            with open(prompts_file, 'r', encoding='utf-8') as f:
                prompts_data = json.load(f)

            # Tìm và xóa prompt
            original_length = len(prompts_data)
            prompts_data = [p for p in prompts_data if p.get('id') != prompt_id]

            if len(prompts_data) == original_length:
                self.send_response_with_cors(404)
                response = {
                    'error': 'Prompt not found',
                    'message': f'Không tìm thấy prompt với ID {prompt_id}'
                }
                self.wfile.write(json.dumps(response, ensure_ascii=False).encode('utf-8'))
                return

            # Ghi lại file
            with open(prompts_file, 'w', encoding='utf-8') as f:
                json.dump(prompts_data, f, ensure_ascii=False, indent=2)

            # Trả về response thành công
            self.send_response_with_cors(200)
            response = {
                'success': True,
                'message': f'Xóa prompt với ID {prompt_id} thành công'
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