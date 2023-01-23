import React, { useState, createContext, useEffect } from 'react'
import { useFetch } from '../customHooks'


// Provides the project with required data
// For now offers static logData and randomly generated rngData for testing
// TODO: Wait for actual database to be ready and fetch data from there

// Note: context is a way to make project wide *global* variables and functions.
// It eliminates the need of using 3rd party liblaries like mobx or redux

// We might not need context for data, we could just use the imported log file or the custom useRngData on just the file we need
// but this way we have global shared and the data is same for sure

export const DataContext = createContext()

const DataContextProvider = (props) => {

    const [connectedToDb, setConnectedToDb] = useState(null)
    const [dataTable, setDataTable] = useState("gen3")
    const [loading, setLoading] = useState(null)
    const [tempdata, setTempData] = useState()

    const [Graph1Data, setGraph1Data] = useState({graphdata: {signals1:[], signals2:[]}, options: {}})
    const [Graph2Data, setGraph2Data] = useState({graphdata: {signals1:[], signals2:[]}, options: {}})
    const [Graph3Data, setGraph3Data] = useState({graphdata: {signals1:[], signals2:[]}, options: {}})
    const [Graph4Data, setGraph4Data] = useState({graphdata: {signals1:[], signals2:[]}, options: {}})

    const [options, setOptions] = useState({signals: null, update: false})
    //`http://localhost:8080/api/robots/${dataTable}/filter`
    const filterDataFromDb = useFetch(`https://kurru.student.tamk.cloud/api/robots/${dataTable}/filter`);

    useEffect(() => {
        if(loading === false){
        const updatedchartData = {signals1: [], signals2: []}
        tempdata.forEach(element => {
            if(element.axis === 1){
                updatedchartData.signals1.push(element)
            }
            else if(element.axis === 2){
                updatedchartData.signals2.push(element)
            }
        })
        let templist = {}
        switch (options.idkey)
        {
            case 'Graph1':
                templist = {...Graph1Data}
                templist = {graphdata: updatedchartData, options: options}
                setGraph1Data(templist)
                break;
            case 'Graph2':
                templist = {...Graph2Data}
                templist = {graphdata:  updatedchartData, options: options}
                setGraph2Data(templist)
                break;
            case 'Graph3':
                templist = {...Graph3Data}
                templist = {graphdata:  updatedchartData, options: options}
                setGraph3Data(templist)
                break;
            case 'Graph4':
                templist = {...Graph4Data}
                templist = {graphdata:  updatedchartData, options: options}
                setGraph4Data(templist)
                break;
            default:
                break;
        }
    }
    },[loading])

    const getDataRows = (params) => {
        const response = [];
        (async () => {
            try {
                for(let i = 0; i < params.length; i++){
                const res = await fetch(`https://kurru.student.tamk.cloud/api/robots/${dataTable}/${encodeURIComponent(params[i].city)}/${encodeURIComponent(params[i].place)}/${encodeURIComponent(params[i].machine)}/${encodeURIComponent(params[i].machine_type)}/${encodeURIComponent(params[i].machine_module)}/${encodeURIComponent(params[i].signal_name)}/${encodeURIComponent(params[i].signal_number)}/${encodeURIComponent(params[i].meas_name)}`);
                const resJson = await res.json();
                console.log('useFecth success:', resJson)
                    resJson.forEach((element, index) => {
                        if (element.signal_unit === "xyz") {
                            let value = resJson[index].signal_value.slice(1, resJson[index].signal_value.length - 2);
                            value = value.split(",");
                            resJson[index].signal_value = {
                                x: +(value[0]),
                                y: +(value[1]),
                                z: +(value[2])
                            }

                        }
                        else { resJson[index].signal_value = +(resJson[index].signal_value) }


                    })
                response.push({
                    name: params[i].signal_name + ' ' + params[i].signal_number,
                    data: resJson,
                    axis: params[i].axis
                })
            }
            } catch (err) {
                //console.log('useFecth failed:', err.message);
            }
            finally{
                setTempData(response);
                setLoading(false);

            }
        })();
    }


    useEffect(() => {
        if ( options.update === true) {
            setLoading(true)
            const newgraphdata = [...options.names]
            if(options.sets === 2){
                newgraphdata.push.apply(newgraphdata, options.names2)
            }
            getDataRows(newgraphdata)
        }
        options.update = false

    }, [options.update])

    // Changes the connectedToDb value according to the fetch try above.
    // Exposes it out of this context for UI usage etc
    useEffect(() => {
        if (filterDataFromDb.loading === false) {
            if (filterDataFromDb.error.state === true) {
                console.log('failed to connec to database', filterDataFromDb.error.message)
                setConnectedToDb(false)
            } else {
                setConnectedToDb(true)
                console.log('connected to database')
            }
        }
    }, [filterDataFromDb.error, filterDataFromDb.loading, filterDataFromDb.data])


    return (
        <DataContext.Provider
        value={{
        connectedToDb,
        setConnectedToDb,
        filterDataFromDb,
        setDataTable,
        dataTable,
        options,
        setOptions,
        Graph1Data,
        Graph2Data,
        Graph3Data,
        Graph4Data,
        loading}}>
        {props.children}
        </DataContext.Provider>
    )

}

export default DataContextProvider;
