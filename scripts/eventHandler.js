//Make the DIV element draggagle and go to front when selected
let movingDivs = $("[class~=movingDiv]");
for (i = 0; i < movingDivs.length; i++) {
  dragElement(movingDivs[i]);
  movingDivs[i].addEventListener("mousedown", changePositionTarget);
}
