//get socket which only uses websockets as a means of communication
const socket = io();

let devices = {};
let current = {};
let neighbours = {};

function updateNeighbours(data) {
  devices = data;
  current = devices[socket.id];

  neighbours = {};
  if (current.neighbours) {
    Object.entries(current.neighbours).forEach((entry) => {
      const [position, id] = entry;
      if (id != "undefined" || id != undefined) {
        const neighbour = devices[id];
        if (neighbour) {
          neighbours[position] = [];

          Object.values(devices[id].touches).forEach((touch) => {
            let relativeWidth = 0;
            let relativeHeight = 0;

            //relativeWidth = position == "right" ? width : -width;
            //relativeHeight = position == "bottom" ? height : -height;
            if (position == "right") {
              relativeWidth = width;
            } else if (position == "left") {
              relativeWidth = -width;
            }

            if (position == "top") {
              relativeHeight = height;
            } else if (position == "bottom") {
              relativeHeight = -height;
            }

            neighbours[position].push(
              createVector(
                relativeWidth + touch.x * width,
                relativeHeight + touch.y * height
              )
            );
          });
        }
      }
    });
  }
  // console.log(neighbours);
}

function touchStarted() {
  updateTouches();
}
function touchEnded() {
  updateTouches();
}
function touchMoved() {
  updateTouches();
}

function updateTouches() {
  let touchesObjet = { id: socket.id, touches: [] };
  touches.forEach((touch, index) => {
    touchesObjet.touches.push({
      x: constrain(touch.x / width, 0, 1),
      y: constrain(touch.y / height, 0, 1),
    });
    /*
    console.log("Total height : " + height);
    console.log("Touch pos : " + touch.y);
    console.log("Mouse pos : " + mouseY);
    console.log("Relative height : " + touch.y / height);
    */
  });

  socket.emit("updateTouches", touchesObjet);
}

function updateSharedObject(obj) {
  socket.emit("updateShared", obj);
}

function mouseDragged() {
  socket.emit("updateTouches", {
    id: socket.id,
    touches: [
      {
        x: mouseX / width,
        y: mouseY / height,
      },
    ],
  });
}

function keyPressed() {
  // if (key == "d") debug = !debug;
}

function displayId() {
  push();
  textSize(16);
  fill(255);
  text(socket.id, 30, 30);
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
