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

ros.getServices(function (services) {
  console.log(services);
});

var refreshTopicsList = () => {
  ros.getTopics(function (topics) {
    var topicsList = document.getElementById("topicsList");
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

$("#topicsList").change(selectedTopic);

var selectedTopic = () => {
  console.log("hello");
  document.getElementById("topicsList").selectedOptions[0].value;
  console.log($("#topicsList").value);
  console.log($("#topicsList").textContent);
};
