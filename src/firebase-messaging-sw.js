importScripts('https://www.gstatic.com/firebasejs/7.6.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.6.0/firebase-messaging.js');


firebase.initializeApp({
    apiKey: "AIzaSyCrST12-O8mKmUJuunx2Edf_RebNk63k34",
    authDomain: "tcompra-c2bc0.firebaseapp.com",
    databaseURL: "https://tcompra-c2bc0.firebaseio.com",
    projectId: "tcompra-c2bc0",
    storageBucket: "tcompra-c2bc0.appspot.com",
    messagingSenderId: "1063231090666",
    appId: "1:1063231090666:web:eac62ecfee65c74c8c4c93" 
});

const messaging = firebase.messaging();