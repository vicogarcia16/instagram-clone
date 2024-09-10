import React, { useEffect, useState } from 'react';
import './App.css';
import Post from './Post';
import { makeStyles } from '@mui/styles';
import { Button, Modal, Input } from '@mui/material';
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
    backgroundColor: '#ffffff', // Define el color manualmente en lugar de usar el tema
    position: 'absolute',
    width: 400,
    border: '2px solid #000',
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.12)', // Definir sombra manualmente
    padding: '16px 32px 24px', // Define el padding manualmente
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
  const [authToken, setAuthToken] = useState(null); // Token
  const [authTokenType, setAuthTokenType] = useState(null); // Token type
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');

  // Cargar el token desde localStorage cuando el componente se monta
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

  // Guardar el token en localStorage cada vez que el token cambia
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

  // Fetch posts cuando la app se carga
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
    setUsername(''); // Limpiar campos
    setPassword(''); 
    setOpenSignIn(true); // Abrir modal
  };

  const handleCloseSignIn = () => {
    setUsername(''); // Limpiar campos
    setPassword(''); 
    setOpenSignIn(false); // Cerrar modal
  };

  const handleOpenSignUp = () => {
    setUsername(''); // Limpiar campos
    setPassword(''); 
    setEmail('');
    setOpenSignUp(true); // Abrir modal
  };

  const handleCloseSignUp = () => {
    setUsername(''); // Limpiar campos
    setPassword(''); 
    setEmail('');
    setOpenSignUp(false); // Cerrar modal
  };

  const signIn = (event) => {
    event?.preventDefault();
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
        console.log(data);
        setAuthToken(data.access_token);
        setAuthTokenType(data.token_type);
        setUserId(data.user_id);
        setUsername(data.username);
       
      })
      .catch(error => {
        console.log(error);
        alert('Login failed');
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
    }).catch(error => {
        console.log(error);
        alert('Sign up failed');
    })
    handleCloseSignUp();
  };

  return (
    <div className="app">
      <Modal open={openSignIn} onClose={handleCloseSignIn}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app_signin">
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
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signIn}>
              Login
            </Button>
          </form>
        </div>
      </Modal>

      <Modal open={openSignUp} onClose={handleCloseSignUp}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app_signin">
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
            />
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
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
