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

  socket.on("connectUser", (email, arr) => {
    for (let index = 0; index < arr.length; index++) {
      const roomId = arr[index];
      socket.join(roomId);
      console.log("User joined room: " + roomId);
    }
    listObject = {};
    listObject.socketId = socket.id;
    listObject.email = email;
    listSocket.push(listObject);
    // io.sockets.emit("server-send-listSocket", listSocket);
    console.log("listSocket connectUser----->>", listSocket);
    io.sockets.emit("server-send-listSocket-room",listSocket);


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
    // io.sockets.emit("get_one_message");
    // socket.to(data.room).emit("reset_nameGroup");
    console.log("send_message")

    io.sockets.emit("reset_nameGroup",listSocket);
  });

  socket.on("create-group", function () {
    console.log("create-group");
    // io.sockets.emit("get_one_message");
    socket.broadcast.emit("reset_nameGroup",listSocket);
    socket.broadcast.emit("reset_getAllNotification",listSocket);
    io.sockets.emit("reset_private_room");

  });
  socket.on("add-friend", function () {
    // console.log("add-friend");
    socket.broadcast.emit("request-accept");
    io.sockets.emit("reset_nameGroup",listSocket);
    socket.broadcast.emit("reset_getAllNotification",listSocket);

  });

  socket.on("accept-friend-request", function () {
    console.log("accept-friend-request");
    io.sockets.emit("reset_friend",listSocket);
    io.sockets.emit("reset_nameGroup",listSocket);
    socket.broadcast.emit("reset_getAllNotification",listSocket);
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

  socket.on("isSeen", () => {
    console.log("isSeen")
    socket.emit("reset_nameGroup",listSocket);
  });

  socket.on("disconnect", function () {
    console.log(socket.id + " ngat ket noi!!!!!!");
    // console.log(" ------- -> ",listSocket.socketId.indexOf(socket.id));
      console.log("listSocket-<<<<<<",listSocket)

    for (let index = 0; index < listSocket.length; index++) {
      if (listSocket[index].socketId == socket.id) {
        listSocket.splice(index, 1)
      }
    }
    console.log("disconnect----->>", listSocket);

    io.sockets.emit("server-send-listSocket-room",listSocket);
  });

  socket.on("add-member", function () {
    socket.emit("accept-member");
    io.sockets.emit("reset_nameGroup",listSocket);
  });

  socket.on("request-group", function () {
    socket.broadcast.emit("accept-member");
    socket.broadcast.emit("reset_getAllNotification",listSocket);

  });
  
//--------------------------------------------------------------------------
//Like-comment-create
  socket.on("Client-request-like", function () {
    socket.broadcast.emit("Server-response-like-comment");
  });
  socket.on("Client-request-comment", function () {
    socket.broadcast.emit("Server-response-like-comment");
  });
  socket.on("Client-request-createPost", function () {
    socket.broadcast.emit("Server-response-like-comment");
  });
//--------------------------------------------------------------------------
  // socket.on("logout", function (account) {
  //   listSocket.splice(listSocket.indexOf(socket.id), 1);
  //   io.sockets.emit("server-send-listSocket-room", listSocket);
  //   console.log("listSocket----->>", listSocket);
  // });
});
