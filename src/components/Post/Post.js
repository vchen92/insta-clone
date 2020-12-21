import { Avatar, Button } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import db from './../../firebase';
import firebase from 'firebase/app';

import './Post.css';

function Post({ postId, user, username, caption, imageUrl}) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');

  useEffect(() => {
    let unsubscribe;

    if (postId) {
      unsubscribe = db
        .collection('posts')
        .doc(postId)
        .collection('comments')
        .orderBy('timestamp', 'desc')
        .onSnapshot(snap => {
          setComments(snap.docs.map(doc => ({
            comment: doc.data(),
            id: doc.id,
          })));
        });
    }

    return () => {
      unsubscribe();
    }
  }, [postId]);

  const postComment = (event) => {
    event.preventDefault();

    db.collection('posts').doc(postId).collection('comments').add({
      text: comment,
      username: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });

    setComment('');
  }

  return (
		<div className="post">
			<div className="post__header">
				<Avatar
					className="post__avatar"
					alt={username}
					src="/static/images/avatar/1.jpg"
				/>
				<h3>{username}</h3>
			</div>

			<img
				className="post__image"
				src={imageUrl}
				alt="User post not found."
			/>

			<h4 className="post__text">
				<strong>{username} </strong>
				{caption}
			</h4>

      {!!comments.length && 
        <div className="post__comments">
          {comments.map(({comment, id}) => (
            <p key={id}>
              <strong>{comment.username}</strong> {comment.text}
            </p>
          ))}
        </div>
      }

      {user ? (
        <form className="post__commentBox">
          <input 
            className="post__input"
            type="text"
            placeholder="Add a comment..."
            value={comment}
            disabled={!user}
            onChange={(e) => setComment(e.target.value)}
          />
          <Button 
            className="post__button"
            disabled={!comment || !user}
            onClick={postComment}
            type="submit"
          >Post</Button>
        </form>
      ) : (
        <p className="post__login">Log in to comment.</p>
      )}
		</div>
  );
}

export default Post;
