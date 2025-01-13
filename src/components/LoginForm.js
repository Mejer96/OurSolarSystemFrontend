import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const loginFormStyles = {
  container: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '300px',
    backgroundColor: 'black',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 4px 15px rgba(255, 255, 255, 0.3)',
    textAlign: 'center',
  },
  title: {
    fontSize: '1.8rem',
    color: '#ffffff',
    marginBottom: '20px',
    textShadow: '0 0 10px #ffffff, 0 0 20px #ffffff',
  },
  input: {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '5px',
    border: 'none',
    outline: 'none',
    fontSize: '1rem',
    color: '#000',
  },
  button: {
    width: '100%',
    padding: '10px',
    margin: '20px 0',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#ffffff',  
    color: '#000000',  
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s, box-shadow 0.3s',
    boxShadow: '0 0 5px #ffffff, 0 0 10px #ffffff',
  },
  buttonHover: {
    backgroundColor: '#f1f1f1',  
    boxShadow: '0 0 20px #ffffff, 0 0 40px #ffffff',
  },
  link: {
    color: '#ffffff',
    textDecoration: 'none',
    fontSize: '0.9rem',
    textShadow: '0 0 5px #ffffff',
  },
};


const LoginForm = ({setAuthenticated}) => {
  const [hover, setHover] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Event handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    const data = { username, password };

    try {
      const response = await fetch('http://localhost:5259/mysql/api/user/authenticate-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log('User authenticated');
        setAuthenticated(true)
        navigate('/');
      } else {
   
        console.log('Authentication failed');
        setAuthenticated(false)
      }
    } catch (error) {
      console.error('Error during authentication:', error);
    }
  };

  return (
    <div style={loginFormStyles.container}>
      <h1 style={loginFormStyles.title}>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          id='username-input'
          style={loginFormStyles.input}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          id='password-input'
          style={loginFormStyles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          id='submit-login'
          style={hover ? { ...loginFormStyles.button, ...loginFormStyles.buttonHover } : loginFormStyles.button}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          Login
        </button>
      </form>
      <a href="#" style={loginFormStyles.link}>
        Forgot your password?
      </a>
    </div>
  );
};

export default LoginForm;
