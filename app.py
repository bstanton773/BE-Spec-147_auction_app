from flask import Flask, render_template
from flask_socketio import SocketIO, emit
import time


app = Flask(__name__)
app.config['SECRET_KEY'] = 'super-secret-key'

socketio = SocketIO(app)

# Data for the app
current_bid = {'amount': 0, 'bidder': 'No bids yet'}
bid_history = []
# Auction duration in seconds
auction_duration = 5 * 60 # (5 minutes)
auction_end_time = time.time() + auction_duration


@app.route('/')
def index():
    return render_template('index.html')


@socketio.on('connect')
def handle_connect():
    print('Client has connected')
    emit('current_bid', current_bid)
    emit('bid_history', bid_history)
    time_remaining = auction_end_time - time.time()
    emit('auction_timer', time_remaining)

@socketio.on('disconnect')
def handle_disconnect():
    print('Client has disconnected')

# listener for accepting a new bid
@socketio.on('new_bid')
def handle_new_bid(new_bid_data):
    if time.time() > auction_end_time:
        emit('rejection', {'reason': 'This auction has ended. No more bids allowed'})
        return

    print('Accepting new bid:', new_bid_data)
    bid_amount = new_bid_data.get('amount', 0)
    bidder_name = new_bid_data.get('bidder', 'Anonymous')
    if bid_amount > current_bid['amount']:
        current_bid['amount'] = bid_amount
        current_bid['bidder'] = bidder_name
        bid_history.append(current_bid.copy())
        print(bid_history)
        print('Successful bid, sending new bid out:', current_bid)
        emit('current_bid', current_bid, broadcast=True)
        emit('bid_history', bid_history, broadcast=True)
    else:
        emit('rejection', {'reason': f'Your bid (${bid_amount}) must be greater than the current bid (${current_bid["amount"]})'})

@socketio.on('auction_ended')
def handle_auction_ending():
    emit('auction_winner', current_bid, broadcast=True)
    # current_bid['amount'] = 0
    # current_bid['bidder'] = 'No bids yet'
    # bid_history.clear()
    # global auction_end_time
    # auction_end_time = time.time() + auction_duration
    # emit('current_bid', current_bid, broadcast=True)
    # emit('bid_history', bid_history, broadcast=True)
    # time_remaining = auction_end_time - time.time()
    # emit('auction_timer', time_remaining, broadcast=True)



if __name__ == "__main__":
    # app.run(debug=True, port=5001)
    socketio.run(app, debug=True, port=5001)
