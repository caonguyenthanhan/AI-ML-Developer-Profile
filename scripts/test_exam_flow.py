import json
import sys
import urllib.request
import urllib.error

BASE = "https://hethongthongminh.id.vn"

def req(method, path, data=None, headers=None):
    url = BASE + path
    h = {"User-Agent": "PythonTest/1.0", "Cache-Control": "no-store"}
    if headers:
        h.update(headers)
    body = None
    if data is not None:
        body = json.dumps(data).encode("utf-8")
        h["Content-Type"] = "application/json"
    r = urllib.request.Request(url, data=body, headers=h, method=method)
    try:
        with urllib.request.urlopen(r) as resp:
            txt = resp.read().decode("utf-8")
            try:
                return resp.status, json.loads(txt)
            except Exception:
                return resp.status, {"_raw": txt}
    except urllib.error.HTTPError as e:
        try:
            txt = e.read().decode("utf-8")
            j = json.loads(txt)
        except Exception:
            j = {"_raw": txt}
        return e.code, j
    except Exception as e:
        return 0, {"error": str(e)}

def main():
    # 1) Trạng thái trước khi gửi
    s1, j1 = req("GET", "/api/exam_status")
    print("Before exam_status:", s1, j1)

    # 2) Gửi một bài thử
    payload = {
        "score": 1,
        "totalMcq": 8,
        "answers": {"q1": "A"},
        "code7": "print(7)",
        "code8": "print(8)",
        "studentName": "Test Bot",
        "studentEmail": "test@example.com",
        "pageUrl": BASE + "/education/tin_hoc_hsg/check_the_basics/bai1.html",
        "userAgent": "PythonTest/1.0",
    }
    s2, j2 = req("POST", "/api/send_exam", data=payload)
    print("Send exam:", s2, j2)

    # 3) Trạng thái sau khi gửi
    s3, j3 = req("GET", "/api/exam_status")
    print("After exam_status:", s3, j3)

    # 4) Danh sách submissions
    s4, j4 = req("GET", "/api/exam_submissions")
    print("exam_submissions:", s4, j4)

    # 5) Đọc bản ghi theo id nếu có
    try:
        sid = j2.get("id") if isinstance(j2, dict) else None
    except Exception:
        sid = None
    if sid:
        s5, j5 = req("GET", f"/api/exam_read?id={sid}")
        print("exam_read:", s5, j5)

if __name__ == "__main__":
    sys.exit(main())