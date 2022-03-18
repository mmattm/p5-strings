function setup() {
  createCanvas(windowWidth, windowHeight);

  socket.on("devices", (data) => {
    // update neighbours datas
    updateNeighbours(data);
  });

  socket.on("shared", (data) => {
    // update shared objects datas
  });
}

function draw() {
  background(50);

  // Display socket id
  displayId();
}
