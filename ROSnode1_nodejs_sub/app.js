const rclnodejs = require('rclnodejs');

// Initialize rclnodejs
rclnodejs.init().then(() => {
  console.log('ROS 2 node initialized');

  const node = new rclnodejs.Node('subscriber_node');

  const subscription = node.createSubscription(
    'std_msgs/msg/String',
    'joystick_data',
    (msg) => {
      console.log('Received message:', msg.data);
    }
  );

  rclnodejs.spin(node);

  // Clean up when the process is terminated
  process.on('SIGINT', () => {
    console.log('Shutting down...');
    subscription.dispose();
    node.dispose();
    process.exit(0);
  });
}).catch((error) => {
  console.error('Failed to initialize ROS 2 node', error);
});
