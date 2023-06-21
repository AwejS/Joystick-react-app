import rclpy

from std_msgs.msg import String

def callback(msg):
    print(f"Received message: {msg.data}")

def main(args=None):
    rclpy.init(args=args)

    node = rclpy.create_node("python_subscriber_node")

    subscription = node.create_subscription(
    String,
    "joystick_data",
    callback,
    qos_profile=rclpy.qos.qos_profile_system_default
)

    node.get_logger().info("Python subscriber node started.")

    rclpy.spin(node)

    subscription.destroy()
    node.destroy_node()
    rclpy.shutdown()


if __name__ == "__main__":
    main()
