// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from 'firebase/app';
import { setPersistence, browserLocalPersistence, getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyARpTujzKScSh1uWFU3mZ2psx_oJNlQsZc',
  authDomain: 'oi-tickets.firebaseapp.com',
  databaseURL: 'https://oi-tickets-default-rtdb.firebaseio.com',
  projectId: 'oi-tickets',
  storageBucket: 'oi-tickets.appspot.com',
  messagingSenderId: '19311167801',
  appId: '1:19311167801:web:29d5246376348e9d1780e8',
  measurementId: 'G-6LL4L6L35Y',
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getDatabase(app);
setPersistence(auth, browserLocalPersistence);
export default { app, auth, db };
