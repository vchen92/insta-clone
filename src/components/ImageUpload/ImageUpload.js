import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import { db, storage } from '../../firebase';
import firebase from 'firebase/app';

import './ImageUpload.css';

function ImageUpload({ username }) {
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState('');
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  }

  const handleUpload = () => {
    const uploadTask = storage.ref(`images/${image.name}`).put(image);
    uploadTask.on(
      'state_changed', 
      (snap) => {
        const progress = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
        setProgress(progress);
      },
      (err) => {
        console.log(err);
        alert(err.message);
      },
      () => {
        storage
          .ref('images')
          .child(image.name)
          .getDownloadURL()
          .then(url => {
            // post image inside db
            db.collection('posts').add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              imageUrl: url,
              username: username,
            });

            setProgress(0);
            setCaption('');
            setImage(null);
          });
      }
    )
  }

  return username ? (
		<div className="image_upload">
      <progress
        className="image_upload__progress"
        value={progress}
        max="100"
      />
      <input
        className="image_upload__caption"
        type="text"
        placeholder="Enter a caption..."
        value={caption}
        onChange={e => setCaption(e.target.value)}
      />
      <input 
        className="image_upload__file"
        key={image || ''}
        type="file" 
        onChange={(e) => handleFileChange(e)} />

      <Button 
        className="image_upload__button" 
        onClick={handleUpload}
        disabled={!image}
      >Upload</Button>			
		</div>
  ) : (
		<div className="image_upload__login">
      <h3>Please login to post a picture!</h3>
    </div>
  );
}

export default ImageUpload;
