// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js'
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyALtlRjftwnm5EuE8u18wKYffAX2q9eypY',
  authDomain: 'aoisorademo.firebaseapp.com',
  projectId: 'aoisorademo',
  storageBucket: 'aoisorademo.firebasestorage.app',
  messagingSenderId: '299970670646',
  appId: '1:299970670646:web:ef7106bff089d21e6aa897',
  measurementId: 'G-P4P0NB18V3',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app)

export default app
