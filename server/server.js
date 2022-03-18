const express = require("express");
const socket = require("socket.io");
const app = express();

let server = app.listen(3000);
console.log("The server is now running");

app.use(express.static("public"));

let io = socket(server);

let positions = ["top", "right", "bottom", "left"];
let positions_mirror = ["bottom", "left", "top", "right"];

//store the devices of each client in this object.
//It would be safer to connect it to a database as well so the data doesn't get destroyed when the server restarts
//but we'll just use an object for simplicity.
const devices = {};
let shared = {};

//Socket configuration
io.on("connection", (socket) => {
  //each time someone visits the site and connect to socket.io this function  gets called
  //it includes the socket object from which you can get the id, useful for identifying each client
  console.log(`${socket.id} connected`);

  //shared = {};
  //io.emit("shared", shared);
  // DATA STRUCTURE
  if (!socket.handshake.query["device-type"])
    devices[socket.id] = {
      touches: {},
      neighbours: {
        top: undefined,
        right: undefined,
        bottom: undefined,
        left: undefined,
      },
    };

  io.emit("devices", devices);
  io.emit("connections", devices);

  // Flush all shared objects
  shared = {};
  /*
  Object.keys(shared).forEach((id) => {
    //if (shared[id].device === socket.id)
    io.emit("shared", { device: socket.id, shared: shared[id] });
  });
  */
  io.emit("shared", { reset: true });

  socket.on("disconnect", () => {
    //when this client disconnects, lets delete its position from the object.
    delete devices[socket.id];
    //console.log(`${socket.id} disconnected`);

    io.emit("devices", devices);
    io.emit("connections", devices);
    io.emit("shared", { reset: true });
    //shared = {};
    //io.emit("shared", shared);
  });

  socket.on("updateTouches", (data) => {
    devices[socket.id].touches = data.touches;
    //if (data.touches) console.log(data.touches);
    io.emit("devices", devices);

    console.log(Object.keys(devices).length + " devices connected");
    console.log(devices);
    console.log("——————————————————————————————————");
  });

  socket.on("updatePositions", (data) => {
    devices[data.referal].neighbours[data.direction] = data.selection;

    // mirror
    positions.forEach((position, index) => {
      if (data.direction == position) {
        Object.keys(devices).forEach((device) => {
          if (
            devices[device].neighbours[positions_mirror[index]] == data.referal
          )
            devices[device].neighbours[positions_mirror[index]] = undefined;
        });

        if (data.selection != "undefined") {
          devices[data.selection].neighbours[positions_mirror[index]] =
            data.referal;
        }
      }
    });

    // console.log(devices);

    io.emit("devices", devices);
    io.emit("connections", devices);
  });

  socket.on("updateShared", (data) => {
    shared[data.id] = data;
    //io.emit("shared", shared);
    io.emit("shared", { device: socket.id, shared: shared[data.id] });

    console.log(shared);
  });
});

//send devices every framerate to each client
/*
const frameRate = 30;
setInterval(() => {
  io.emit("devices", devices);
}, 1000 / frameRate);
*/
