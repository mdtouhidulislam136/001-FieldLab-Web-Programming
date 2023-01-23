import React, {Fragment} from 'react'
import LabelList from './LabelList'

export default function NormalLabels(props){

    const proplist = []
    for(const prop in props.catlist){
        proplist.push(prop)
    }
    return ( proplist.map((e) => {
              return (props.catlist[e].map((c, ind) => {
               if(c.state === true){
                return ( <Fragment key={c.filterlist[0][1] + c.name}>
                <div key={c.filterlist[0][1] + '/div'}>{c.filterlist[0][1]}</div>
                <div key={c.filterlist[0][1] + '/labels'} className={"list-div"}><LabelList
                key={c.filterlist[0][1] + ind}
                list={props.rowlist[c.filterlist[0][1]]}
                sublist={props.sublist}
                statemanager={props.statemanager}/></div>
                </Fragment>)
            }
        })
    )}))
}