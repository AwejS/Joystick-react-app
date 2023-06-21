import './logout.css';


const Logout = ({ user }) => {
    const handleLogout = (e) => {
        // Clear the session storage  
        sessionStorage.removeItem('isLoggedIn');
        sessionStorage.removeItem('username');
        window.location.reload();
    };
    return (
        <div> <h2>Hello, {user}..!</h2>
            <button onClick={handleLogout} style={{ backgroundColor: '#e90000', marginBottom: '30px' }} className="logout-btn" type="submit">Logout</button>
            <h4>*Please take the cursor on circle and drag it to operate the joystick</h4>

        </div>
    )
}
export default Logout;