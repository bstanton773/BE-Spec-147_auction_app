from flask import Flask, render_template
from flask_socketio import SocketIO


app = Flask(__name__)
app.config['SECRET_KEY'] = 'super-secret-key'

socketio = SocketIO(app)


@app.route('/')
def index():
    return render_template('index.html')


@socketio.on('connect')
def handle_connect():
    print('Client has connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client has disconnected')


if __name__ == "__main__":
    # app.run(debug=True, port=5001)
    socketio.run(app, debug=True, port=5001)
