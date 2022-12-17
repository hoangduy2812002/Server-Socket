var express = require("express");
var app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
server.listen(3002, () => {
  console.log("Server is running");
});

var listObject = {};
var listSocket = [];

io.on("connection", async function (socket) {
  console.log("co nguoi vua ket noi", socket.id);

  socket.on("connectUser", (email) => {

    listObject = {};
    listObject.socketId = socket.id;
    listObject.email = email;
    listSocket.push(listObject);
    io.sockets.emit("server-send-listSocket", listSocket);
    console.log("listSocket disconnect----->>", listSocket);
  });
  // console.log("END----->>", listSocket);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log("User joined room: " + data);
  });

  socket.on("send_message", (data) => {
    console.log("data-->", data);

    socket.to(data.room).emit("recevie_message", data.content);
    // socket.broadcast.emit("get_one_message");
    io.sockets.emit("get_one_message");
  });

  socket.on("create-group", function () {
    console.log("create-group")
    io.sockets.emit("get_one_message");
  });
  socket.on("add-friend", function () {
    console.log("add-friend")
    socket.broadcast.emit("request-accept");
  });

  socket.on("accept-friend-request", function () {
    console.log("accept-friend-request")
    io.sockets.emit("accept");
  });
  

  socket.on("I'm typing", (room, data) => {
    console.log("data", data);
    socket.broadcast.emit(
      room + "user-typing",
      data,
      data.fullName + " đang soạn tin nhắn..."
    );
  });
  socket.on("I stopped typing", (room) => {
    socket.broadcast.emit(room + "stop-user-typing", "");
  });

  socket.on("isSeen", (room) => {
    io.sockets.emit("get_one_message");
  });

  socket.on("disconnect", function () {
    listSocket.splice(listSocket.indexOf(socket.id), 1);
    console.log(socket.id + " ngat ket noi!!!!!!");
    io.sockets.emit("server-send-listSocket", listSocket);
    // console.log("listSocket disconnect----->>", listSocket);
  });

  socket.on("Client-request-like", function () {
    io.sockets.emit("Server-response-like-comment");
  });

  socket.on("Client-request-comment", function () {
    io.sockets.emit("Server-response-like-comment");
  });

  socket.on("Client-request-createPost", function () {
    io.sockets.emit("Server-response-like-comment");
  });

  socket.on("logout", function (account) {
    listSocket.splice(listSocket.indexOf(socket.id), 1);
    io.sockets.emit("server-send-listSocket", listSocket);
    console.log("listSocket----->>", listSocket);
  });
});
