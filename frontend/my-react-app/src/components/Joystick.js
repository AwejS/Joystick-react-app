import React, { useState, useRef } from 'react';
import io from 'socket.io-client';
import './joystick.css'



const Joystick = ({ onMove , socket, username, room }) => {
    const [isMoving, setIsMoving] = useState(false);
    const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
    const joystickRef = useRef(null);
    const buttonRef = useRef(null);

    const handleMoveStart = () => {
        setIsMoving(true);
    };
    const sendMessage = async (position) => {
          const messageData = {
            room: room,
            author: username,
            message: position,
            time:
              new Date(Date.now()).getHours() +
              ":" +
              new Date(Date.now()).getMinutes(),
          };
    
          await socket.emit("send-message", messageData);
      };
    const handleMove = (event) => {
        if (isMoving) {
            const joystick = joystickRef.current;
            const joystickRect = joystick.getBoundingClientRect();
            const joystickCenterX = joystickRect.left + joystickRect.width / 2;
            const joystickCenterY = joystickRect.top + joystickRect.height / 2;
            const radius = joystickRect.width / 2;

            let { clientX, clientY } = event;

            const distance = Math.hypot(clientX - joystickCenterX, clientY - joystickCenterY);
            if (distance > radius) {
                const angle = Math.atan2(clientY - joystickCenterY, clientX - joystickCenterX);
                clientX = Math.cos(angle) * radius + joystickCenterX;
                clientY = Math.sin(angle) * radius + joystickCenterY;
            }

            const position = {
                x: Math.round(clientX - joystickCenterX),
                y: Math.round( clientY - joystickCenterY),
            };

            setButtonPosition(position);
            onMove(position);
            sendMessage(position);
        }
    };

    const handleMoveEnd = () => {
        setIsMoving(false);
        setButtonPosition({ x: 0, y: 0 });
        onMove({ x: 0, y: 0 });
    };

    return (<>
        <div class="joystick">
            <button class="up-btn"></button>
            <div class="horizontal-btns">
                <button class="left-btn"></button>
                <button class="right-btn"></button>
            </div>
            <button class="down-btn"></button>
        </div>


        <div
            style={{
                width: '150px',
                height: '150px',
                marginLeft :'100px',
                borderRadius: '50%',
                backgroundColor: '#ccc',
                position: 'relative',
                cursor: 'pointer',
            }}
            onMouseDown={handleMoveStart}
            onMouseMove={handleMove}
            onMouseUp={handleMoveEnd}
            onMouseLeave={handleMoveEnd}
            ref={joystickRef}
        >
            <div
                style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    backgroundColor: '#6c6c6c',
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: `translate(${buttonPosition.x}px, ${buttonPosition.y}px) translate(-50%, -50%)`,
                }}
                ref={buttonRef}
            />
        </div>
    </>);
};

export default Joystick;
