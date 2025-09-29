#!/usr/bin/env python3
"""
Deployment Configuration Checker for Vercel
Kiểm tra cấu hình deployment trước khi deploy lên Vercel
"""

import json
import os
import sys

def check_vercel_config():
    """Kiểm tra cấu hình vercel.json"""
    print("🔍 Kiểm tra cấu hình Vercel...")
    
    if not os.path.exists('vercel.json'):
        print("❌ Không tìm thấy file vercel.json")
        return False
    
    try:
        with open('vercel.json', 'r', encoding='utf-8') as f:
            config = json.load(f)
        
        # Kiểm tra builds
        if 'builds' not in config:
            print("❌ Thiếu mục 'builds' trong vercel.json")
            return False
        
        builds = config['builds']
        python_build = any(build.get('use') == '@vercel/python' for build in builds)
        static_build = any(build.get('use') == '@vercel/static-build' for build in builds)
        
        if not python_build:
            print("❌ Thiếu cấu hình build cho Python files")
            return False
        
        if not static_build:
            print("❌ Thiếu cấu hình build cho HTML files")
            return False
        
        print("✅ Cấu hình builds hợp lệ")
        
        # Kiểm tra functions
        if 'functions' in config:
            print("✅ Cấu hình functions có sẵn")
        
        # Kiểm tra rewrites
        if 'rewrites' in config:
            print(f"✅ Có {len(config['rewrites'])} routing rules")
        
        return True
        
    except json.JSONDecodeError:
        print("❌ File vercel.json không hợp lệ (JSON syntax error)")
        return False
    except Exception as e:
        print(f"❌ Lỗi khi đọc vercel.json: {e}")
        return False

def check_requirements():
    """Kiểm tra file requirements.txt"""
    print("\n📦 Kiểm tra Python dependencies...")
    
    if not os.path.exists('requirements.txt'):
        print("❌ Không tìm thấy file requirements.txt")
        return False
    
    print("✅ File requirements.txt tồn tại")
    
    with open('requirements.txt', 'r', encoding='utf-8') as f:
        content = f.read().strip()
    
    if not content or content.startswith('#'):
        print("✅ Chỉ sử dụng built-in Python modules (không có external dependencies)")
    else:
        print("📋 External dependencies được khai báo")
    
    return True

def check_api_files():
    """Kiểm tra các file API"""
    print("\n🔧 Kiểm tra API files...")
    
    api_dir = 'api'
    if not os.path.exists(api_dir):
        print("❌ Thư mục 'api' không tồn tại")
        return False
    
    python_files = [f for f in os.listdir(api_dir) if f.endswith('.py')]
    
    if not python_files:
        print("❌ Không tìm thấy file Python nào trong thư mục 'api'")
        return False
    
    print(f"✅ Tìm thấy {len(python_files)} Python API files:")
    for file in python_files:
        print(f"   - {file}")
    
    return True

def check_html_files():
    """Kiểm tra các file HTML"""
    print("\n📄 Kiểm tra HTML files...")
    
    html_files = []
    
    # Kiểm tra root directory
    root_html = [f for f in os.listdir('.') if f.endswith('.html')]
    html_files.extend(root_html)
    
    # Kiểm tra public directory
    if os.path.exists('public'):
        public_html = [f for f in os.listdir('public') if f.endswith('.html')]
        html_files.extend([f"public/{f}" for f in public_html])
    
    if not html_files:
        print("❌ Không tìm thấy file HTML nào")
        return False
    
    print(f"✅ Tìm thấy {len(html_files)} HTML files:")
    for file in html_files[:10]:  # Hiển thị tối đa 10 files
        print(f"   - {file}")
    
    if len(html_files) > 10:
        print(f"   ... và {len(html_files) - 10} files khác")
    
    return True

def main():
    """Main function"""
    print("🚀 KIỂM TRA CẤU HÌNH DEPLOYMENT CHO VERCEL")
    print("=" * 50)
    
    checks = [
        check_vercel_config,
        check_requirements,
        check_api_files,
        check_html_files
    ]
    
    all_passed = True
    for check in checks:
        if not check():
            all_passed = False
    
    print("\n" + "=" * 50)
    if all_passed:
        print("🎉 TẤT CẢ KIỂM TRA ĐỀU THÀNH CÔNG!")
        print("✅ Dự án sẵn sàng để deploy lên Vercel")
        print("\n📝 Các bước tiếp theo:")
        print("   1. Commit và push code lên GitHub")
        print("   2. Kết nối repository với Vercel")
        print("   3. Deploy và test các endpoints")
    else:
        print("❌ CÓ LỖI TRONG CẤU HÌNH!")
        print("🔧 Vui lòng sửa các lỗi trên trước khi deploy")
        sys.exit(1)

if __name__ == "__main__":
    main()