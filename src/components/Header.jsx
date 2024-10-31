// Header.jsx
import './Header.css';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();


    const handleProfileClick = () => {
        navigate('/profile');
    };

    const handleMainClick = () => {
        navigate('/');
    };

    return (
        <header className="headerStyle">
            <div onClick={handleMainClick} style={{ cursor: 'pointer' }}>
                <h1>Marvel Library</h1>
            </div>

            <div onClick={handleProfileClick} style={{ cursor: 'pointer', position: 'relative' }}>
                <img src="/img/profile-icon.png" alt="Profile" style={{ width: '30px', height: '30px' }} />
                
            </div>
        </header>
    );
};

export default Header;