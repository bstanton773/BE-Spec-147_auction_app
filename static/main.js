console.log('Hello from the main.js file')

const socket = io() // When the 'connect' event happens

// console.log(socket)

// socket.on('custom_test_event', (data) => {
//     console.log('The client has handled the following message from the server:', data)
// })

// Socket listener to accept the current bid

socket.on('current_bid', (currentBidData) => {
    // console.log(currentBidData)
    // Grab the bidAmount and bidderName span elements by Id and update their innerText
    let bidAmountSpan = document.getElementById('bidAmount')
    bidAmountSpan.innerText = currentBidData.amount
    let bidderNameSpan = document.getElementById('bidderName')
    bidderNameSpan.innerText = currentBidData.bidder
})
