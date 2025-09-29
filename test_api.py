#!/usr/bin/env python3
"""
Test script for the prompts API endpoint
This script tests both GET and POST functionality
"""

import json
import urllib.request
import urllib.parse
import urllib.error

def test_get_prompts(base_url="http://localhost:3000"):
    """Test GET request to fetch all prompts"""
    try:
        url = f"{base_url}/api/prompts"
        print(f"Testing GET: {url}")
        
        with urllib.request.urlopen(url) as response:
            data = json.loads(response.read().decode())
            print(f"✅ GET Success: Retrieved {len(data)} prompts")
            return True
    except Exception as e:
        print(f"❌ GET Failed: {e}")
        return False

def test_get_prompts_by_category(base_url="http://localhost:3000", category="Portrait Photography"):
    """Test GET request with category filter"""
    try:
        url = f"{base_url}/api/prompts?category={urllib.parse.quote(category)}"
        print(f"Testing GET with category: {url}")
        
        with urllib.request.urlopen(url) as response:
            data = json.loads(response.read().decode())
            print(f"✅ GET with category Success: Retrieved {len(data)} prompts for '{category}'")
            return True
    except Exception as e:
        print(f"❌ GET with category Failed: {e}")
        return False

def test_post_prompt(base_url="http://localhost:3000"):
    """Test POST request to add a new prompt"""
    try:
        url = f"{base_url}/api/prompts"
        print(f"Testing POST: {url}")
        
        # Test data
        test_prompt = {
            "title": "Test Prompt",
            "prompt": "This is a test prompt for API testing",
            "category": "Test Category",
            "imagePath": "/image/test/test.jpg"
        }
        
        data = json.dumps(test_prompt).encode('utf-8')
        req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})
        req.get_method = lambda: 'POST'
        
        with urllib.request.urlopen(req) as response:
            result = json.loads(response.read().decode())
            print(f"✅ POST Success: {result}")
            return True
    except Exception as e:
        print(f"❌ POST Failed: {e}")
        return False

if __name__ == "__main__":
    print("🧪 Testing API Endpoints...")
    print("=" * 50)
    
    # Note: These tests are designed for when the API is deployed
    # For local testing, you would need to run a local server
    print("📝 API Endpoint Tests (Ready for deployment)")
    print("   - GET /api/prompts (fetch all prompts)")
    print("   - GET /api/prompts?category=... (fetch by category)")
    print("   - POST /api/prompts (add new prompt)")
    print()
    print("🚀 To test after deployment:")
    print("   1. Deploy to Vercel")
    print("   2. Replace base_url with your Vercel domain")
    print("   3. Run this script")