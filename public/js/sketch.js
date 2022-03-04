function setup() {
  createCanvas(windowWidth, windowHeight);

  socket.on("devices", (data) => {
    // update neighbours datas
    updateNeighbours(data);
  });
}

function draw() {
  background(50);

  // Display socket id
  displayId();
}
