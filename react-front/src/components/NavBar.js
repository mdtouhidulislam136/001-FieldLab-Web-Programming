import React, {  useRef, useContext , useState} from 'react';
import { AppBar, Toolbar, Typography } from '@material-ui/core';
import { useClock } from '../customHooks'
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { DataContext } from '../contexts/DataContext'
import './NavBar.scss'

export default function Navbar() {

    // PUT LINK FOR DOCUMENTATION HERE OR REMOVE IT IF UNNECESSARY.
    //const documentationLink = "https://tuni-my.sharepoint.com/:w:/r/personal/jesse_ronkko_tuni_fi/Documents/innovaatioprojekti/Innovaatioraportti_ohje_roboprojekti.docx?d=wfbbaec845ed14aefb04433fb72bdc0ce&csf=1&web=1&e=zjxsO7"

    const time = useClock();

    // Target is DOM Element where Popover will be anchored to.
    //const [target, setTarget] = useState(null);
    //const open = Boolean(target);
    const ref = useRef(null);
    //const id = open ? 'navbar__popover' : undefined;

    /**
     * Click handlers for opening / closing user utility popover
     */
    /*const handleClick = (event) => {
        setTarget(event.currentTarget);
    };

    const handleClose = () => {
        setTarget(null);
    };


    /**
     * Has Material-ui components & icon. For example https://material-ui.com/components/popover
     */

     const {setDataTable, dataTable, connectedToDb ,setConnectedToDb } = useContext(DataContext)
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

    const dbConnectionStatus = connectedToDb === null ? 'Connecting...' : connectedToDb ? 'Online' : 'Offline'

    return (
        <div ref={ref} className="navbar">
            <AppBar position="static" color='transparent'>
                <Toolbar>
                    <Typography className='navbar__title' variant="h6">Fieldlab</Typography>
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
                            <input type="text" value={tablename} onChange={e => setTableName(e.target.value)}></input>
                            <button onClick={e => handleSelect("2")}>Fetch</button>
                        </div>
                    <Typography className='navbar__connectionStatus' variant='subtitle1'>{dbConnectionStatus}</Typography>
                    <Typography variant='h6'>{time}</Typography>
                    <AccountCircleIcon className="navbar__popoverIcon" />
                </Toolbar>
            </AppBar>
        </div>

    );
}

/*

*/