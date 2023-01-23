import React, {Fragment} from 'react'
import DropDown from './DropDown'
export default function MultiCatLabels(props){

    const proplist = []
    for(const prop in props.catlist){
        proplist.push(prop)
    }
    console.log("filter renderöity")
    return(proplist.map((e) => {
        return (props.catlist[e].map((c) => {
            if(c.state === true){
                return( <div key={c.filterlist[0][1]}>
                <div key={c.filterlist[0][1] + '/div'}>{c.filterlist[0][1]}</div>
                <div key={c.filterlist[0][1] + '/labels'}>{
                    c.categories.map((cat, ind) => {
                        return(<Fragment key={c.filterlist[0][1] + cat + ind}><DropDown rowlist={props.rowlist[c.filterlist[0][1]]} catrow={c} cat={cat} signals={props.signals} statemanager={props.statemanager}/></Fragment>)
                    })
                }</div></div>)
            }
        })
    )}))
}
