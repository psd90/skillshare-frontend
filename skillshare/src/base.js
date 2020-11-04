import firebase from "firebase/app";
import "firebase/auth";


const app = firebase.initializeApp({
    apiKey: "AIzaSyDD5VwImyjiHnaatbeDaXLEyWIk3yLTGwg",
    authDomain: "firebasing-testing.firebaseapp.com",
    databaseURL: "https://firebasing-testing.firebaseio.com",
    projectId: "firebasing-testing",
    storageBucket: "firebasing-testing.appspot.com",
    messagingSenderId: "609501009618",
    appId: "1:609501009618:web:479beadcf38846d8347f0b",
    measurementId: "G-9L5KEF7H83"
  });




export default app;