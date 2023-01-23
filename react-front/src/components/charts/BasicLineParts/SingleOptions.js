import React, { useState} from 'react'


export default function SingleOptions({func, data1, def_time}) {


    const [tempvals1, setTempvals1] = useState({max: data1.default_Axis.max, min: data1.default_Axis.min, TickValue: data1.default_Axis.TickValue})
    const [timescale, settimescale] = useState("ss")
    const [timestart, setStart] = useState({hour: "00", minute: "00", second: "00"})
    const [timeend, setEnd] = useState({hour: "00", minute: "00", second: "00"})

/*
    useMemo(() => {
        const tempstart = def_time.start.split(":")
        const tempend = def_time.end.split(":")
        setStart({hour: tempstart[0], minute: tempstart[1], second: tempstart[2]})
        setEnd({hour: tempend[0], minute: tempend[1], second: tempend[2]})
        setTempvals1({max: data1.default_Axis.max, min: data1.default_Axis.min, TickValue: data1.default_Axis.TickValue})
    }, [def_time])
*/
const timesets = ["HH","mm","ss"]
const times = ['Hour', 'Minute', 'Second']

const timeToSeconds = (str) => {
    const tempStr = str.split(":");
    let ms = 0, m = 1000;
    if(tempStr.length === 4){
    ms += parseInt(tempStr.pop(), 10);
    }
    else if(tempStr.length === 2){m *= 60}
    else if(tempStr.length === 1){m *= 3600}
    while(tempStr.length > 0){
        ms += m * parseInt(tempStr.pop(), 10);
        m *= 60;
    }
    return ms;
}
const secondsToTime = (sec, accu) => {
    let tempnum = sec
    let showtime = [0,0,0]
    if(tempnum >= 3600000){
    showtime[0] = (tempnum - (tempnum % 3600000))/3600000
    tempnum = tempnum % 3600000
    }
    if(tempnum >= 60000){
    showtime[1] = (tempnum - (tempnum % 60000))/60000
    tempnum = tempnum % 60000
    }
    if(tempnum >= 1000){
    showtime[2] = (tempnum - (tempnum % 1000))/1000
    tempnum = tempnum % 1000
    }
    if(sec < 60000){
    showtime[3] = tempnum
    }
    if(accu === "m" && showtime[0] > 0){
        showtime.shift()
    }

    return showtime.join(":")
}



    const ChangeData = (type) => {
        const tempdata = []
        const tempdata2 = []
        switch (type) {

            case "time1":
                for (const prop in timestart) {
                    tempdata.push(timestart[prop])
                    tempdata2.push(timeend[prop])
                }
                console.log(tempdata, tempdata2)

                func.SetTimeset({ start: timeToSeconds(tempdata.join(":")), end: timeToSeconds(tempdata2.join(":")) })
                break;

            case "axis1":
                func.SetAxis1({max: Number(tempvals1.max), min:Number(tempvals1.min), TickValue: Number(tempvals1.TickValue)})
                break;
            case "def_axis":
                setTempvals1({ max: data1.default_Axis.max, min: data1.default_Axis.min, TickValue: data1.default_Axis.TickValue })
                func.SetAxis1({ ...data1.default_Axis })
                break;
            case "def_time":
                const tempstart = secondsToTime(def_time.start).split(":")
                const tempend = secondsToTime(def_time.end).split(":")
                setStart({ hour: tempstart[0], minute: tempstart[1], second: tempstart[2] })
                settimescale("ss")
                setEnd({ hour: tempend[0], minute: tempend[1], second: tempend[2] })
                func.SetTimeset({ start: def_time.start, end: def_time.end })
                break;
            default:
                break;


        }
    }



    const timeupdate = (e, prop, pos) => {
        let tempval = e
        if(tempval < 0){tempval = -tempval}
        if(prop === "hour" && tempval > 24){tempval = "24"}
        else if(prop === "minute" && tempval > 60){tempval = "60"}
        else if(prop === "second" && tempval > 60){tempval = "60"}

        let temptime = []
        if (pos === "start"){
            temptime = timestart[prop]
            temptime = tempval
            setStart({...timestart, [prop]: temptime})
        }else if(pos === "end"){
            temptime = timeend[prop]
            temptime = tempval
            setEnd({...timeend, [prop]: temptime})
        }

    }

    const changetimescale = (val) => {
        const tempstart = { ...timestart }
        const tempend = { ...timeend }
        const props = Object.keys(timestart).length
        settimescale(val)
        switch (val) {
            case "HH":
                setStart({ hour: tempstart.hour })
                setEnd({ hour: tempend.hour })
                break;
            case "mm":
                if (props < 2) {
                    setStart({ hour: tempstart.hour, minute: "00" })
                    setEnd({ hour: tempend.hour, minute: "00" })
                } else {
                    setStart({ hour: tempstart.hour, minute: tempstart.minute })
                    setEnd({ hour: tempend.hour, minute: tempend.minute })
                }
                break;
            case "ss":
                if (props < 2) {
                    setStart({ hour: tempstart.hour, minute: "00", second: "00" })
                    setEnd({ hour: tempend.hour, minute: "00", second: "00" })
                } else {
                    setStart({ hour: tempstart.hour, minute: tempstart.minute, second: "00" })
                    setEnd({ hour: tempend.hour, minute: tempend.minute, second: "00" })
                }
                break;
            default:
                break;

        }

    }



    return (<div className="ChartOptions">
        <div className="y-axis">
                <div className="label">
                    Y-axis options
            </div>
            <div className="sideways">
                <form >
                    Max
            <input type="text" key="max1" value={tempvals1.max} onChange={e => setTempvals1({ ...tempvals1, max: e.target.value })}></input>
            Min
            <input type="text" key="min1" value={tempvals1.min} onChange={e => setTempvals1({ ...tempvals1, min: e.target.value })}></input>
            TickValues
            <input type="text" key="space1" value={tempvals1.TickValue} onChange={e => setTempvals1({ ...tempvals1, TickValue: e.target.value })}></input>
                </form>
                <div className="contents">
                    <button onClick={e => ChangeData("axis1")}>NewValues</button>
                    <button onClick={e => ChangeData("def_axis")}>DefaultValues</button>
                </div>
            </div>
        </div>
        <div className="time-axis">
            <div className="label">
                Time axis options
            </div>
            <div className="timeDiv">
                Start time
            <form key="start_time">
                    {[...Object.keys(timestart)].map((time, index) => {
                        return <div key={`${timesets[index]}1`}>{`${timesets[index]}`}<input type="text" key={`${time}`} value={timestart[time]} onChange={e => timeupdate(e.target.value, time, "start")}></input></div>
                    })}
                </form>
            End time
            <form key="end_time">
                    {Object.keys(timeend).map((time, index) => {
                        return <div key={`${timesets[index]}2`}>{`${timesets[index]}`}<input type="text" key={`${time}`} value={timeend[time]} onChange={e => timeupdate(e.target.value, time, "end")}></input></div>
                    })}
                </form>
            </div>
            <div className="selectDiv">
                <div className="contents">
                    Time Accuracy
                    <select key={'time-sel'} value={timescale} onChange={e => changetimescale(e.target.value)}>
                        {timesets.map((value, i) => <option key={i} value={value}>{times[i]}</option>)}
                    </select>
                </div>
                <div className="contents">
                    <button onClick={e => ChangeData("time1")}>Newtime</button>
                    <button onClick={e => ChangeData("def_time")}>DefaultTime</button>
                </div>
            </div>

        </div>


    </div>)


}
// <input type="number" key="time1"   onChange={e => updatevalues(e.target.value, "time1")}></input>

/*
    else{

        return (<div class="ChartOptions">
        First y-axel
        <select key={'first.sel'} value={multiplier} onChange={e => setMultiplier(e.target.value)}>
        {multipliers.map((value, i) => <option key={i} value={value}>{value}</option>)}
        </select>
        Second y-axel
        <select key={'second.sel'} value={multiplier2} onChange={e => setMultiplier2(e.target.value)}>
            {multipliers.map((value, i) => <option key={i} value={value}>{value}</option>)}
        </select>
        Aikaväli
        <select key={'time.sel'} value={timespans} >

        </select>
        </div>)
    }
    */