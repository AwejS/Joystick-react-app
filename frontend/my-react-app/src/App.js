import LoginForm from './components/LoginForm';
import Joystick from './components/Joystick';
import Logout from './components/Logout.js';
import './App.css';   
import { useState,useEffect} from 'react';
// const socket = io.connect("http://localhost:5000");

const App = () => {
  const [socket,setSocket] = useState();
  const [login, setLogin] = useState(false);
  const [user,setUser] = useState("");
  const [room, setRoom] = useState("");
  const handleJoystickMove = (position) => {
    console.log('Joystick position:', position);
  };
  const loginStatus=(value,username,socket,room)=>{
    setLogin(value);
    setUser(username);
    setSocket(socket);
    setRoom(room);
  };

  useEffect(() => {
    const storedUsername = sessionStorage.getItem('username');
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');

    if (isLoggedIn && storedUsername) {
      setLogin(true);
      setUser(storedUsername);

    }
  }, []);

  return (
    <div>
    <div className='App'>
      <h1>Joystick React App</h1>
      {login && <Logout user={user}/>}
    </div>
      {!login && <LoginForm loginStatus={loginStatus} />}
      {login &&
      <div className="center-div">
     <Joystick  onMove={handleJoystickMove} socket={socket} username={user} room={room} />
      </div>}
    </div>
  );
};

export default App;
