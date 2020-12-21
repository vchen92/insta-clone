import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import { db, storage } from '../../firebase';
import firebase from 'firebase';

import './ImageUpload.css';

function ImageUpload({ username }) {
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState('');
  const [progress, setProgress] = useState('');
  const [url, setUrl] = useState('');

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

  return (
		<div className="image_upload">
      <progress className="image_upload__progress" value={progress} max="100" />

      <input 
        type="text" 
        placeholder="Enter a caption..." 
        value={caption} 
        onChange={(e) => setCaption(e.target.value)} 
      />
      <input 
        type="file" 
        onChange={handleFileChange} 
      />

      <Button onClick={handleUpload}>Upload</Button>
		</div>
  );
}

export default ImageUpload;
