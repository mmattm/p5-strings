const socket = io({
  query: {
    "device-type": "master",
  },
});

let positions = ["top", "right", "bottom", "left"];

let devices = {};

function setup() {
  noCanvas();

  socket.on("connections", (data) => {
    //console.log(data);
    devices = data;
    delete devices[socket.id];

    topdateUI(data);
  });
}

function topdateUI(data) {
  let container = select("#list");
  //container.addClass("row");
  container.html("");

  Object.entries(devices).forEach(([key, value]) => {
    let div = createDiv();
    div.addClass("device column");
    let h3 = createElement("h3", key);
    h3.parent(div);

    positions.forEach((position) => {
      let label = createDiv(position);
      label.addClass("device-position");
      let select = createSelect();
      select.addClass("select-css");
      select.id(key + "-" + position);
      select.attribute("direction", position);
      //select.attribute("device-id", key);
      select.attribute("referal", key);
      select.option(undefined);

      Object.entries(devices).forEach(([key2, value2]) => {
        if (key != key2) select.option(key2);
      });
      select.parent(label);
      label.parent(div);

      select.changed(mySelectEvent);

      if (data[key].neighbours[position]) {
        select.selected(data[key].neighbours[position]);
      }

      //if (data[key][position]) select.selected(data[key][position]);
    });

    div.parent(container);
  });
}

function mySelectEvent(event) {
  let e = document.getElementById(event.target.id);
  let selection = e.value;

  let direction = e.getAttribute("direction");
  //let device_id = e.getAttribute("device-id");
  let referal = e.getAttribute("referal");

  socket.emit("updatePositions", {
    referal: referal,
    selection: selection,
    direction: direction,
  });
}
