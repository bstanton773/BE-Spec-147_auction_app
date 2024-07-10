console.log('Hello from the main.js file')

const socket = io()

// console.log(socket)

socket.on('custom_test_event', (data) => {
    console.log('The client has handled the following message from the server:', data)
})
