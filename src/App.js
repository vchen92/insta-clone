import './App.css';
import Post from './components/Post/Post';
import { useState, useEffect } from 'react';
import db from './firebase';

function App() {  
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    db.collection('posts').onSnapshot(snap => {
      setPosts(snap.docs.map(doc => ({
        post: doc.data(),
        id: doc.id
      })));
    });
  }, []);

  return (
		<div className="app">
			<div className="app__header">
				<img
					src="https://instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
					alt=""
				/>
			</div>

      {posts.map(({post, id}) => (
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
