const socket = new WebSocket(`ws://${window.location.host}`) // socket : 서버로의 연결 

socket.addEventListener("open", () => {
    console.log("Connect to Browser. :check:");
});

socket.addEventListener("message", (message) => {
    console.log("Just got this: ", message.data, " from the server");
});

socket.addEventListener("close", () => {
    console.log("Connected from Server X");
});

setTimeout(() => {
    socket.send("hello from the browser!");
}, 10000);