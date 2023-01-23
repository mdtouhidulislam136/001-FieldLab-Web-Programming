import React, {useState, useEffect, Fragment} from 'react';
import SearchIcon from '@material-ui/icons/Search';

export default function Signalboxes({setSignals, signals, settings, basedata}){


// function to change checkbox status
const checkboxclick = (index, obj) => {

    const newsignal = {...signals[obj[0]]}
    newsignal[obj[1]][index].isChecked = !newsignal[obj[1]][index].isChecked
    setSignals({...signals, [obj[0]]: newsignal})

}
const [search1, setSearch1] = useState("")
const [search2, setSearch2] = useState("")

useEffect(() => {
    setSearch1("")
    setSearch2("")
}, [basedata])

// function to take names from list and put them on options panel
    const Names = props => {
        return (
            <div>
                <label>
                <input type="checkbox" checked={props.data.isChecked} onChange={() => props.checkboxclick(props.index, props.obj)} />
                {props.name}
            </label>
            </div>
        )
    }

    useEffect(() => {
        const labelcheck = {...signals.signalbox1}
        for(const prop in labelcheck){
            labelcheck[prop].forEach((e) => {
                let same = true
                for(var i = 0; i < search1.length; i++){
                    if(search1.charAt(i).toLowerCase() !== (e.signal_name + ' ' + e.signal_number).charAt(i).toLowerCase()){
                        same = false
                        break;
                    }
                }
                e.show = same
            })
        }
        setSignals({...signals, signalbox1: labelcheck})

    },[search1])

    useEffect(() => {
        const labelcheck = {...signals.signalbox2}
        for(const prop in labelcheck){
            labelcheck[prop].forEach((e) => {
                let same = true
                for(var i = 0; i < search2.length; i++){
                    if(search2.charAt(i).toLowerCase() !== (e.signal_name + ' ' + e.signal_number).charAt(i).toLowerCase()){
                        same = false
                        break;
                    }
                }
                e.show = same

            })
        }
        setSignals({...signals, signalbox2: labelcheck})
    },[search2])


const Deselect = (box) => {
    const templist = {}
    if(box === "box1"){
    templist.signalbox1 = {...signals.signalbox1}
    for (const box1 in templist.signalbox1){
        templist.signalbox1[box1].forEach((element, index1) => {
            if(element.isChecked === true){
            templist.signalbox1[box1][index1].isChecked = false
            }
        })
    }
    setSignals({...signals, signalbox1: templist.signalbox1})
}
    if(box === "box2"){
        templist.signalbox2 = {...signals.signalbox2}
        for (const box2 in templist.signalbox2){
            templist.signalbox2[box2].forEach((element, index2) => {
                if(element.isChecked === true){
                templist.signalbox2[box2][index2].isChecked = false
                }
            })
        }
        setSignals({...signals, signalbox2: templist.signalbox2})
    }

}



    return (
        <Fragment>
            <div className={"signalbox"}>
            <div className={"select-box"}>Axis1<SearchIcon style={{ fontSize: 18 }}/>
            <input value={search1} onChange={(e) => {setSearch1(e.target.value)}}></input>
            <button onClick={() => Deselect("box1")}>Deselect</button></div>
            <div className="first-y-axis">
                {Object.keys(signals.signalbox1).map((k, ind) =>
                    <div key={ind}><div>{k}</div>
                        {signals.signalbox1[k].map((data, index) => {
                            if(data.show === true){
                            return(<Names key={index}
                                index={index}
                                data={data}
                                name={data.signal_name + ' ' + data.signal_number + ` (unit: ${data.signal_unit})`}
                                checkboxclick={checkboxclick}
                                obj={['signalbox1',k]} />)
                            }})}
                    </div>
                )}
            </div>
            </div>

            {settings.showadd === true && <div className={"signalbox"}>
                <div className={"select-box"}>Axis2<SearchIcon style={{ fontSize: 18 }}/>
                <input value={search2} onChange={(e) => {setSearch2(e.target.value)}}></input>
                <button onClick={() => Deselect("box2")} >Deselect</button></div>
                <div className='second-y-axis'>
                {Object.keys(signals.signalbox2).map((k, ind) =>
                    <div key={ind}><div>{k}</div>
                        {signals.signalbox2[k].map((data, index) => {
                        if(data.show === true){
                           return  (<Names key={index}
                            index={index}
                            data={data}
                            name={data.signal_name + ' ' + data.signal_number + ` (unit: ${data.signal_unit})`}
                            checkboxclick={checkboxclick}
                            obj={['signalbox2',k]} />)}})}
                    </div>
                )}</div></div>}
        </Fragment>)

}
/*
useEffect(() => {
    const labelcheck = { ...filterdata }
    signalList.forEach((sig) => {
        let same = true
        for(var i = 0; i < Search.length; i++){
            if(Search.charAt(i).toLowerCase() !== sig.name.charAt(i).toLowerCase()){
                same = false
                break;
            }
        }
        sig.state = same
        if(labelcheck[sig.path[0]][sig.path[1] + sig.path[2]][sig.path[3]].state !== same){
        labelcheck[sig.path[0]][sig.path[1] + sig.path[2]][sig.path[3]].state = same
        }
    })
    setDatafilter(labelcheck)
},[Search])
*/