import React, { useState, useEffect, useContext } from 'react';
import Signalboxes from'./Signalboxes'
import '../options.scss'
import { DataContext } from '../../contexts/DataContext'

// this is the file where chart options are made

export default function Options( {filtered} ) {


const { setOptions,  options } = useContext(DataContext)
const [settings, setSettings] = useState(
    {showadd : false,
    graphnumber : 'Graph1'
    })
const [checked, setChecked] = useState({
    Graph1: {signalbox1: null, signalbox2: null, show: false},
    Graph2: {signalbox1: null, signalbox2: null, show: false},
    Graph3: {signalbox1: null, signalbox2: null, show: false},
    Graph4: {signalbox1: null, signalbox2: null, show: false}})


const compare = (a, b) => {
    const firstnum = a.signal_number
    const secondnum = b.signal_number

    let comparison = 0
    if (firstnum > secondnum)
    {
        comparison = 1
    } else if (firstnum < secondnum) {
        comparison = -1
    }
    return comparison
}


const deepCopy = (data) => {

   const newobj = {}
   Object.keys(data).forEach(name => {
       const tempform = []
       newobj[name] = []
       data[name].forEach(d => {
           tempform.push({...d, show: true})
       })
       const signalnames = [...new Set(tempform.map((sn) => sn.signal_name))]
       signalnames.sort()
       signalnames.forEach(signame => {
           const currentsignal = tempform.filter(current => current.signal_name === signame)
           currentsignal.sort(compare)
           newobj[name].push(...currentsignal)
       })
   })

    return newobj
}

const [signals, setSignals] = useState({signalbox1: deepCopy(filtered), signalbox2: deepCopy(filtered)})

useEffect(() => {
setSignals({signalbox1: deepCopy(filtered), signalbox2: deepCopy(filtered)})
setChecked({
    Graph1: {signalbox1: null, signalbox2: null},
    Graph2: {signalbox1: null, signalbox2: null},
    Graph3: {signalbox1: null, signalbox2: null},
    Graph4: {signalbox1: null, signalbox2: null}})
}, [filtered])

const checkIfSame = (ops) => {

        let isSame = true
        if (options.signals === undefined) {
            return false
        }
        if (ops.signals !== options.signals) {
            return false
        }
        if(ops.idkey !== options.idkey){
            return false
        }
        if (ops.names.length === options.names.length) {
            ops.names.forEach((element, ind) => {
                for (const prop in element) {
                    if (element[prop] !== options.names[ind][prop]) {
                        isSame = false
                    }
                }
            })
        }
        else {
            return false;
        }
        if (ops.sets === 2 && options.names2 !== undefined){
             if(ops.names2.length === options.names2.length)
             {
                ops.names2.forEach((element, ind) => {
                    for (const prop in element) {
                        if (element[prop] !== options.names2[ind][prop]) {
                            isSame = false
                        }
                    }
                })
             }
             else{
                 return false
             }
        }
        return isSame
}


// function sends chosen graph settings to MainPage.js
function Apply(){
    const chosensignals = [];
    const secondsignals = [];
    let same_unit = true;
    let YaxisUnit1;
    let YaxisUnit2;
    let filterchecked = [];
    const tempchecked = {}
    tempchecked.signalbox1 = {...deepCopy(signals.signalbox1)}
    for (const box1 in signals.signalbox1){
        filterchecked = signals.signalbox1[box1].filter(status => status.isChecked)
        if (filterchecked.length > 0){
            chosensignals.push(...filterchecked)
        }
    }
    if(chosensignals.length > 0){
    YaxisUnit1 = chosensignals[0].signal_unit;
    for(var i = 0; i < chosensignals.length;i++){
        if(chosensignals[i].signal_unit !== YaxisUnit1){
            same_unit = false;
            break;
        }
    }

    if(same_unit === false){
        alert("Unit type must be same for all chosen signals in y-axis");
        return;
    }
    }

    if(settings.showadd === true){
    tempchecked.signalbox2 = {...deepCopy(signals.signalbox2)}
    tempchecked.show = true
    for (const box2 in signals.signalbox2){
        filterchecked = signals.signalbox2[box2].filter(status => status.isChecked)
        tempchecked.signalbox2[box2] = []
        tempchecked.signalbox2[box2].push(...signals.signalbox2[box2])
        if (filterchecked.length > 0){
            secondsignals.push(...filterchecked)
        }

    }
    if(secondsignals.length > 0){
    YaxisUnit2 = secondsignals[0].signal_unit;
    for(var t = 0; t < secondsignals.length;t++){
        if(secondsignals[t].signal_unit !== YaxisUnit2){
            same_unit = false;
            break;
        }
    }
    if(same_unit === false){
        alert("Unit type must be same for all chosen signals in y-axis");
        return;
    }
    }
    }
    setChecked({...checked, [settings.graphnumber]: tempchecked})
    if (secondsignals.length > 0 && settings.showadd === true && chosensignals.length > 0) {
        if ((chosensignals.length + secondsignals.length) > 6)
        {
        alert("You can only have 6 signals in one graph")
        return;
        }
        if(YaxisUnit2 === "xyz" || (YaxisUnit1 === "xyz" && YaxisUnit2 !== YaxisUnit1)){
            alert("You can only use multidimensional chart with one axis values")
            return;
        }


            const chosenlist1 = []
            const chosenlist2 = []
            chosensignals.forEach(element => {
                chosenlist1.push({
                    ...element,
                    axis: 1
                })
            });
            secondsignals.forEach(element => {
                chosenlist2.push({
                    ...element,
                    axis: 2
                })
            })


            const chosenoptions = {
                idkey: settings.graphnumber,
                names: chosenlist1,
                names2: chosenlist2,
                ylabel: chosenlist1[0].signal_unit,
                ylabel2: chosenlist2[0].signal_unit,
                signals: chosensignals.length + secondsignals.length,
                chart: YaxisUnit1,
                update: true,
                sets: 2
            }
            if(checkIfSame(chosenoptions) === false){
            setOptions(chosenoptions)
            }

    } else if (chosensignals.length > 0){
        if (chosensignals.length > 6) {
            alert("You can only have 6 signals in one graph")
        }
        else {

            const chosenlist = []
            chosensignals.forEach(element => {
                chosenlist.push({
                    ...element,
                    axis: 1
                })
            });


            // chosen options are stored in this json
            const chosenoptions = {
                idkey: settings.graphnumber,
                names: chosenlist,
                ylabel: chosenlist[0].signal_unit,
                signals: chosensignals.length,
                chart: YaxisUnit1,
                update: true,
                sets: 1
            }
            if(checkIfSame(chosenoptions) === false){
            setOptions(chosenoptions)
            }
        }
    }
}

useEffect(() => {

    const tempsignlist = {signalbox1: {}, signalbox2: {}}
    if(checked[settings.graphnumber].signalbox1 !== null && checked[settings.graphnumber].signalbox1 !== undefined){
        tempsignlist.signalbox1 = {...checked[settings.graphnumber].signalbox1}
    }
    else{
        tempsignlist.signalbox1 = deepCopy(filtered)
    }

    if(checked[settings.graphnumber].signalbox2 !== null && checked[settings.graphnumber].signalbox2 !== undefined){
        tempsignlist.signalbox2 = {...checked[settings.graphnumber].signalbox2}
    }
    else{
        tempsignlist.signalbox2 = deepCopy(filtered)
    }
    setSettings({...settings, showadd: checked[settings.graphnumber].show})
    setSignals(tempsignlist)

}, [settings.graphnumber])

return (
    <div className="options">
        <Signalboxes setSignals={setSignals} signals={signals} settings={settings} basedata={filtered}/>
        <div className="other-options">
            <button onClick={e => setSettings({...settings, showadd: !settings.showadd})}>Second y-axis signals</button>
             <button onClick={Apply}>Apply changes</button>
             <select onChange={e => setSettings({...settings, graphnumber: e.target.value})}>
                 <option value={"Graph1"}>Graph 1</option>
                 <option value={"Graph2"}>Graph 2</option>
                 <option value={"Graph3"}>Graph 3</option>
                 <option value={"Graph4"}>Graph 4</option>
             </select>
        </div>
    </div>


)
}




