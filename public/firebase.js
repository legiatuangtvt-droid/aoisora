// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js'
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCCqF3nDxn2iZM7H7-faqbE4wj504fUhq4',
  authDomain: 'groovy-form-475007-a0.firebaseapp.com',
  projectId: 'groovy-form-475007-a0',
  storageBucket: 'groovy-form-475007-a0.firebasestorage.app',
  messagingSenderId: '892553827299',
  appId: '1:892553827299:web:abd3290e5988c0793e06d6',
  measurementId: 'G-V4NCH9WSHP',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app)

export default app
