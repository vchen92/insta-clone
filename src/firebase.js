import firebase from 'firebase';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: 'AIzaSyDHjcXT4yqD-5DBiCq5bVV19Qr10UyQr4k',
	authDomain: 'insta-612f3.firebaseapp.com',
	projectId: 'insta-612f3',
	storageBucket: 'insta-612f3.appspot.com',
	messagingSenderId: '504809005088',
	appId: '1:504809005088:web:5b29a0efb45474d68d9c45',
	measurementId: 'G-KBCY07S3Q3',
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
export default db;

