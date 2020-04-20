var q0, q1, q2, q3, q4, q5, q6;
var qd0, qd1, qd2, qd3, qd4, qd5, qd6;
var qp0, qp1, qp2, qp3, qp4, qp5, qp6;
var play_traj_ = false;
var tune_gains_ = false;
var move_signal_ = false;
var counter = 0;
var joint_state_stamp = 0;
old_joint_state_stamp = -1;
var triggered = false;
var fake_distance_ = false;

var ros = new ROSLIB.Ros({
  url: "ws://localhost:9090",
});

ros.on("connection", function () {
  console.log("Connected to websocket server.");
});

ros.on("error", function (error) {
  console.log("Error connecting to websocket server: ", error);
});

ros.on("close", function () {
  console.log("Connection to websocket server closed.");
});

// Subscribing to a Topic
// ----------------------

var panda_data_listener = new ROSLIB.Topic({
  ros: ros,
  name: "/velocity_qp/panda_rundata",
  messageType: "velocity_qp/PandaRunMsg",
  queue_size: 1,
  throttle_rate: 1000,
});

panda_data_listener.subscribe(function (message) {
  if (message.play_traj_) {
    play_traj_ = true;
    document.getElementById("play_traj_button_").style.background = "green";
    document.getElementById("play_traj_button_").value = "Pause";
  } else {
    play_traj_ = false;
    document.getElementById("play_traj_button_").style.background =
      "rgb(255, 255, 255)";
    document.getElementById("play_traj_button_").value = "Play";
  }

  if (message.tune_gains_) {
    tune_gains_ = true;
    document.getElementById("tune_gain_button_").style.background = "green";
  } else {
    tune_gains_ = false;
    document.getElementById("tune_gain_button_").style.background =
      "rgb(255, 255, 255)";
  }
});

ros.getServices(function (services) {
  console.log(services);
});

var refreshTopicsList = () => {
  ros.getTopics(function (topics) {
    var topicsList = $("#topicsList");
    topicsList.empty();
    for (i = 0; i < topics.topics.length; i++) {
      var opt = topics.topics[i];
      var val = topics.types[i];
      var el = document.createElement("option");
      el.textContent = opt;
      el.value = val;
      topicsList.appendChild(el);
    }
    console.log(topics);
  });
};
$(document).ready(function () {
  $("select#topicsList").change(function () {
    selectedTopic(this);
  });

  $("button.add").click(function () {
    addTopicIndicator();
  });
});

var selectedTopic = (el) => {
  if (el == undefined) {
    el = $("select#topicsList");
  }
  var selectedType = $(el).children("option:selected").val();
  var selectedTop = $(el).children("option:selected").text();
  alert(
    "You have selected - " + selectedTop + " - of msg type - " + selectedType
  );
};

var addTopicIndicator = () => {
  let nbSliders = $("[class~=\\/joint_states]").length;
  var newSlider = new Slider("/joint_states", -2.89, 2.89, true, nbSliders);
  $("div.result").append(newSlider.Render);
};
var joint_state_listener = new ROSLIB.Topic({
  ros: ros,
  name: "/joint_states",
  messageType: "sensor_msgs/JointState",
  queue_size: 1,
  throttle_rate: 100,
});

joint_state_listener.subscribe(function (message) {
  joint_state_stamp = message.header.stamp.secs;
  $("[class~=\\/joint_states]").each(function (index) {
    console.log(index + ": " + $(this).attr("Number"));
    let number = $(this).attr("Number");
    q = message.position[number];
    $(".\\/joint_states").val() = q;
    $("#qd0_value").val() = q.toFixed(2);
  });
});

var updateUIClient = new ROSLIB.Service({
  ros: ros,
  name: "/velocity_qp/updateUI",
  serviceType: "velocity_qp/UI",
});

var request = new ROSLIB.ServiceRequest({
  play_traj: false,
  jog_robot: false,
  publish_traj: false,
  build_traj: false,
  p_gains_: {
    linear: { x: 10, y: 10, z: 10 },
    angular: { x: 10, y: 10, z: 10 },
  },
  d_gains_: { linear: { x: 0, y: 0, z: 0 }, angular: { x: 0, y: 0, z: 0 } },
  move_signal_: false,
  tune_gain: false,
  amplitude: 0.01,
  axis: 0,
  exit_: false,
});

function buildTraj() {
  var new_request = request;
  new_request.build_traj = true;
  updateUIClient.callService(new_request, function (result) {});
  new_request.build_traj = false;
  request = new_request;
}

function publishTraj() {
  var new_request = request;
  new_request.publish_traj = true;
  updateUIClient.callService(new_request, function (result) {});
  new_request.publish_traj = false;
  request = new_request;
}

function emergencyStop() {
  var new_request = request;
  new_request.exit_ = true;
  updateUIClient.callService(new_request, function (result) {});
  request = new_request;
}

function playTraj() {
  var new_request = request;
  if (!play_traj_) {
    new_request.play_traj = true;
    play_traj_ = !play_traj_;
    document.getElementById("play_traj_button_").style.background = "green";
    document.getElementById("play_traj_button_").value = "Pause";
  } else {
    new_request.play_traj = false;
    play_traj_ = !play_traj_;
    document.getElementById("play_traj_button_").style.background =
      "rgb(255, 255, 255)";
    document.getElementById("play_traj_button_").value = "Play";
  }
  updateUIClient.callService(new_request, function (result) {});
  request = new_request;
}
