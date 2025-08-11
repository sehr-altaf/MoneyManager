// Import Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";


// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBgU868Fg9MYOCrBPfPYqD5Z12-C7vv688",
  authDomain: "expenses-manager-fs764.firebaseapp.com",
  projectId: "expenses-manager-fs764",
  storageBucket: "expenses-manager-fs764.appspot.com",
  messagingSenderId: "631234989156",
  appId: "1:631234989156:web:c77412525ff0a90e2a6371",
  measurementId: "G-TNGNGHG4NQ"
};




const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);





const auth = getAuth(app);
const db = getFirestore(app);
export { auth, db  };
