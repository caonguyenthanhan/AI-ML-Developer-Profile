import os
import sys
import subprocess
from PIL import Image
import pystray

def load_icon():
    path = os.path.join('public', 'image', 'avata1.png')
    if os.path.exists(path):
        return Image.open(path)
    return Image.new('RGB', (64, 64), (234, 88, 12))

def start_server():
    env = os.environ.copy()
    if 'PORT' not in env:
        env['PORT'] = '54321'
    return subprocess.Popen([sys.executable, 'app.py'], cwd=os.getcwd(), env=env)

def stop_server(p):
    if p and p.poll() is None:
        p.terminate()
        try:
            p.wait(timeout=5)
        except Exception:
            p.kill()

proc = start_server()

def action_stop(icon, item):
    stop_server(proc)
    icon.stop()

def action_exit(icon, item):
    stop_server(proc)
    icon.stop()

menu = pystray.Menu(
    pystray.MenuItem('Dừng server', action_stop),
    pystray.MenuItem('Thoát', action_exit)
)

icon = pystray.Icon('AIMLDevProfile', load_icon(), 'AIML Developer Profile', menu)
icon.run()