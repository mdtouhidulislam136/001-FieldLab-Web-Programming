import React, { useContext, memo} from 'react'
import { NavBar,  OptionsBar } from '../'
import { ChartsContainer, MultiDimChart, PlotlyBasicLine} from '../charts'
import { DataContext } from '../../contexts/DataContext'
import { CircularProgress } from '@material-ui/core';
import './MainPage.scss'

/**
 * Apps main view
 */


export default function MainPage() {

    const { Graph1Data, Graph2Data, Graph3Data, Graph4Data, options, loading } = useContext(DataContext)

    console.log("Main paige renderöity")
    const BuildChart = ({idKey, data}) => {
        if(idKey === options.idkey && loading === true){
            return <div className={"loading-div"}>
            Chart is loading
            <CircularProgress /></div>
        }
        else if(data.graphdata.signals1.length > 0 || data.graphdata.signals2.length > 0){

                if(data.options.chart === "xyz"){
                    return(
                    <MultiDimChart
                        key={idKey}
                        signaldata={data.graphdata}
                        options={data.options}/>
                        )
                }
                else{
                    return(
                    <PlotlyBasicLine
                        key={idKey}
                        signaldata={data.graphdata}
                        options={data.options}/>
                    )
                }

            }
            else{
                return(<></>)
            }
    }

    return (
        <div className={`container mainpage`}>
            <NavBar />
            <OptionsBar/>
            <ChartsContainer>
                <BuildChart key={"Graph1"} idKey={"Graph1"} data={Graph1Data} />
                <BuildChart key={"Graph2"} idKey={"Graph2"} data={Graph2Data}/>
                <BuildChart key={"Graph3"} idKey={"Graph3"} data={Graph3Data}/>
                <BuildChart key={"Graph4"} idKey={"Graph4"} data={Graph4Data}/>
            </ChartsContainer>
        </div >
    );
}




