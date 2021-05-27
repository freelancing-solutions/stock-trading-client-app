/**
 * App Storage
 *
 */
import React, {useState, useEffect, createContext} from "react";
export const StorageContext = createContext()

export default function StorageContextProvider() {
    const [store, setStore] = useState([])
    const [indexes, setIndexes] = useState({key : 'pinoydesk_indexes', value: []})

    async function add_data_index(index){
        const index_values = JSON.parse(localStorage.getItem(indexes.key))
        index_values.push(index)
        localStorage.setItem(indexes.key, JSON.stringify(index_values))
        return index
    }

    async function add_data(data, index){
        localStorage.setItem(index,JSON.stringify(data))
        const store_data = [...store]
        store_data.push(data)
        setStore(store_data)
        return true
    }

    async function remove_index_and_data(index){
        localStorage.delete(index)
        const store_indexes = [...JSON.parse(localStorage.getItem(indexes.key))]
        setStore(store_indexes.filter( s_index => s_index !== index))
        return true
    }

    useEffect(() => {
        const index_value = JSON.parse(localStorage.getItem(indexes.key))
        const store_data  = []
        if (index_value !== undefined){
            index_value.forEach(data_index => {
                store_data.push(localStorage.getItem(data_index))
            })
            setStore(store_data)
        }else{
            localStorage.setItem(indexes.key, JSON.stringify(indexes.value))
        }
        return () => {localStorage.setItem(indexes.key, JSON.stringify(indexes.value))}
    }, [])

    return (
        <>
        </>
    )
}
