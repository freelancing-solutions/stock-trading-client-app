import React from "react"
import * as init from "../../contexts/init"
import firebase from "firebase/app"
import * as firebaseui from "firebaseui"
import 'firebaseui/dist/firebaseui.css'

export default function Login(){
    const firebaseApp = firebase.apps[0]
    const uiConfig = {
        signInSuccessUrl: '/dashboard',
        signInOptions: [
            firebaseApp.auth.GoogleAuthProvider.PROVIDER_ID,
            firebaseApp.auth.EmailAuthProvider.PROVIDER_ID,
            firebaseApp.auth.AnonymousAuthProvider.PROVIDER_ID
        ],
        tosUrl: '/terms',
        privacyPolicyUrl: function() {
            window.location.assign('/privacy');
        }
    }
    let ui = new firebaseui.auth.AuthUI(firebase.auth());
    return (
        <div id='firebaseui-auth-container'> </div>
    )
}