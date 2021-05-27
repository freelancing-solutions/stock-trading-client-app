

import React, {useEffect, useState, useContext} from "react"

export default function Subscribe(){
    const [user, setUser] = useState({
        names: '',
        surname: '',
        email: '',
        cell : ''
    })

    useEffect( () => {

        return () => {}
    },[])
    return (
        <>
            <h2> Subscribe </h2>
        </>
    )
}