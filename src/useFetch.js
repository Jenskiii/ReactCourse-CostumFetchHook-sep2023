import { useEffect, useState } from "react"

export function useFetch(url, options = {} ){

    const [data, setData] = useState()
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)
// best way to fetch is useEffect
    useEffect(() =>{
        // resets values
        setData(undefined)
        setIsError(false)
        setIsLoading(true)

        const controller = new AbortController()

        //  fetches data
        fetch(url, {signal: controller.signal, ...options})
        .then(res => {
            // if res = oke return js
            if (res.status === 200){
                return res.json()
            }
            // else reject
           return Promise.reject(res)
        })
        .then(setData)
        // handles error
        .catch((e) => {
            // will cancel request belongs to controller
            if(e.name === "AbortErrror") return

            setIsError(true)
        })
        // removes loading from screen
        .finally(() => {
            //  if aborted will still output loading
            if (controller.signal.aborted) return
            setIsLoading(false)
        })

        // belongs to controller / 
        return () =>{
            controller.abort()
        }

    },[url])

    return {data, isLoading, isError}
}