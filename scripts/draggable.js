//Make the DIV element draggagle:
dragElement(document.getElementById("mydiv"));
dragElement(document.getElementById("movingDiv"));
dragElement(document.getElementById("commandsDiv"));
dragElement(document.getElementById("robotStateDiv"));
dragElement(document.getElementById("qpStateDiv"));
dragElement(document.getElementById("gainTunningDiv"));

function dragElement(elmnt) {
  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;
  if (document.getElementById(elmnt.id + "Header")) {
    /* if present, the header is where you move the DIV from:*/
    document.getElementById(elmnt.id + "Header").onmousedown = dragMouseDown;
  } else {
    /* otherwise, move the DIV from anywhere inside the DIV:*/
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();

    // bringing the chosen element to the front
    movableHeaders.forEach(movableHeader => {
      let movableDiv = movableHeader.parentNode.parentNode;
      console.log("identfiant de l'element target : " + e.target.id);
      if (
        movableHeader.getAttribute("positionsId") ==
        e.target.getAttribute("positionsId")
      ) {
        movableDiv.style.zIndex = "10";
        console.log("Voila l'index qui va devant : " + movableDiv.id);
      } else {
        console.log("va derrière : " + movableDiv.id);
        movableDiv.style.zIndex = movableDiv.style.zIndex - 1;
      }
    });

    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    if (elmnt.offsetTop >= -10) {
      elmnt.style.top = elmnt.offsetTop - pos2 + "px";
    } else {
      elmnt.style.top = -10 + "px";
    }
    if (elmnt.offsetLeft >= -350) {
      elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
    } else {
      elmnt.style.left = -350 + "px";
    }
  }

  function closeDragElement() {
    /* stop moving when mouse button is released:*/
    // elmnt.onmouseup = e => {
    //   addOrUpdate(e);
    //   alert(elmnt.offsetLeft + " " + elmnt.id);
    // };
    // document.onmouseup = null;
    document.onmousemove = null;
  }
}
