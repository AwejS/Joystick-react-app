const http = require("http");
const express = require("express");
const app = express();
const cors = require("cors");
const { Server } = require("socket.io");
const users = require('./users');
const rclnodejs = require('rclnodejs');

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    key: "userId",
    secret: "secretkey",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 60 * 60 * 24,
    },
  })
);

app.get("/login", (req, res) => {
  if (req.session.user) {
    res.send({ loggedIn: true, user: req.session.user });
  } else {
    res.send({ loggedIn: false });
  }
});
app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const User = users.find(user => user.username === username && user.password === password);

  if (User) {
    console.log(User);
    req.session.user = User;
    console.log(req.session.user);
    res.send(User);

  } else {
    console.log("wrong Username or password!");
    res.send({ message: "Invalid Username or password!" });
  }

});
// Create a server object
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT"]
  }
});
//create connection with client


// Initialize rclnodejs
rclnodejs.init().then(() => {
  console.log('ROS 2 node initialized');

  io.on('connection', (socket) => {
    console.log('User connected', socket.id);

    socket.on('join-room', (data) => {
      socket.join(data);
      console.log(`User ${socket.id} has joined room ${data}`);
    });

    socket.on('send-message', (data) => {
      console.log('Socket Msg Received from client:', data);

      const node = new rclnodejs.Node('NodeJS_publisher_node');
      const publisher = node.createPublisher('std_msgs/msg/String', 'joystick_data');
      publisher.publish(JSON.stringify(data));
      rclnodejs.spin(node);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected', socket.id);
    });
  });

}).catch((error) => {
  console.error('Failed to initialize ROS 2 node', error);
});


// Start the server on port 5500
server.listen(5500, () => {
  console.log(`Server is running on port 5500..`);
});
