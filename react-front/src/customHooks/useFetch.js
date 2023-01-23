import { useState, useEffect } from "react";

// https://medium.com/better-programming/how-to-build-a-custom-react-hook-for-fetching-data-cf942e64e9f8
export default function useFecth(url ) {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
            (async () => {
                setLoading(true);
                setError({state: false, message: null})
                try {
                    const res = await fetch(url);
                    if(res.status === 404){alert("Table doesn't exist")}
                    const resJson = await res.json();
                    console.log('useFecth success:', resJson)
                    setData(resJson);
                } catch (err) {
                    //console.log('useFecth failed:', err.message)
                    setError({state: true, message: err});
                } finally {
                    setLoading(false);
                }
            })();
    }, [url]);

    return { loading, data, error };
};