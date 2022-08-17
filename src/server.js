import http from "http";
import SocketIO from "socket.io";
import express from "express"

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

wsServer.on("connection", (socket) => {
    socket["nickname"] =  "Anon";
    socket.on("enter_room", (roomName, done) => {
        socket.join(roomName);
        done();
        socket.to(roomName).emit("welcome", socket.nickname);
    });
    socket.on("disconnecting", () => {
        socket.rooms.forEach(room => socket.to(room).emit("bye", socket.nickname));
    });
    socket.on("new_message", (msg, room, done) => {
        socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
        done();
    });
    socket.on("nickname", (nickname)  => (socket["nickname"] = nickname));
});

// const wss = new WebSocket.Server( { server } );

// const sockets = []; // socket들이 보관될 array

// wss.on("connection", (socket) => {
//     sockets.push(socket); // socket 마다 array에 진입
//     socket["nickname"] = "Anonymous"
//     console.log("Connected to Browser");
//     socket.on("close", ()=> console.log("Disconnected From the Browser"));
//     socket.on("message", (msg) => {
//         const message = JSON.parse(msg);
//         switch(message.type){
//             case "new_message":
//                 sockets.forEach((aSocket) => aSocket.send(`${socket.nickname}: ${message.payload}`));
//             case "nickname":
//                 socket["nickname"] = message.payload;
//         }
//         // if(parsed.type === "new_message"){
//         //     sockets.forEach(aSocket => aSocket.send(parsed.payload));
//         // } else if(parsed.type === "nickname"){
//         //     console.log(parsed.payload);
//         // }
//     });
// });
const handleListen = () => console.log(`listening on http://localhost:3000`);
httpServer.listen(3000, handleListen);