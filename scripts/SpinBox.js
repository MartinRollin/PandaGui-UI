//code.iamkate.com
function SpinBox(a, b) {
  "string" == typeof a && (a = document.getElementById(a));
  this.options = b ? b : {};
  "className" in this.options || (this.options.className = "spinBox");
  "step" in this.options || (this.options.step = 1);
  "decimals" in this.options || (this.options.decimals = 0);
  var c = a.getElementsByTagName("input");
  0 == c.length
    ? ((this.input = document.createElement("input")),
      this.setValue("value" in this.options ? this.options.value : 0),
      a.appendChild(this.input))
    : ((this.input = c[0]),
      this.setValue(
        this.options.value ? this.options.value : this.input.value
      ));
  c = document.createElement("span");
  c.appendChild(document.createElement("span"));
  a.appendChild(c);
  var d = document.createElement("span");
  d.appendChild(document.createElement("span"));
  a.appendChild(d);
  a.className += " " + this.options.className;
  c.className = this.options.className + "Up";
  d.className = this.options.className + "Down";
  this.addEventListener(
    this.input,
    "mousewheel",
    this.handleMouseWheel,
    [],
    !0
  );
  this.addEventListener(
    this.input,
    "DOMMouseScroll",
    this.handleMouseWheel,
    [],
    !0
  );
  this.addEventListener(this.input, "keydown", this.handleKeyDown, [], !0);
  this.addEventListener(this.input, "keypress", this.handleKeyPress, [], !0);
  this.addEventListener(this.input, "keyup", this.stop);
  this.addEventListener(c, "mousedown", this.start, [!0]);
  this.addEventListener(c, "mouseup", this.stop);
  this.addEventListener(c, "mouseout", this.stop);
  this.addEventListener(d, "mousedown", this.start, [!1]);
  this.addEventListener(d, "mouseup", this.stop);
  this.addEventListener(d, "mouseout", this.stop);
}
SpinBox.prototype.getValue = function () {
  return parseFloat(this.input.value);
};
SpinBox.prototype.setValue = function (a) {
  "minimum" in this.options && (a = Math.max(this.options.minimum, a));
  "maximum" in this.options && (a = Math.min(this.options.maximum, a));
  var b = 0 > a ? "-" : "";
  a = Math.abs(a);
  var c = Math.pow(10, this.options.decimals);
  a = Math.round(a * c);
  for (var d = "" + (a % c); d.length < this.options.decimals; ) d = "0" + d;
  this.input.value =
    b + (a - (a % c)) / c + (0 < this.options.decimals ? "." + d : "");
  if ("dispatchEvent" in this.input) {
    try {
      var e = new Event("change", { bubbles: !0, cancelable: !0 });
    } catch (f) {
      (e = document.createEvent("Event")), e.initEvent("change", !0, !0);
    }
    this.input.dispatchEvent(e);
  }
};
SpinBox.prototype.addEventListener = function (a, b, c, d, e) {
  function f(a) {
    a || (a = window.event);
    c.apply(g, [a].concat(d));
    e || (a.preventDefault ? a.preventDefault() : (a.returnValue = !1));
  }
  var g = this;
  a.addEventListener
    ? a.addEventListener(b, f, !1)
    : a.attachEvent("on" + b, f);
};
SpinBox.prototype.handleMouseWheel = function (a) {
  document.activeElement == this.input &&
    (a.wheelDelta
      ? this.start(a, 1 < a.wheelDelta)
      : a.detail && this.start(a, 1 > a.detail),
    this.stop(),
    a.preventDefault ? a.preventDefault() : (a.returnValue = !1));
};
SpinBox.prototype.handleKeyDown = function (a) {
  38 == a.keyCode && this.start(a, !0);
  40 == a.keyCode && this.start(a, !1);
};
SpinBox.prototype.handleKeyPress = function (a) {
  var b = "charCode" in a ? a.charCode : a.keyCode;
  0 == b ||
    a.altKey ||
    a.ctrlKey ||
    a.metaKey ||
    (45 == b && (!("minimum" in this.options) || 0 > this.options.minimum)) ||
    (46 == b && 0 < this.options.decimals) ||
    (48 <= b && 57 >= b) ||
    (a.preventDefault ? a.preventDefault() : (a.returnValue = !1));
};
SpinBox.prototype.start = function (a, b) {
  this.input.disabled ||
    "timeout" in this ||
    ((this.updateStep = b ? this.options.step : -this.options.step),
    (this.timeoutDelay = 500),
    this.update());
};
SpinBox.prototype.stop = function () {
  "timeout" in this && (window.clearTimeout(this.timeout), delete this.timeout);
};
SpinBox.prototype.update = function () {
  var a = parseFloat(this.input.value);
  isNaN(a) && (a = 0);
  this.setValue(a + this.updateStep);
  this.timeoutDelay = Math.max(20, Math.floor(0.9 * this.timeoutDelay));
  var b = this;
  this.timeout = window.setTimeout(function () {
    b.update();
  }, this.timeoutDelay);
};
