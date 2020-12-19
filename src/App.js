import './App.css';
import Post from './components/Post/Post';
import { useState } from 'react';

function App() {  
  const [posts, setPosts] = useState([
		{
			username: 'vchen92',
			captions: 'wow it works!!!',
			imageUrl:
				'https://miro.medium.com/max/700/1*mk1-6aYaf_Bes1E3Imhc0A.jpeg',
		},
		{
			username: 'sam123',
			captions: 'cool cool!!!',
			imageUrl:
				'https://miro.medium.com/max/700/1*mk1-6aYaf_Bes1E3Imhc0A.jpeg',
		},
  ]);

  return (
		<div className="app">
			<div className="app__header">
				<img
					src="https://instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
					alt=""
				/>
			</div>

			<h1>Instagram App</h1>

      {posts.map(post => (
        <Post
          username={post.username}
          caption={post.caption}
          imageUrl={post.imageUrl}
			  />
      ))}

			
		</div>
  );
}

export default App;
