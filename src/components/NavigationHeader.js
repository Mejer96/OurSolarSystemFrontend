import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NavigationHeader = ({ authenticated, setAuthenticated }) => {
  const [hoverIndex, setHoverIndex] = useState(null);
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate('/login'); 
  };

  const handleSignOut = () => {
    setAuthenticated(false)
    navigate('/login'); 
  };

  return (
    <header style={navHeadStyles.header} id='header'>
      <div style={navHeadStyles.logo}>Our Solar System</div>
      <nav style={navHeadStyles.nav}>
        {/* Conditionally render Sign In/Sign Out button */}
        {authenticated ? (
          <button
            style={hoverIndex === 0 ? { ...navHeadStyles.button, ...navHeadStyles.buttonHover } : navHeadStyles.button}
            id='sign-out'
            onMouseEnter={() => setHoverIndex(0)}
            onMouseLeave={() => setHoverIndex(null)}
            onClick={handleSignOut}
          >
            Sign Out
          </button>
        ) : (
          <button
            style={hoverIndex === 0 ? { ...navHeadStyles.button, ...navHeadStyles.buttonHover } : navHeadStyles.button}
            id='sign-in'
            onMouseEnter={() => setHoverIndex(0)}
            onMouseLeave={() => setHoverIndex(null)}
            onClick={handleSignIn}
          >
            Sign In
          </button>
        )}
      </nav>
    </header>
  );
};



  const navHeadStyles = {
    header: {
      position: 'fixed',
      top: 0,
      width: '100%',
      height: '60px',
      backgroundColor: 'black',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 20px',
      zIndex: 1000,
      boxShadow: '0 4px 10px rgba(255, 255, 255, 0.2)',
    },
    logo: {
      fontSize: '1.5rem',
      color: '#ffffff',
      fontWeight: 'bold',
      textShadow: '0 0 10px #ffffff, 0 0 20px #ffffff, 0 0 30px #ffffff',
      cursor: 'pointer',
    },
    nav: {
      position: 'absolute',
      right: '20px',
      display: 'flex',
      gap: '15px',
    },
    navLink: {
      color: '#ffffff',
      textDecoration: 'none',
      fontSize: '1rem',
      fontWeight: '500',
      padding: '10px 15px',
      borderRadius: '5px',
      transition: 'background-color 0.3s, color 0.3s, text-shadow 0.3s',
      textShadow: '0 0 5px #ffffff',
    },
    navLinkHover: {
      backgroundColor: '#0fefef',
      color: '#000',
      textShadow: '0 0 15px #ffffff, 0 0 30px #ffffff',
    },
  };

  export default NavigationHeader;


