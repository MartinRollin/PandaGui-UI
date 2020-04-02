// Setting local variables, each movable header part should be here
let movingDiv = document.getElementById("movingDiv");
let commandsDiv = document.getElementById("commandsDiv");
let robotStateDiv = document.getElementById("robotStateDiv");
let qpStateDiv = document.getElementById("qpStateDiv");
let gainTunningDiv = document.getElementById("gainTunningDiv");

const movableDivs = new Array(
  movingDiv,
  commandsDiv,
  robotStateDiv,
  qpStateDiv,
  gainTunningDiv
);

const changePositionTarget = event => {
  let id = event.target.id;
  if (id.substring(id.length - 3) != "Div") {
    changePosition(event.target.parentNode);
  } else {
  }
};

const changePosition = elem => {
  let id = elem.id;
  if (id.substring(id.length - 3) == "Div") {
    let posIdFinal = elem.children[0].children[0].getAttribute("positionsId");
    movableDivs.forEach(movableDiv => {
      let movableHeader = movableDiv.children[0].children[0];
      if (movableHeader.getAttribute("positionsId") == posIdFinal) {
        movableDiv.style.zIndex = "9";
      } else {
        movableDiv.style.zIndex = movableDiv.style.zIndex - 1;
      }
    });
  } else if (elem.parentNode.id != undefined) {
    if (elem.parentNode) {
      changePosition(elem.parentNode);
    }
  } else {
    console.log("oups ca marche pas");
  }
};

movableDivs.forEach(movableDiv => {
  movableDiv.addEventListener("mousedown", changePositionTarget);
});
