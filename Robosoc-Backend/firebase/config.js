const { initializeApp } = require("firebase/app")

const firebaseConfig = {
  apiKey: "AIzaSyBtozY7cEYa968WMvWHQJYThGZgGDKRW-U",
  authDomain: "robosoc-database.firebaseapp.com",
  projectId: "robosoc-database",
  storageBucket: "robosoc-database.appspot.com",
  messagingSenderId: "6070572576",
  appId: "1:6070572576:web:df47b64669c65f76190e45",
  measurementId: "G-SZFN4KHFEC"
};

const app = initializeApp(firebaseConfig);

module.exports = app