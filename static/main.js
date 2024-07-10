console.log('Hello from the main.js file');

const socket = io(); // When the 'connect' event happens

// console.log(socket)

// socket.on('custom_test_event', (data) => {
//     console.log('The client has handled the following message from the server:', data)
// })

// Socket listener to accept the current bid

socket.on('current_bid', (currentBidData) => {
    // console.log(currentBidData)
    // Grab the bidAmount and bidderName span elements by Id and update their innerText
    console.log('New bid coming in:', currentBidData);
    let bidAmountSpan = document.getElementById('bidAmount');
    bidAmountSpan.innerText = currentBidData.amount.toLocaleString();
    let bidderNameSpan = document.getElementById('bidderName');
    bidderNameSpan.innerText = currentBidData.bidder;
})

// Socket listener to handle errors from the server
socket.on('rejection', (rejectionData) => {
    alert(rejectionData.reason)
})

// Socket listener to accept the bid history list
socket.on('bid_history', (historyArr) => {
    const historyListElement = document.getElementById('historyList');
    // Clear out the current element
    historyListElement.innerHTML = '';
    // create a list element for each bid in the historyArr
    historyArr.forEach( (bid) => {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item'
        listItem.innerText = `Bid: $${bid.amount} by ${bid.bidder}`
        historyListElement.appendChild(listItem)
    })
})

// Socket listener to accept the time remaining on the auction
socket.on('auction_timer', (timeRemaining) => {
    const timer = document.getElementById('timeRemaining')
    timeRemaining = Math.floor(timeRemaining)
    const interval = setInterval(()=>{
        timeRemaining--;
        if (timeRemaining <=0){
            clearInterval(interval)
            timer.className = 'text-danger'
            timer.innerText = 'Auction has ended'
        } else {
            const minutes = Math.floor(timeRemaining / 60)
            const seconds = timeRemaining % 60
            timer.innerText = `${minutes}m ${seconds}s`
        }
    }, 1000)
})


// Grab the bid form and add event listener
const bidForm = document.getElementById('bidForm');
bidForm.addEventListener('submit', (ev) => {
    ev.preventDefault();
    // Get the data from the form inputs
    let bidder = document.getElementById('bidder').value;
    let amount = parseFloat(document.getElementById('amount').value);
    // Send the new bid to the server
    let newBidData = { bidder, amount };
    socket.emit('new_bid', newBidData);

    // Clear the input value data
    document.getElementById('bidder').value = '';
    document.getElementById('amount').value = '';
})
