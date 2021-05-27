import React, {useEffect} from "react"
const firebase = require("firebase")
const firebaseui = require("firebaseui")
import {auth,uiConfig} from "../../init/auth/init"
import 'firebaseui/dist/firebaseui.css'

export default function Login(){
    const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);
    useEffect( () => {
        ui.start('#fire-ui', uiConfig)
    },[])

    return (
        <div>
            <h2 >Login </h2>
            <div id='fire-ui'> </div>
        </div>)
}