// recursive methods to let current clicked object on front
// method for first call with onclick event
const changePositionTarget = (event) => {
  let id = event.target.id;
  if (id.substring(id.length - 3) != "Div") {
    changePosition(event.target.parentNode);
  } else {
    // clicked object is final div container
    changePosition(event.target);
  }
};

const changePosition = (elem) => {
  let id = elem.id;
  if (id.substring(id.length - 3) == "Div") {
    let posIdFinal = $(`#${elem.id}Header`).attr("positionsId");
    for (i = 0; i < movingDivs.length; i++) {
      movingDiv = movingDivs[i];
      let movableHeader = movingDiv.children[0].children[0];
      if (movableHeader.getAttribute("positionsId") == posIdFinal) {
        movingDiv.style.zIndex = "9";
      } else {
        movingDiv.style.zIndex = movingDiv.style.zIndex - 1;
      }
    }
  } else if (elem.parentNode.id != undefined) {
    if (elem.parentNode) {
      changePosition(elem.parentNode);
    }
  } else {
    console.log(
      "Div " + id + "is not moving, check the structure of this element."
    );
  }
};
