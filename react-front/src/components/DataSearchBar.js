import React, {useState, useContext} from 'react';
import { DataContext } from '../contexts/DataContext'
import './DataSearchBar.scss'



export default function DataSearchBar() {

    const {setDataTable, dataTable, setConnectedToDb } = useContext(DataContext)
    const [table, setTable] = useState("gen3")
    const [tablename, setTableName] = useState("")

    const handleSelect = (button) => {
    if(isNaN(parseInt(tablename[0])) === true){
        if(button === "1" && table !== dataTable){
            setDataTable(table)
            setConnectedToDb(null)
        }
        else if(button === "2" && tablename !== dataTable){
            if(tablename !== "gen1"){
            setDataTable(tablename)
            setConnectedToDb(null)
            }
            else{
                alert("Table is no longer used for data visualization")
            }
        }
    }
    else{
        alert("Table name can't start with number")
    }

    }
    return (
        <div className="Searchpanel">
            <div className="info">
            Datatable selection
            </div>
            <div className="SearchTable">
            Select datatable
                <select value={table} onChange={e => setTable(e.target.value)}>
                    <option value={"gen2"}>gen2</option>
                    <option value={"gen3"}>gen3</option>
                    <option value={"gen4"}>gen4</option>
                </select>
                <button onClick={e => handleSelect("1")}>Fetch</button>
            </div>
            <div className="SearchField">
                   Input datatable name
                   <input type="text" value={tablename}  onChange={e => setTableName(e.target.value)}></input>
                   <button onClick={e => handleSelect("2")}>Fetch</button>

            </div>

        </div>
    );
}