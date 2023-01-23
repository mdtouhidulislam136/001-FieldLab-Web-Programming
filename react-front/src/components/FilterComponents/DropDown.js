import React, {useState}from 'react'
import LabelList from './LabelList'
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

export default function DropDown(props){
    const [drop, setDrop] = useState(false)
    const makelist = () => {
        const templist = []
        props.rowlist.forEach((e) => {
            if(props.signals[e.signalId].state === true && e.category === props.cat){
                templist.push(e)
            }
        })
        return templist
    }

    const newlist = makelist()

    if(newlist.length > 0){
    return(<div key={props.catrow.filterlist[0][1] + '/' + props.cat} className={"list-div"}>
    <ExpansionPanel expanded={drop} onChange={() => setDrop(!drop)}>
    <ExpansionPanelSummary
    expandIcon={<ExpandMoreIcon />}>
    {props.cat}
    </ExpansionPanelSummary>
    <ExpansionPanelDetails>
            <LabelList list={newlist} statemanager={props.statemanager}/>
    </ExpansionPanelDetails>
    </ExpansionPanel>
    </div>)
    }
    else{
        return(<></>)
    }


}

//<div onClick={() => setDrop(!drop)}>{props.cat}</div>