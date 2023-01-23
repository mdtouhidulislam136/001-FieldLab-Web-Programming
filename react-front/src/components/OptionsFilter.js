import React, { useState, useEffect } from 'react';
import './FilterPanel.scss'
import { filterBuilder, NormalLabels, MultiCatLabels, LabelList } from './FilterComponents'
import SearchIcon from '@material-ui/icons/Search';
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';


export default function OptionsFilter({ setFiltered, DbFilter }) {

    const [Search, setSearch] = useState("")

    const builSearchList = (data) => {
        const tempsign = []
        for (const key in data) {
            data[key].forEach(e => {
                tempsign.push({ name: e.name, state: e.state, path: e.path })
            })
        }
        return tempsign

    }

    const [filterdata, setDatafilter] = useState(filterBuilder(DbFilter))
    const [signalList, setSignalList] = useState(builSearchList(filterdata.signals))

    useEffect(() => {
        setDatafilter(filterBuilder(DbFilter))
        setSignalList(builSearchList(filterdata.signals))
        setSearch("")
    }, [DbFilter])

    const sendfilterdata = () => {

        const filterlist = []
        const filtered_data = {}

        const citieslist = []
        for (const prop in filterdata.cities) {
            citieslist.push(prop)
        }

        citieslist.forEach(cl => {
            filterdata.cities[cl].forEach((c) => {
                filterdata.places[c.filterlist[0][1]].forEach((p) => {
                    filterdata.machines[p.filterlist[0][1]].forEach((m) => {
                        filterdata.types[m.filterlist[0][1]].forEach((t) => {
                            filterdata.modules[t.filterlist[0][1]].forEach((mod) => {
                                filterdata.measure[mod.filterlist[0][1]].forEach((mes) => {
                                    filterdata.signals[mes.filterlist[0][1]].forEach((sig) => {
                                        if (sig.state === true) {
                                            filterlist.push({
                                                city: c.name,
                                                place: p.name,
                                                machine: m.name,
                                                machine_type: t.name,
                                                machine_module: mod.name,
                                                meas_name: mes.name,
                                                signal_name: sig.name,
                                                propname: sig.path[1]
                                            })
                                        }

                                    })

                                })
                            })
                        })
                    })
                })
            })
        })

        filterlist.forEach(p => { filtered_data[p.propname] = [] });
        filterlist.forEach(d => {
            const filter = DbFilter.filter((f) => f.city === d.city && f.place === d.place && `${f.machine_type} ${f.machine_number}` === d.machine_type
                && f.machine_module === d.machine_module && f.signal_name === d.signal_name && f.meas_name === d.meas_name)
            filter.forEach((fil) => {
                filtered_data[d.propname].push({ city: fil.city, place: fil.place, machine: fil.machine, machine_type: fil.machine_type, machine_module: fil.machine_module, signal_name: d.signal_name, signal_number: fil.signal_number, meas_name: d.meas_name, signal_unit: fil.signal_unit, isChecked: false })
            })
        })
        setFiltered({ ...filtered_data })
    }

    const statemanager = (path, filterprops) => {

        const labelcheck = { ...filterdata }
        labelcheck[path[0]][path[1] + path[2]][path[3]].state = !labelcheck[path[0]][path[1] + path[2]][path[3]].state
        if (filterprops !== null) {
            if (labelcheck[path[0]][path[1] + path[2]][path[3]].state === false) {
                filterprops.forEach(element => {
                    labelcheck[element[0]][element[1]].forEach(val => {
                        if (val.state === true) {
                            val.state = false
                        }

                    })
                })
            }
            else if (labelcheck[path[0]][path[1] + path[2]][path[3]].state === true) {
                filterprops.forEach(element => {
                    labelcheck[element[0]][element[1]].forEach(val => {
                        if (val.state === false) {
                            val.state = true
                        }
                    })
                })
            }
        }
        setDatafilter({ ...labelcheck })
    }

    useEffect(() => {
        const labelcheck = { ...filterdata }
        signalList.forEach((sig) => {
            let same = true
            for (var i = 0; i < Search.length; i++) {
                if (Search.charAt(i).toLowerCase() !== sig.name.charAt(i).toLowerCase()) {
                    same = false
                    break;
                }
            }
            sig.state = same
        })
        setDatafilter(labelcheck)
    }, [Search])

    const deselect = () => {
        const templist = { ...filterdata.signals }
        for (const prop in templist) {
            templist[prop].forEach((e) => {
                if (e.state === true && signalList[e.signalId].state === true) {
                    e.state = false
                }
            })
        }
        setDatafilter({ ...filterdata, signals: templist })
    }
    const selectAll = () => {
        const templist = { ...filterdata.signals }
        for (const prop in templist) {
            templist[prop].forEach((e) => {
                if (e.state === false && signalList[e.signalId].state === true) {
                    e.state = true
                }
            })
        }
        setDatafilter({ ...filterdata, signals: templist })

    }

    const CityDiv = (props) => {
        const cities = []
        for (const prop in props.catlist) {
            cities.push(props.catlist[prop][0])
        }
        return (<LabelList list={cities} statemanager={statemanager} />)
    }



    return (

        <div className="normalfilters">
            <div>
                <ExpansionPanel>
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}>
                        City
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails className={"city-div"}>
                        <CityDiv catlist={filterdata.cities} />
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            </div>
            <div>
                <ExpansionPanel>
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}>
                        Place
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails className={"place-div"}>
                        <NormalLabels catlist={filterdata.cities} rowlist={filterdata.places} statemanager={statemanager} />
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            </div>
            <div>
                <ExpansionPanel>
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}>
                        Machine
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails className={"machine-div"}>
                        <NormalLabels catlist={filterdata.places} rowlist={filterdata.machines} sublist={filterdata.types} statemanager={statemanager} />
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            </div>
            <div>
                <ExpansionPanel>
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}>
                        Module
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails className={"module-div"}>
                        <NormalLabels catlist={filterdata.types} rowlist={filterdata.modules} statemanager={statemanager} />
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            </div>
            <div>
                <ExpansionPanel>
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}>
                        Measure
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails className={"measure-div"}>
                        <NormalLabels catlist={filterdata.modules} rowlist={filterdata.measure} statemanager={statemanager} />
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            </div>
            <div className="search_signals-div">
                <ExpansionPanel>
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}>
                        Signal
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails className={"search_signals-div"}>
                        <div>
                            <SearchIcon style={{ fontSize: 18 }} />
                            <input value={Search} onChange={(e) => { setSearch(e.target.value) }}></input>
                            <button onClick={() => selectAll()}>Select all</button>
                            <button onClick={() => deselect()}>Deselect all</button>
                            </div>
                        <div className={"signal-div"}>
                            <MultiCatLabels catlist={filterdata.measure} rowlist={filterdata.signals} signals={signalList} statemanager={statemanager} />
                        </div>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            </div>
            <button className={"filter-apply"} onClick={() => sendfilterdata()}>Apply filter</button>
        </div>
    )
}
