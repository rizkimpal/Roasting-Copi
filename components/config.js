/* eslint-disable prettier/prettier */
import {initializeApp} from 'firebase/app';
import {getStorage} from 'firebase/storage';
import {getDatabase} from 'firebase/database';
const firebaseConfig = {
  apiKey: 'AIzaSyDyE-D3WKWmAKc4P9ER2wmhM2oWTfIZvZQ',
  authDomain: 'roastinglevelapp.firebaseapp.com',
  databaseURL:
    'https://roastinglevelapp-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'roastinglevelapp',
  storageBucket: 'roastinglevelapp.appspot.com',
  messagingSenderId: '1008618321394',
  appId: '1:1008618321394:web:a6aeaaa386597965e3e76b',
  measurementId: 'G-ND7VZY8TDF',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const database = getDatabase(app);
export default storage;
export {database};
