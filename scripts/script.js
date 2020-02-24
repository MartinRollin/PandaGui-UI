// Connecting to ROS
  // -----------------
  var q0,q1,q2,q3,q4,q5,q6;
  var qd0,qd1,qd2,qd3,qd4,qd5,qd6;
  var qp0,qp1,qp2,qp3,qp4,qp5,qp6;
  var play_traj_ = false;
  var tune_gains_ = false;
  var move_signal_ = false;
  var counter = 0;
  var joint_state_stamp = 0;
  old_joint_state_stamp = -1;
  var triggered = false;
  var fake_distance_ = false;

  var ros = new ROSLIB.Ros({
 url : 'ws://localhost:9090'
  });

  ros.on('connection', function() {
    console.log('Connected to websocket server.');
  });

  ros.on('error', function(error) {
    console.log('Error connecting to websocket server: ', error);
  });

  ros.on('close', function() {
    console.log('Connection to websocket server closed.');
  });
  

  // Subscribing to a Topic
  // ----------------------

  var panda_data_listener = new ROSLIB.Topic({
    ros : ros,
    name : '/velocity_qp/panda_rundata',
    messageType : 'velocity_qp/PandaRunMsg',
    queue_size : 1,
    throttle_rate : 1000
  });


  panda_data_listener.subscribe(function(message) {
    if (message.play_traj_)
    {
      play_traj_ = true;
      document.getElementById("play_traj_button_").style.background='green';
      document.getElementById("play_traj_button_").value = "Pause";
    }
    else
    {
      play_traj_ = false;
      document.getElementById("play_traj_button_").style.background="rgb(255, 255, 255)";
      document.getElementById("play_traj_button_").value = "Play";
    }

    if (message.tune_gains_)
    {
      tune_gains_ = true;
      document.getElementById("tune_gain_button_").style.background='green';
    }
    else
    {
      tune_gains_ = false;
      document.getElementById("tune_gain_button_").style.background="rgb(255, 255, 255)";
    }

  });

  var joint_state_listener = new ROSLIB.Topic({
    ros : ros,
    name : '/joint_states',
    messageType : 'sensor_msgs/JointState',
    queue_size : 1,
    throttle_rate : 100
  });

  joint_state_listener.subscribe(function(message) {

    joint_state_stamp = message.header.stamp.secs;
    
    q0 = message.position[0];
    q1 = message.position[1];
    q2 = message.position[2];
    q3 = message.position[3];
    q4 = message.position[4];
    q5 = message.position[5];
    q6 = message.position[6];

    qd0 = message.velocity[0];
    qd1 = message.velocity[1];
    qd2 = message.velocity[2];
    qd3 = message.velocity[3];
    qd4 = message.velocity[4];
    qd5 = message.velocity[5];
    qd6 = message.velocity[6];

    document.getElementById("qd0_slider").value =  qd0; 
    document.getElementById("qd0_value").value =  qd0.toFixed(2); 
    document.getElementById("qd1_slider").value =  qd1; 
    document.getElementById("qd1_value").value =  qd1.toFixed(2);
    document.getElementById("qd2_slider").value =  qd2; 
    document.getElementById("qd2_value").value =  qd2.toFixed(2);
    document.getElementById("qd3_slider").value =  qd3; 
    document.getElementById("qd3_value").value =  qd3.toFixed(2);
    document.getElementById("qd4_slider").value =  qd4; 
    document.getElementById("qd4_value").value =  qd4.toFixed(2);
    document.getElementById("qd5_slider").value =  qd5; 
    document.getElementById("qd5_value").value =  qd5.toFixed(2);
    document.getElementById("qd6_slider").value =  qd6; 
    document.getElementById("qd6_value").value =  qd6.toFixed(2);

    document.getElementById("q0_slider").value =  q0;  
    document.getElementById("q0_value").value =  q0.toFixed(2); 
    document.getElementById("q1_slider").value =  q1; 
    document.getElementById("q1_value").value =  q1.toFixed(2);
    document.getElementById("q2_slider").value =  q2;
    document.getElementById("q2_value").value =  q2.toFixed(2);
    document.getElementById("q3_slider").value =  q3;
    document.getElementById("q3_value").value =  q3.toFixed(2);
    document.getElementById("q4_slider").value =  q4;
    document.getElementById("q4_value").value =  q4.toFixed(2);
    document.getElementById("q5_slider").value =  q5;
    document.getElementById("q5_value").value =  q5.toFixed(2);
    document.getElementById("q6_slider").value =  q6;
    document.getElementById("q6_value").value =  q6.toFixed(2);
  });

// faire en sorte d'empêcher la déconnexion

  function watchdog()
  {  
    if (joint_state_stamp == old_joint_state_stamp )
    {
      triggered = true;
      document.getElementById("connection_state").style.color="red";
      document.getElementById("connection_state").value = "Not connected";
    }
    else
    {
      document.getElementById("connection_state").style.color="green";
      document.getElementById("connection_state").value = "Connected";
    }
    if (triggered && joint_state_stamp != old_joint_state_stamp)
    {
      document.location.reload(true);
      triggered = false;
    }
    old_joint_state_stamp = joint_state_stamp;
  }

  var qp_state_listener = new ROSLIB.Topic({
    ros : ros,
    name : '/velocity_qp/qp_state',
    messageType : 'velocity_qp/qpMsg',
    queue_size : 1,
    throttle_rate : 100
  });

  function Activate_Button(button_id,state)
  {
    if (state == 1)
      document.getElementById(button_id).style.background='red';
    if (state == 0)
      document.getElementById(button_id).style.background='rgb(255, 255, 255)';
  }

  qp_state_listener.subscribe(function(message) {
    qp0 = message.joint_command_.effort[0];
    qp1 = message.joint_command_.effort[1];
    qp2 = message.joint_command_.effort[2];
    qp3 = message.joint_command_.effort[3];
    qp4 = message.joint_command_.effort[4];
    qp5 = message.joint_command_.effort[5];
    qp6 = message.joint_command_.effort[6];

    document.getElementById("qp0_slider").value =  qp0;  
    document.getElementById("qp0_value").value =  qp0.toFixed(2); 
    document.getElementById("qp1_slider").value =  qp1; 
    document.getElementById("qp1_value").value =  qp1.toFixed(2);
    document.getElementById("qp2_slider").value =  qp2;
    document.getElementById("qp2_value").value =  qp2.toFixed(2);
    document.getElementById("qp3_slider").value =  qp3;
    document.getElementById("qp3_value").value =  qp3.toFixed(2);
    document.getElementById("qp4_slider").value =  qp4;
    document.getElementById("qp4_value").value =  qp4.toFixed(2);
    document.getElementById("qp5_slider").value =  qp5;
    document.getElementById("qp5_value").value =  qp5.toFixed(2);
    document.getElementById("qp6_slider").value =  qp6;
    document.getElementById("qp6_value").value =  qp6.toFixed(2);

    Activate_Button("bound0",message.activated_bound.data[0])
    Activate_Button("bound1",message.activated_bound.data[1])
    Activate_Button("bound2",message.activated_bound.data[2])
    Activate_Button("bound3",message.activated_bound.data[3])
    Activate_Button("bound4",message.activated_bound.data[4])
    Activate_Button("bound5",message.activated_bound.data[5])
    Activate_Button("bound6",message.activated_bound.data[6])

    Activate_Button("constraint0",message.activated_cons.data[0])
    Activate_Button("constraint1",message.activated_cons.data[1])
    Activate_Button("constraint2",message.activated_cons.data[2])
    Activate_Button("constraint3",message.activated_cons.data[3])
    Activate_Button("constraint4",message.activated_cons.data[4])
    Activate_Button("constraint5",message.activated_cons.data[5])
    Activate_Button("constraint6",message.activated_cons.data[6])

  });

  function ToEulerAngles(qw,qx,qy,qz)
  {
    var roll,pitch,yaw;
    // roll (x-axis rotation)
    var sinr_cosp = 2 * (qw * qx + qy * qz);
    var cosr_cosp = 1 - 2 * (qx * qx + qy * qy);
    roll = Math.atan2(sinr_cosp, cosr_cosp);

    // pitch (y-axis rotation)
    var sinp = 2 * (qw * qy - qz * qx);
    if (Math.abs(sinp) >= 1)
      pitch = copysign(3.14159 / 2, sinp);  // use 90 degrees if out of range
    else
      pitch = Math.asin(sinp);

    // yaw (z-axis rotation)
    var siny_cosp = 2 * (qw * qz + qx * qy);
    var cosy_cosp = 1 - 2 * (qy * qy + qz * qz);
    yaw = Math.atan2(siny_cosp, cosy_cosp);

    var euler = [roll,pitch,yaw];
    return euler
  }

  var robot_state_listener = new ROSLIB.Topic({
    ros : ros,
    name : '/velocity_qp/X_curr',
    messageType : 'geometry_msgs/PoseStamped',
    queue_size : 1,
    throttle_rate : 100
  });
  
  robot_state_listener.subscribe(function(message) {
    document.getElementById("pos_x").innerHTML =  message.pose.position.x.toFixed(3) ; 
    document.getElementById("pos_y").innerHTML =  message.pose.position.y.toFixed(3); 
    document.getElementById("pos_z").innerHTML =  message.pose.position.z.toFixed(3); 

    var euler = ToEulerAngles(
        message.pose.orientation.w,
        message.pose.orientation.x,
        message.pose.orientation.y,
        message.pose.orientation.z);
      

    document.getElementById("ang_x").innerHTML =  euler[0].toFixed(3); 
    document.getElementById("ang_y").innerHTML =  euler[1].toFixed(3); 
    document.getElementById("ang_z").innerHTML =  euler[2].toFixed(3); 

  });

  // Calling a service
  // -----------------

  var updateUIClient = new ROSLIB.Service({
    ros : ros,
    name : '/velocity_qp/updateUI',
    serviceType : 'velocity_qp/UI'
  });

  var request = new ROSLIB.ServiceRequest({
    play_traj:false,
    jog_robot:false,
    publish_traj :false,
    build_traj:false,
    p_gains_ : {linear : {x : 10 , y : 10 , z : 10} , angular : {x : 10 , y : 10 , z : 10}},
    d_gains_ : {linear : {x : 0 , y : 0 , z : 0} , angular : {x : 0 , y : 0 , z : 0}},
    move_signal_ : false,
    tune_gain : false,
    amplitude : 0.01,
    axis : 0,
    exit_: false
  });

  function buildTraj()
  {
    var new_request = request;
    new_request.build_traj = true;
    updateUIClient.callService(new_request,function(result) {});
    new_request.build_traj = false;
    request = new_request;
  }

  function publishTraj()
  {
    var new_request = request;
    new_request.publish_traj = true;
    updateUIClient.callService(new_request,function(result) {});
    new_request.publish_traj = false;
    request = new_request;
  }

  function emergencyStop()
  {
    var new_request = request;
    new_request.exit_ = true;
    updateUIClient.callService(new_request,function(result) {});
    request = new_request;
  }

  function playTraj()
  {
    var new_request = request;
    if (!play_traj_)
    {
      new_request.play_traj = true;
      play_traj_ = !play_traj_;
      document.getElementById("play_traj_button_").style.background="green";
      document.getElementById("play_traj_button_").value = "Pause";
    }
    else
    {
      new_request.play_traj = false;
      play_traj_ = !play_traj_;
      document.getElementById("play_traj_button_").style.background="rgb(255, 255, 255)";
      document.getElementById("play_traj_button_").value = "Play";
    }
    updateUIClient.callService(new_request,function(result) {});
    request = new_request;
  }

  function fakeDistance()
  {
    var new_request = request;
    if (!fake_distance_)
    {
      new_request.fake_distance_ = true;
      fake_distance_ = !fake_distance_;
      document.getElementById("fake_distance_button_").style.background="green";
    }
    else
    {
      new_request.fake_distance_ = false;
      fake_distance_ = !fake_distance_;
      document.getElementById("fake_distance_button_").style.background="rgb(255, 255, 255)";
    }
    updateUIClient.callService(new_request,function(result) {});
    request = new_request;
  }

  function changeTrajectory()
  {
    var value = document.getElementById("trajectory_csv").value;
    console.log(value);
  }

  function tuneGain()
  {
    var new_request = request;
    if (!tune_gains_)
    {
      new_request.tune_gain = true;
      tune_gains_ = !tune_gains_;
      document.getElementById("tune_gain_button_").style.background="green";
    }
    else
    {
      new_request.tune_gain = false;
      tune_gains_ = !tune_gains_;
      document.getElementById("tune_gain_button_").style.background="";
    }
    updateUIClient.callService(new_request,function(result) {});
    request = new_request;
  }

  function moveSignal()
  {
    var new_request = request;
    new_request.move_signal_ = true;
    updateUIClient.callService(new_request,function(result) {});
    new_request.move_signal_ = false;
    request = new_request;
  }

  function changeAxis()
  {
    var new_request = request;
    var radios = document.getElementsByName('AxisForm');
    for (var i = 0, length = radios.length; i < length; i++)
    {
    if (radios[i].checked)
    {
      new_request.axis = i;
      updateUIClient.callService(new_request,function(result) {});
      request = new_request;
    }
    }
  }

  function distToContact()
  {
    var new_request = request;
    var distance_to_contact_ = document.getElementById("distance_to_contact_slider").value;
    new_request.distance_to_contact_ = parseFloat(distance_to_contact_);
    updateUIClient.callService(new_request,function(result) {});
    request = new_request;
    document.getElementById("distance_to_contact_value").value = distance_to_contact_;
  }

  function stepAmplitude(event)
  {
    var new_request = request;
    new_request.amplitude = parseFloat(event.target.value);
    updateUIClient.callService(new_request,function(result) {});
    request = new_request;
  }

  function changeptx(event)
  {
    var new_request = request;
    new_request.p_gains_.linear.x = parseFloat(event.target.value);
    updateUIClient.callService(new_request,function(result) {});
    request = new_request;
  }
  function changepty(event)
  {
    var new_request = request;
    new_request.p_gains_.linear.y = parseFloat(event.target.value);
    updateUIClient.callService(new_request,function(result) {});
    request = new_request;
  }
  function changeptz(event)
  {
    var new_request = request;
    new_request.p_gains_.linear.z = parseFloat(event.target.value);
    updateUIClient.callService(new_request,function(result) {});
    request = new_request;
  }
  function changeprx(event)
  {
    var new_request = request;
    new_request.p_gains_.angular.x = parseFloat(event.target.value);
    updateUIClient.callService(new_request,function(result) {});
    request = new_request;
  }
  function changepry(event)
  {
    var new_request = request;
    new_request.p_gains_.angular.y = parseFloat(event.target.value);
    updateUIClient.callService(new_request,function(result) {});
    request = new_request;
  }
  function changeprz(event)
  {
    var new_request = request;
    new_request.p_gains_.angular.z = parseFloat(event.target.value);
    updateUIClient.callService(new_request,function(result) {});
    request = new_request;
  }

  function changedtx(event)
  {
    var new_request = request;
    new_request.d_gains_.linear.x = parseFloat(event.target.value);
    updateUIClient.callService(new_request,function(result) {});
    request = new_request;
  }
  function changedty(event)
  {
    var new_request = request;
    new_request.d_gains_.linear.y = parseFloat(event.target.value);
    updateUIClient.callService(new_request,function(result) {});
    request = new_request;
  }
  function changedtz(event)
  {
    var new_request = request;
    new_request.d_gains_.linear.z = parseFloat(event.target.value);
    updateUIClient.callService(new_request,function(result) {});
    request = new_request;
  }
  function changedrx(event)
  {
    var new_request = request;
    new_request.d_gains_.angular.x = parseFloat(event.target.value);
    updateUIClient.callService(new_request,function(result) {});
    request = new_request;
  }
  function changedry(event)
  {
    var new_request = request;
    new_request.d_gains_.angular.y = parseFloat(event.target.value);
    updateUIClient.callService(new_request,function(result) {});
    request = new_request;
  }
  function changedrz(event)
  {
    var new_request = request;
    new_request.d_gains_.angular.z = parseFloat(event.target.value);
    updateUIClient.callService(new_request,function(result) {});
    request = new_request;
  }
  

  // ros.getParams(function(params) {
  //   console.log(params);
  // });

  // var maxVelX = new ROSLIB.Param({
  //   ros : ros,
  //   name : "max_vel_y'
  // });

  var getRootLink_ = new ROSLIB.Param({
    ros : ros,
    name : "/velocity_qp/root_link_"
  });

  getRootLink_.get(function(value) {
    document.getElementById("root_link").value = value
  });

  var getTipLink = new ROSLIB.Param({
    ros : ros,
    name : "/velocity_qp/tip_link_"
  });

  getTipLink.get(function(value) {
    document.getElementById("tip_link").value = value
  });


  var getPGains = new ROSLIB.Param({
    ros : ros,
    name : "/velocity_qp/p_gains_"
  });

  getPGains.get(function(value) {
    document.getElementById("ptx").value = value[0]
    document.getElementById("pty").value = value[1]
    document.getElementById("ptz").value = value[2]
    document.getElementById("prx").value = value[3]
    document.getElementById("pry").value = value[4]
    document.getElementById("prz").value = value[5]
  });
  
  var getDGains = new ROSLIB.Param({
    ros : ros,
    name : "/velocity_qp/d_gains_"
  });

  getDGains.get(function(value) {
    document.getElementById("dtx").value = value[0]
    document.getElementById("dty").value = value[1]
    document.getElementById("dtz").value = value[2]
    document.getElementById("drx").value = value[3]
    document.getElementById("dry").value = value[4]
    document.getElementById("drz").value = value[5]
  });

  
  var getTauLim = new ROSLIB.Param({
    ros : ros,
    name : "/velocity_qp/qd_max_"
  });

  getTauLim.get(function(value) {
    document.getElementById("qp0_min_value").value = -value[0]
    document.getElementById("qp0_slider").min = -value[0]
    document.getElementById("qp1_min_value").value = -value[1]
    document.getElementById("qp1_slider").min = -value[1]
    document.getElementById("qp2_min_value").value = -value[2]
    document.getElementById("qp2_slider").min = -value[2]
    document.getElementById("qp3_min_value").value = -value[3]
    document.getElementById("qp3_slider").min = -value[3]
    document.getElementById("qp4_min_value").value = -value[4]
    document.getElementById("qp4_slider").min = -value[4]
    document.getElementById("qp5_min_value").value = -value[5]
    document.getElementById("qp5_slider").min = -value[5]
    document.getElementById("qp6_min_value").value = -value[6]
    document.getElementById("qp6_slider").min = -value[6]

    document.getElementById("qp0_max_value").value = value[0]
    document.getElementById("qp0_slider").max = value[0]
    document.getElementById("qp1_max_value").value = value[1]
    document.getElementById("qp1_slider").max = value[1]
    document.getElementById("qp2_max_value").value = value[2]
    document.getElementById("qp2_slider").max = value[2]
    document.getElementById("qp3_max_value").value = value[3]
    document.getElementById("qp3_slider").max = value[3]
    document.getElementById("qp4_max_value").value = value[4]
    document.getElementById("qp4_slider").max = value[4]
    document.getElementById("qp5_max_value").value = value[5]
    document.getElementById("qp5_slider").max = value[5]
    document.getElementById("qp6_max_value").value = value[6]
    document.getElementById("qp6_slider").max = value[6]
  });



  var getqdmin = new ROSLIB.Param({
    ros : ros,
    name : "/velocity_qp/qd_min_"
  });

  getqdmin.get(function(value) {
    document.getElementById("qd0_min_value").value = value[0]
    document.getElementById("qd0_slider").min = value[0]
    document.getElementById("qd1_min_value").value = value[1]
    document.getElementById("qd1_slider").min = value[1]
    document.getElementById("qd2_min_value").value = value[2]
    document.getElementById("qd2_slider").min = value[2]
    document.getElementById("qd3_min_value").value = value[3]
    document.getElementById("qd3_slider").min = value[3]
    document.getElementById("qd4_min_value").value = value[4]
    document.getElementById("qd4_slider").min = value[4]
    document.getElementById("qd5_min_value").value = value[5]
    document.getElementById("qd5_slider").min = value[5]
    document.getElementById("qd6_min_value").value = value[6]
    document.getElementById("qd6_slider").min = value[6]
  });

  var getqdmax = new ROSLIB.Param({
    ros : ros,
    name : "/velocity_qp/qd_max_"
  });

  function btnChrome_onclick() {
    document.documentElement.webkitRequestFullScreen();
  }
  function reload(){
    document.location.reload(true);
    document.documentElement.webkitRequestFullScreen();
  }
  
  getqdmax.get(function(value) {
    document.getElementById("qd0_max_value").value = value[0]
    document.getElementById("qd0_slider").max = value[0]
    document.getElementById("qd1_max_value").value = value[1]
    document.getElementById("qd1_slider").max = value[1]
    document.getElementById("qd2_max_value").value = value[2]
    document.getElementById("qd2_slider").max = value[2]
    document.getElementById("qd3_max_value").value = value[3]
    document.getElementById("qd3_slider").max = value[3]
    document.getElementById("qd4_max_value").value = value[4]
    document.getElementById("qd4_slider").max = value[4]
    document.getElementById("qd5_max_value").value = value[5]
    document.getElementById("qd5_slider").max = value[5]
    document.getElementById("qd6_max_value").value = value[6]
    document.getElementById("qd6_slider").max = value[6]
  });
