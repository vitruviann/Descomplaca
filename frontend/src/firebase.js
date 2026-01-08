
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
    apiKey: "AIzaSyDv49Y39hSbyL9go1fV9G2WI9O4MEvkvOU",
    authDomain: "descomplaca.firebaseapp.com",
    projectId: "descomplaca",
    storageBucket: "descomplaca.firebasestorage.app",
    messagingSenderId: "117147042194",
    appId: "1:117147042194:web:ca04566ec2741efc57c14b",
    measurementId: "G-K64KQY0NBH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);

export { auth, db, functions };
