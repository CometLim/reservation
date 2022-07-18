import http from "http";
import WebSocket from "ws";
import express, { application } from "express";
import { type } from "os";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));

const handleListen = () => console.log(`listening on http://localhost:3000`);

const server = http.createServer(app);
const wss = new WebSocket.Server( { server } );

const sockets = []; // socket들이 보관될 array

wss.on("connection", (socket) => {
    sockets.push(socket); // socket 마다 array에 진입
    socket["nickname"] = "Anonymous"
    console.log("Connected to Browser");
    socket.on("close", ()=> console.log("Disconnected From the Browser"));
    socket.on("message", (msg) => {
        const message = JSON.parse(msg);
        switch(message.type){
            case "new_message":
                sockets.forEach((aSocket) => aSocket.send(`${socket.nickname}: ${message.payload}`));
            case "nickname":
                socket["nickname"] = message.payload;
        }
        // if(parsed.type === "new_message"){
        //     sockets.forEach(aSocket => aSocket.send(parsed.payload));
        // } else if(parsed.type === "nickname"){
        //     console.log(parsed.payload);
        // }
    });
});

server.listen(3000, handleListen);

