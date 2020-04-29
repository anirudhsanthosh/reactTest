var firebaseConfig = {
    apiKey: "AIzaSyA4_o7Kfh4S0ZZcyKp2cw95Y-HsTpU_J0Q",
    authDomain: "videoblog-game.firebaseapp.com",
    databaseURL: "https://videoblog-game.firebaseio.com",
    projectId: "videoblog-game",
    storageBucket: "videoblog-game.appspot.com",
    messagingSenderId: "721151426731",
    appId: "1:721151426731:web:3690c8ff7b6c8cfbd777ee",
    measurementId: "G-44XGQNL6NR"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var database = firebase.database();
var storage = firebase.storage();


firebase.analytics();
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).catch(function(error) {
    // Handle Errors here.
    console.log(error.code);
    console.log(error.message);
  });