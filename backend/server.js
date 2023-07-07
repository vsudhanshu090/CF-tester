const express = require("express");
const app = express();

const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);
const io = new Server(server);

var compiler = require("compilex");
var options = { stats: true }; //prints stats on console
compiler.init(options);

const userSocketMap = {};

function getAllConnectedClients(roomId) {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        username: userSocketMap[socketId],
      };
    }
  );
}

io.on("connection", (socket) => {
  console.log("socket connected");

  socket.on("join", ({ roomId, username }) => {
    userSocketMap[socket.id] = username;
    socket.join(roomId);
    const clients = getAllConnectedClients(roomId);

    console.log(clients);

    clients.forEach(({ socketId }) => {
      io.to(socketId).emit("joined", {
        clients,
        username,
        socketId: socket.id,
      });
    });
  });

  socket.on("submitcpp", ({ code, roomId }) => {
    const clients = getAllConnectedClients(roomId);

    clients.forEach(({ socketId }) => {
      var envData = { OS: "windows", cmd: "g++", options: { timeout: 10000 } };
      compiler.compileCPP(envData, code, function (data) {
        if (data.error)
          io.to(socketId).emit("outputReady", { givenOutput: data.error });
        else io.to(socketId).emit("outputReady", { givenOutput: data.output });
      });
    });
  });

  socket.on("submitpy", ({ code, roomId }) => {
    const clients = getAllConnectedClients(roomId);

    clients.forEach(({ socketId }) => {
      var envData = { OS: "windows", options: { timeout: 10000 } };
      compiler.compilePython(envData, code, function (data) {
        if (data.error)
          io.to(socketId).emit("outputReady", { givenOutput: data.error });
        else io.to(socketId).emit("outputReady", { givenOutput: data.output });
      });
    });
  });

  socket.on("submitcppwithip", ({ code, input, roomId }) => {
    const clients = getAllConnectedClients(roomId);

    clients.forEach(({ socketId }) => {
      var envData = { OS: "windows", cmd: "g++", options: { timeout: 10000 } };
      compiler.compileCPPWithInput(envData, code, input, function (data) {
        if (data.error)
          io.to(socketId).emit("outputReady", { givenOutput: data.error });
        else io.to(socketId).emit("outputReady", { givenOutput: data.output });
      });
    });
  });

  socket.on("submitpywithip", ({ code, input, roomId }) => {
    const clients = getAllConnectedClients(roomId);

    clients.forEach(({ socketId }) => {
      var envData = { OS: "windows", options: { timeout: 10000 } };
      compiler.compilePythonWithInput(envData, code, input, function (data) {
        if (data.error)
          io.to(socketId).emit("outputReady", { givenOutput: data.error });
        else io.to(socketId).emit("outputReady", { givenOutput: data.output });
      });
    });
  });

  socket.on("flushFiles", () => {
    compiler.flush(function () {
      console.log("All temporary files flushed !");
    });
  });

  socket.on("disconnecting", () => {
    const rooms = Array.from(socket.rooms);
    rooms.forEach((roomId) => {
      socket.in(roomId).emit("disconnected", {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      });
    });

    delete userSocketMap[socket.id];
    socket.leave();
  });

  socket.on("codeChange", ({ roomId, code }) => {
    const clients = getAllConnectedClients(roomId);

    clients.forEach(({ socketId }) => {
      io.to(socketId).emit("codeSync", {
        inputCode: code,
      });
    });
  });

  socket.on("firstJoinCodeSync", ({ code, socketId }) => {
    io.to(socketId).emit("codeSync", { inputCode: code });
  });

  socket.on("inputChange", ({ roomId, input }) => {
    const clients = getAllConnectedClients(roomId);

    clients.forEach(({ socketId }) => {
      io.to(socketId).emit("inputSync", {
        inputInput: input,
      });
    });
  });

  socket.on("firstJoinInputSync", ({ input, socketId }) => {
    io.to(socketId).emit("inputSync", { inputInput: input });
  });
});

server.listen(6009, () => {
  console.log("Server is running on port 6009");
});
