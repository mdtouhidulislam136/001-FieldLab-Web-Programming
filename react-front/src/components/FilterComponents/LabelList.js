import React, {Fragment}from 'react'
import Labels from './Labels'

export default function LabelList(props){
    return(props.list.map((values, index) => {
        return (<Fragment key={values.name + '/' + index + "fragment"}>
        <Labels key={values.name + index + values.path[1]} name={values.name} state={values.state} path={values.path}  filterprops={values.filterlist} statemanager={props.statemanager}/>
        {props.sublist !== undefined && (
        <div className={"type-div"} key={values.path[1] + values.name}>
        <div key={values.path[1] + values.name + '/div'}>types:</div>
        <div key={values.path[1] + values.name + '/labels'}><LabelList list={props.sublist[values.filterlist[0][1]]} statemanager={props.statemanager}/></div></div>)}
        </Fragment>)
    }))
}
