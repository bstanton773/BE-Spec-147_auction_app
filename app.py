from flask import Flask, render_template
from flask_socketio import SocketIO


app = Flask(__name__)
app.config['SECRET_KEY'] = 'super-secret-key'

socketio = SocketIO(app)

# Data for the app
current_bid = {'amount': 0, 'bidder': 'No bids yet'}


@app.route('/')
def index():
    return render_template('index.html')


@socketio.on('connect')
def handle_connect():
    print('Client has connected')
    socketio.emit('current_bid', current_bid)

@socketio.on('disconnect')
def handle_disconnect():
    print('Client has disconnected')

# listener for accepting a new bid
@socketio.on('new_bid')
def handle_new_bid(new_bid_data):
    print('Accepting new bid:', new_bid_data)
    bid_amount = new_bid_data.get('amount', 0)
    bidder_name = new_bid_data.get('bidder', 'Anonymous')
    if bid_amount > current_bid['amount']:
        current_bid['amount'] = bid_amount
        current_bid['bidder'] = bidder_name
        print('Successful bid, sending new bid out:', current_bid)
        socketio.emit('current_bid', current_bid, broadcast=True)
    else:
        print('Bid was too low!')


if __name__ == "__main__":
    # app.run(debug=True, port=5001)
    socketio.run(app, debug=True, port=5001)
