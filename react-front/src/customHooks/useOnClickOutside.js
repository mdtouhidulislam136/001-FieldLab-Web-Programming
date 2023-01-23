import { useEffect, useCallback } from 'react'

// hook that detects if user clicks outside of the referenced component
export default function useOnClickOutside(ref, callback) {

    const handleClick = useCallback((e) => {
        if (ref.current && !ref.current.contains(e.target)) {
            callback();
        }
    }, [ref, callback])

    useEffect(() => {
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [ref, callback, handleClick]);
}