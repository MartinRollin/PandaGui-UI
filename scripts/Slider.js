/// Slider element of the code. The node is defined in Render property
class Slider {
  constructor(name, min, max, visible) {
    this.Name = name;
    this.Min = min;
    this.Max = max;
    this.Visible = visible;
    this.Render = document.createElement("div");
    this.Render.className = "sliders";

    var input1 = document.createElement("input");
    input1.min = min;
    input1.max = max;
    input1.value = 0;
    input1.step = 0.01;
    input1.className = "slider";
    input1.id = name + "_slider";
    input1.oninput = name + "_slider.value = " + name + "_value.value";
    input1.type = "range";
    this.Render.appendChild(input1);

    var output1 = document.createElement("output");
    output1.className = "slider_name";
    output1.lang = "latex";
    if (name.charAt(1) == "d") {
      output1.innerText = "\\boldsymbol{\\dot{q}_" + name.charAt(2) + "}";
    } else if (name.charAt(1) == "p") {
      output1.innerText = "\\boldsymbol{\\tau_" + name.charAt(2) + "}";
    } else {
      output1.innerText = "\\boldsymbol{" + name + "}";
    }

    this.Render.appendChild(output1);

    var output2 = document.createElement("output");
    output2.className = "slider_val";
    output2.id = name + "_value";
    this.Render.appendChild(output2);

    var output3 = document.createElement("output");
    output3.className = "slider_min_val";
    output3.id = name + "_slider_min_value";
    output3.innerText = min;
    this.Render.appendChild(output3);

    var output4 = document.createElement("output");
    output4.className = "slider_max_val";
    output4.id = name + "_slider_max_value";
    output4.innerText = max;
    this.Render.appendChild(output4);
  }
}
