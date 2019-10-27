import { useState, useEffect } from 'react'

export const useFetch = (url: string) => {
    const [data, setData] = useState<any>(undefined)
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        // loading set to true for spinner to show up
        setLoading(true)
        // make the api call
        fetch(url, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        // where the magic happens
        .then(data => {
            setData(data)
            setLoading(false)
        })
        // where the sadness hits the roof
        .catch(error => console.error(error))

        return () => {
            setData(undefined)
            setLoading(false)
        }
    }, [url]) // dependency array to call the lifecycle event once again if the url changes.

    // return these bad boys to the RFC.
    return [data, loading]
}