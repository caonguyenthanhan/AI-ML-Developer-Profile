import os
import re

def verify_urls(directory):
    error_count = 0
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(".html") or file.endswith(".js") or file.endswith(".json"):
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                        
                        # Check for /caonguyenthanhan/profile not followed by /aise
                        # We use a simple regex to find all occurrences and then check
                        matches = re.finditer(r'(/caonguyenthanhan/profile)(?!/aise)', content)
                        for match in matches:
                            print(f"Potential Issue in {file_path}: Found '{match.group(0)}' at index {match.start()}")
                            error_count += 1

                        # Check for /profile not followed by /aise (and not part of /caonguyenthanhan/profile)
                        # This is trickier. simpler to just find all /profile and check context
                        # But /profile might be valid in other contexts (e.g. text).
                        # Let's assume we are looking for hrefs or src
                        
                        # Let's search for specific old patterns mentioned in requirements
                        # Old: /caonguyenthanhan/profile -> New: /caonguyenthanhan/profile/aise
                        # Old: /profile -> New: /profile/aise
                        
                        # Find href="/profile" or href="/caonguyenthanhan/profile"
                        
                        if 'href="/profile"' in content:
                             print(f"Issue in {file_path}: Found 'href=\"/profile\"'")
                             error_count += 1
                        
                        if 'href="/caonguyenthanhan/profile"' in content:
                             print(f"Issue in {file_path}: Found 'href=\"/caonguyenthanhan/profile\"'")
                             error_count += 1
                             
                except Exception as e:
                    print(f"Could not read {file_path}: {e}")

    if error_count == 0:
        print("Verification Complete: No old URL patterns found.")
    else:
        print(f"Verification Complete: Found {error_count} potential issues.")

if __name__ == "__main__":
    verify_urls("d:\\desktop\\AIML Developer Profile")
