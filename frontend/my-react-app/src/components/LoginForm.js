import React, { useState } from 'react';
import Axios from "axios";
import io from 'socket.io-client';
import './LoginForm.css';




const LoginForm = ({ loginStatus }) => {
  const [username, setUsername] = useState('');
  const [room,setRoom] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (username !== "" && password !== "" && room !=="") {
      Axios.post("http://localhost:5500/login", {
        username: username,
        password: password,
      }).then((response) => {
        console.log(response)
        if (response.data.message) {
          alert(response.data.message);
        } else {
          sessionStorage.setItem('username', username);
          sessionStorage.setItem('isLoggedIn', true);
          const socket = io.connect("http://localhost:5500");
          loginStatus(true,username,socket,room);
        }
      });

    }
    else{
      alert("Please Enter Username and Password...")
    }
  };

  return (
    <div className="login-form-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="username">Room Id:</label>
          <input
            type="text"
            id="room"
            placeholder="type something"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginForm;
