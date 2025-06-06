import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCtTl0VWY2ODir5w4q8hBjTrZ2rVB1AzRs", //AIzaSyCtTl0VWY2ODir5w4q8hBjTrZ2rVB1AzRs
  authDomain: "restaurant-mgmt-eba65.firebaseapp.com",
  projectId: "restaurant-mgmt-eba65",
  storageBucket: "restaurant-mgmt-eba65.appspot.com",
  messagingSenderId: "657776637136",
  appId: "1:657776637136:web:226b3b16645426373edad5",
  measurementId: "G-PK1N7JV7ER"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
  