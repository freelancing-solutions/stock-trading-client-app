import React from "react"
import "firebase/auth"
const firebaseui = require("firebaseui")
import {auth,uiConfig} from "../../contexts/init"
import 'firebaseui/dist/firebaseui.css'

export default function Login(){

    const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);
    ui.start('firebaseui-auth-container', uiConfig)
    return (
        <div id='firebaseui-auth-container'> </div>
    )
}