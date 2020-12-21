import './App.css';
import Post from './components/Post/Post';
import React, { useState, useEffect } from 'react';
import { db, auth } from './firebase';
import { Button } from '@material-ui/core';
import LoginModal from './components/LoginModal/LoginModal';
import ImageUpload from './components/ImageUpload/ImageUpload';
import InstagramEmbed from 'react-instagram-embed';
import { makeStyles } from '@material-ui/core/styles';

function getModalStyle() {
	const top = 50;
	const left = 50;

	return {
    outline: 'none',
		top: `${top}%`,
		left: `${left}%`,
		transform: `translate(-${top}%, -${left}%)`,
	};
}

const useStyles = makeStyles(theme => ({
	paper: {
		position: 'absolute',
    width: 300,
		backgroundColor: theme.palette.background.paper,
		border: 'none',
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3),
	},
}));

function App() {
  const [posts, setPosts] = useState([]);
  const [openSignUp, setOpenSignUp] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      setUser(authUser || null);
    });

    return () => {
      unsubscribe();
    }
  }, [user, username]);

  useEffect(() => {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snap => {
      setPosts(snap.docs.map(doc => ({
        post: doc.data(),
        id: doc.id
      })));
    });
  }, []);

  const signUp = (event, email, password, username) => {
    event.preventDefault();
    setUsername(username);

    auth
      .createUserWithEmailAndPassword(email, password)
      .then(authUser => {
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch(err => alert(err.message));

    setOpenSignUp(false);
  }

  const signIn = (event, email, password) => {
    event.preventDefault();
    
    auth
      .signInWithEmailAndPassword(email, password)
      .catch(err => alert(err.message));

    setOpenSignIn(false);
  }

  return (
		<div className="app">
			<LoginModal
				text="Sign Up"
				open={openSignUp}
				close={setOpenSignUp}
				action={signUp}
				getModalStyle={getModalStyle}
				classes={useStyles()}
			/>

			<LoginModal
				text="Sign In"
				open={openSignIn}
				close={setOpenSignIn}
				action={signIn}
				getModalStyle={getModalStyle}
				classes={useStyles()}
			/>

			<div className="app__header">
				<img
					className="app__headerImage"
					src="https://instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
					alt=""
				/>
				{user ? (
					<Button onClick={() => auth.signOut()}>Logout</Button>
				) : (
					<div className="app__loginContainer">
						<Button onClick={() => setOpenSignIn(true)}>
							Sign In
						</Button>
						<Button onClick={() => setOpenSignUp(true)}>
							Sign Up
						</Button>
					</div>
				)}
			</div>

			<div className="app__posts">
				<div className="app__postsLeft">
					{posts.map(({ post, id }) => (
						<Post
							key={id}
							postId={id}
							user={user}
							username={post.username}
							caption={post.caption}
							imageUrl={post.imageUrl}
						/>
					))}
				</div>
				<div className="app__postsRight">
					<InstagramEmbed
            className="app__instaPost"
						url="https://www.instagram.com/p/CDh0Ls1gvbP/"
						clientAccessToken="724145225204709|6446aa760ce323aa04b6bb6dd1e02159"
						maxWidth={320}
						hideCaption={false}
						containerTagName="div"
						protocol=""
						injectScript
						onLoading={() => {}}
						onSuccess={() => {}}
						onAfterRender={() => {}}
						onFailure={() => {}}
					/>
				</div>
			</div>

			<ImageUpload username={user?.displayName} />
		</div>
  );
}

export default App;
