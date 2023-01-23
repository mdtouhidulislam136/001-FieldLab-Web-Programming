import React, {useState, useContext, useEffect} from 'react';
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Options from './Options/options'
import OptionsFilter from './OptionsFilter'
import { DataContext } from '../contexts/DataContext'
import './OptionsBar.scss'
import './FilterPanel.scss'
//import { red } from '@material-ui/core/colors';



export default function OptionsBar() {

    const [filtered, setFiltered] = useState(null)
    const {filterDataFromDb} = useContext(DataContext)
    useEffect(() => {
        if(filterDataFromDb.loading === true){
            setFiltered(null)
        }
    },[filterDataFromDb.loading])

    return (
        <div className="optionsbar">
            <div className="optionsbar__filter-div">
            <h3>Signal Filters</h3>
            {(filterDataFromDb.loading === false && filterDataFromDb.error.state === false) &&
                     <OptionsFilter
                     setFiltered={setFiltered}
                     DbFilter={filterDataFromDb.data}/>}
            </div>
            <div className="optionsbar__signals-div">
            <ExpansionPanel disabled={(filtered !== null && filterDataFromDb.loading === false && filterDataFromDb.error.state === false) ? false : true}>
                <ExpansionPanelSummary
                    id="additional-actions2-header"
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="additional-actions2-content">
                    <h5>Pick Signals</h5>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails className="optionsbar__signals-div__panel" >
                    {(filtered !== null && filterDataFromDb.loading === false && filterDataFromDb.error.state === false) && <Options filtered={filtered}/>}
                </ExpansionPanelDetails>
            </ExpansionPanel>
            </div>
        </div>
    );
}
/*
            <ExpansionPanel >
                <ExpansionPanelSummary
                    id="additional-actions1-header"
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="additional-actions1-content">
                    <h5>Filter Signals</h5>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails className="optionsbar__filter-div__panel">
                    {(filterDataFromDb.loading === false && filterDataFromDb.error.state === false) &&
                     <OptionsFilter
                     setFiltered={setFiltered}
                     DbFilter={filterDataFromDb.data}/>}
                </ExpansionPanelDetails>
            </ExpansionPanel>
*/