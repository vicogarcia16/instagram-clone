import React, { useEffect, useState } from 'react';
import './App.css';
import Post from './Post';
import { makeStyles } from '@mui/styles';
import { Button, Modal, Input, Typography } from '@mui/material';
import ImageUpload from './ImageUpload';

const BASE_URL = process.env.REACT_APP_BASE_URL;

function getModalStyle() {
  const top = 50;
  const left = 50;
  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles(() => ({
  paper: {
    backgroundColor: '#ffffff',
    position: 'absolute',
    width: 290,
    border: '1px solid #lightgray',
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.12)',
    padding: '16px 32px 24px',
  },
}));

function App() {
  const classes = useStyles();
  const [posts, setPosts] = useState([]);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [openSignUp, setOpenSignUp] = useState(false);
  const [modalStyle, setModalStyle] = useState(getModalStyle);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authToken, setAuthToken] = useState(null);
  const [authTokenType, setAuthTokenType] = useState(null);
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [signInError, setSignInError] = useState('');
  const [signUpError, setSignUpError] = useState('');

  useEffect(() => {
    const token = window.localStorage.getItem('authToken');
    const tokenType = window.localStorage.getItem('authTokenType');
    const savedUsername = window.localStorage.getItem('username');
    const savedUserId = window.localStorage.getItem('userId');

    if (token && tokenType && savedUsername && savedUserId) {
      setAuthToken(token);
      setAuthTokenType(tokenType);
      setUsername(savedUsername);
      setUserId(savedUserId);
    }
  }, []);

  useEffect(() => {
    if (authToken) {
      window.localStorage.setItem('authToken', authToken);
      window.localStorage.setItem('authTokenType', authTokenType);
      window.localStorage.setItem('username', username);
      window.localStorage.setItem('userId', userId);
    } else {
      window.localStorage.removeItem('authToken');
      window.localStorage.removeItem('authTokenType');
      window.localStorage.removeItem('username');
      window.localStorage.removeItem('userId');
    }
  }, [authToken, authTokenType, username, userId]);

  useEffect(() => {
    fetch(BASE_URL + 'post/all/')
      .then(response => response.json())
      .then(data => {
        const sortedPosts = data.sort((a, b) => {
          const dateA = new Date(a.timestamp);
          const dateB = new Date(b.timestamp);
          return dateB - dateA;
        });
        setPosts(sortedPosts);
      })
      .catch(error => {
        console.log(error);
        alert('Error fetching posts');
      });
  }, []);

  const handleOpenSignIn = () => {
    setUsername('');
    setPassword('');
    setSignInError(''); // Resetear error
    setOpenSignIn(true);
  };

  const handleCloseSignIn = () => {
    setUsername('');
    setPassword('');
    setSignInError('');
    setOpenSignIn(false);
  };

  const handleOpenSignUp = () => {
    setUsername('');
    setPassword('');
    setEmail('');
    setSignUpError(''); // Resetear error
    setOpenSignUp(true);
  };

  const handleCloseSignUp = () => {
    setUsername('');
    setPassword('');
    setEmail('');
    setSignUpError('');
    setOpenSignUp(false);
  };

  const signIn = (event) => {
    event?.preventDefault();
    if (!username || !password) {
      setSignInError('Please fill in all fields.');
      return;
    }

    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    fetch(BASE_URL + 'login/', {
      method: 'POST',
      body: formData,
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to log in');
        }
        return response.json();
      })
      .then(data => {
        setAuthToken(data.access_token);
        setAuthTokenType(data.token_type);
        setUserId(data.user_id);
        setUsername(data.username);
      })
      .catch(error => {
        console.log(error);
        setSignInError('Login failed. Please check your credentials.');
      });

    handleCloseSignIn();
  };

  const signOut = () => {
    setAuthToken(null);
    setAuthTokenType(null);
    setUserId('');
    setUsername('');
  };

  const signUp = (event) => {
    event?.preventDefault();
    if (!username || !password || !email) {
      setSignUpError('Please fill in all fields.');
      return;
    }

    const requestOption = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password,
        email: email,
      }),
    };
    fetch(BASE_URL + 'user/', requestOption)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to sign up');
        }
        return response.json();
      })
      .then(data => {
        signIn();
      })
      .catch(error => {
        console.log(error);
        setSignUpError('Sign up failed. Please try again.');
      });
    handleCloseSignUp();
  };

  return (
    <div className="app">
      <Modal open={openSignIn} onClose={handleCloseSignIn}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app_signin" onSubmit={signIn}>
            <center>
              <img
                className="app_headerImage"
                src="https://1000marcas.net/wp-content/uploads/2019/11/ig-logo-768x256.png"
                alt="Instagram"
              />
            </center>
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete='username'
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete='current-password'
            />
            {signInError && <Typography color="error">{signInError}</Typography>}
            <Button type="submit" onClick={signIn}>
              Login
            </Button>
          </form>
        </div>
      </Modal>

      <Modal open={openSignUp} onClose={handleCloseSignUp}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app_signin" onSubmit={signUp}>
            <center>
              <img
                className="app_headerImage"
                src="https://1000marcas.net/wp-content/uploads/2019/11/ig-logo-768x256.png"
                alt="Instagram"
              />
            </center>
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete='username'
              
            />
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete='email'
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete='new-password'
            />
            {signUpError && <Typography color="error">{signUpError}</Typography>}
            <Button type="submit" onClick={signUp}>
              Sign Up
            </Button>
          </form>
        </div>
      </Modal>

      <div className="app_header">
        <img
          className="app_headerImage"
          src="https://1000marcas.net/wp-content/uploads/2019/11/ig-logo-768x256.png"
          alt="Instagram"
        />
        {authToken ? (
          <Button onClick={signOut}>Logout</Button>
        ) : (
          <div>
            <Button onClick={handleOpenSignIn}>Login</Button>
            <Button onClick={handleOpenSignUp}>Sign Up</Button>
          </div>
        )}
      </div>

      <div className="app_posts">
        {posts.map(post => (
          <Post key={post.id} post={post}
            authToken={authToken}
            authTokenType={authTokenType}
            username={username}
          />
        ))}
      </div>

      {authToken ? (
        <ImageUpload authToken={authToken}
          authTokenType={authTokenType}
          userId={userId} />
      ) : (
        <h3 className="message">You need to login to upload images</h3>
      )}
    </div>
  );
}

export default App;
