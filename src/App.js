import './App.css';
import Post from './components/Post/Post';
import React, { useState, useEffect } from 'react';
import db, { auth } from './firebase';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Input } from '@material-ui/core';

function getModalStyle() {
	const top = 50;
	const left = 50;

	return {
		top: `${top}%`,
		left: `${left}%`,
		transform: `translate(-${top}%, -${left}%)`,
	};
}

const useStyles = makeStyles(theme => ({
	paper: {
		position: 'absolute',
		width: 400,
		backgroundColor: theme.palette.background.paper,
		border: '2px solid #000',
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3),
	},
}));

function App() {  
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);

  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        console.log(authUser);
        setUser(authUser);

        if (authUser.displayName) {
          
        } else {
          return authUser.updateProfile({
            displayName: username,
          });
        }
      } else {
        setUser(null);
      }
    });

    return () => {
      unsubscribe();
    }
  }, [user, username]);

  useEffect(() => {
    db.collection('posts').onSnapshot(snap => {
      setPosts(snap.docs.map(doc => ({
        post: doc.data(),
        id: doc.id
      })));
    });
  }, []);

  const signUp = (event) => {
    event.preventDefault();

    auth
      .createUserWithEmailAndPassword(email, password)
      .then(authUser => {
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch(err => alert(err.message));

    // setUsername('');
    setEmail('');
    setPassword('');

    setOpen(false);
  }

  const signIn = (event) => {
    event.preventDefault();
    
    auth
      .signInWithEmailAndPassword(email, password)
      .catch(err => alert(err.message));

    setOpenSignIn(false);
  }

  return (
		<div className="app">
			<Modal open={open} onClose={() => setOpen(false)}>
				<div style={modalStyle} className={classes.paper}>
					<form className="app__signup">
						<center>
							<img
								className="app_headerImage"
								src="https://instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
								alt=""
							/>
						</center>
						<Input
							placeholder="username"
							type="text"
							value={username}
							onChange={e => setUsername(e.target.value)}
						/>
						<Input
							placeholder="email"
							type="text"
							value={email}
							onChange={e => setEmail(e.target.value)}
						/>
						<Input
							placeholder="password"
							type="text"
							value={password}
							onChange={e => setPassword(e.target.value)}
						/>
						<Button type="submit" onClick={signUp}>
							Sign Up
						</Button>
					</form>
				</div>
			</Modal>

			<Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
				<div style={modalStyle} className={classes.paper}>
					<form className="app__signup">
						<center>
							<img
								className="app_headerImage"
								src="https://instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
								alt=""
							/>
						</center>
						<Input
							placeholder="email"
							type="text"
							value={email}
							onChange={e => setEmail(e.target.value)}
						/>
						<Input
							placeholder="password"
							type="text"
							value={password}
							onChange={e => setPassword(e.target.value)}
						/>
						<Button type="submit" onClick={signIn}>
							Sign In
						</Button>
					</form>
				</div>
			</Modal>

			<div className="app__header">
				<img
					src="https://instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
					alt=""
				/>
			</div>

			{user ? (
				<Button onClick={() => auth.signOut()}>Logout</Button>
			) : (
				<div className="app__loginContainer">
					<Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
					<Button onClick={() => setOpen(true)}>Sign Up</Button>
				</div>
			)}

			{posts.map(({ post, id }) => (
				<Post
					key={id}
					username={post.username}
					caption={post.caption}
					imageUrl={post.imageUrl}
				/>
			))}
		</div>
  );
}

export default App;
