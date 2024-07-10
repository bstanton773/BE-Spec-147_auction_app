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
