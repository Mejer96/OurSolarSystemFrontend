import React, { useState } from 'react';

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
    backgroundColor: '#0fefef',
    color: '#000',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s, box-shadow 0.3s',
    boxShadow: '0 0 5px #ffffff, 0 0 10px #ffffff',
  },
  buttonHover: {
    backgroundColor: '#0bc0c0',
    boxShadow: '0 0 20px #ffffff, 0 0 40px #ffffff',
  },
  link: {
    color: '#0fefef',
    textDecoration: 'none',
    fontSize: '0.9rem',
    textShadow: '0 0 5px #ffffff',
  },
};

const LoginForm = () => {
  const [hover, setHover] = useState(false);

  return (
    <div style={loginFormStyles.container}>
      <h1 style={loginFormStyles.title}>Login</h1>
      <input type="text" placeholder="Username" style={loginFormStyles.input} />
      <input type="password" placeholder="Password" style={loginFormStyles.input} />
      <button
        style={hover ? { ...loginFormStyles.button, ...loginFormStyles.buttonHover } : loginFormStyles.button}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        Login
      </button>
      <a href="#" style={loginFormStyles.link}>
        Forgot your password?
      </a>
    </div>
  );
};

export default LoginForm;
