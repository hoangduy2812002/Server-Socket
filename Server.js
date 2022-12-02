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


io.on("connection", function (socket) {
  console.log("co nguoi vua ket noi",socket.id)
  socket.on("join_room",(data)=>{
    socket.join(data);
    console.log("User joined room: "+data)
  });

  socket.on("send_message",(data)=>{
    console.log("data-->",data)
    socket.to(data.room).emit("recevie_message",data.content);
    // socket.to(data.room).emit("get_one_message");
    socket.broadcast.emit("get_one_message");
  })

  socket.on("I'm typing",(room,data)=>{
    // console.log("data",data)
    socket.broadcast.emit(room+"user-typing",data.studentCode,data.fullName+" đang soạn tin nhắn...")
  })
  socket.on("I stopped typing",(room)=>{
    socket.broadcast.emit(room+"stop-user-typing","")
  })

  socket.on("disconnect", function () {
    console.log(socket.id + " ngat ket noi!!!!!!");
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

  // socket.on("client-user-connect", function (customer, account) {
  //   // console.log("customer----->>", customer);
  //   // console.log("account----->>", account);
  //   io.sockets.emit(customer.studentCode,account);
  //   io.sockets.emit(account.studentCode,customer);
  // });

  // socket.on("client-send-message", function (customer, account,content) {
  //   console.log("from",customer)
  //   console.log("to",account)
  //   console.log("content",content)
  //   io.sockets.emit('server-send'+customer.studentCode,content);
  //   io.sockets.emit('server-send'+account.studentCode,content);

  //   // io.sockets.emit("Server-response-like-comment");
  // });

  // socket.on("logout", function () {
  //   mangUsers.slice(mangUsers.indexOf(socket.studentCode), 1);
  //   io.broadcast.emit("server-send-danhSach-Users", mangUsers);
  // });
});
