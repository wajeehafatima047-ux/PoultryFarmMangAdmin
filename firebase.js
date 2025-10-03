// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyA2_9bebzN1DS7C4ZGsuBO2o3PxnfsUxi0",
  authDomain: "poultry-managment-3930b.firebaseapp.com",
  projectId: "poultry-managment-3930b",
  storageBucket: "poultry-managment-3930b.firebasestorage.app",
  messagingSenderId: "218976690103",
  appId: "1:218976690103:web:a32430a68c9a2cb6d81232",
  measurementId: "G-3BWR2SBHS3"
};



// Initialize Firebase
try {
  var  app = initializeApp(firebaseConfig);
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase:', error);
}
// const app = initializeApp(firebaseConfig);

// Firebase Services
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };



