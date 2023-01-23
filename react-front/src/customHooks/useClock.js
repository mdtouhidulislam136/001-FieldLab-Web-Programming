import { useState, useEffect } from 'react';
import moment from 'moment'

// hook that returns current time, formatted with moment
export default function useClock() {
    const [time, setTime] = useState(moment());

    useEffect(() => {
        let id = setInterval(() => {
            setTime(moment());
        }, 1000);
        return () => clearInterval(id);
    }, []);

    return moment(time).format('HH:mm');
}
