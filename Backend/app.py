import time
from flask import Flask
# from flask_cors import CORS

app = Flask(__name__)

@app.route('/api')
def api():
    return {'time': time.time()}