// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// TODO: Use a .env file to keep config safe.
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDE3MCRKVikVihQv8a56FT05Y4FqrrAB5o",
  authDomain: "ionic-marketplace-adde9.firebaseapp.com",
  databaseURL:
    "https://ionic-marketplace-adde9-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "ionic-marketplace-adde9",
  storageBucket: "ionic-marketplace-adde9.appspot.com",
  messagingSenderId: "322204614705",
  appId: "1:322204614705:web:582e7de5f787bc4fb21510",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Authentication and get a reference to the service
const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export { auth, db };
