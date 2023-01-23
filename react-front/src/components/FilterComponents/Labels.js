import React from 'react'

export default function Labels(props){
   return (
        <>
        <label>
            <input type="checkbox" checked={props.state} onChange={() => props.statemanager(props.path, props.filterprops)} />
            {props.name}
        </label>
        </>
    )
}