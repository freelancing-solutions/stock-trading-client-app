/***
 * Initializing the application
 * firebase init
 * context initializations and loading data
 * initializing service workers and handlers
 *
 */
import React from "react"
import "firebase/auth"
import "firebase/firestore"
import "firebase/storage"
import firebase from "firebase"

// noinspection SpellCheckingInspection
const config = {
    apiKey: "AIzaSyC0EXV8zXvovXt4XnsqJ6F1qck9k-zVUJo",
    authDomain: "pinoydesk.firebaseapp.com",
    projectId: "pinoydesk",
    storageBucket: "pinoydesk.appspot.com",
    messagingSenderId: "521703065329",
    appId: "1:521703065329:web:a4f955b9f2d4e0e3464b50",
    measurementId: "G-HZNRYF3L51"
}

try{
    if (!firebase.apps.length){
        firebase.initializeApp(config);
    }else{
        firebase.app();
    }
}catch (e) {
    console.log('firebase app already configured');
}

const uiConfig = {
    signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        firebase.auth.AnonymousAuthProvider.PROVIDER_ID
    ],
    tosUrl: '/terms',
    signInSuccessUrl: '/dashboard',
    privacyPolicyUrl: function() {
        window.location.assign('/privacy');
    }
}

const auth = firebase.auth();
const firestore = firebase.firestore();
const storage = firebase.storage();
export {auth,firestore,storage, uiConfig};