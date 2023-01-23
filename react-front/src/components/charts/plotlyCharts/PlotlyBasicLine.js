import React, {useState, useLayoutEffect}from 'react'
import Plot from 'react-plotly.js'

const refactorData = (data) => {
    const tempList = []
    data.signals1.forEach(d => {
        const xAxis = []
        const yAxis = []
        d.data.forEach(e => {
            xAxis.push(e.time_stamp)
            yAxis.push(e.signal_value)
        })
        const tempData = {
            x: xAxis,
            y: yAxis,
            type: 'scatter',
            name: d.name
        }
        if(data.signals2 !== undefined){tempData.name = tempData.name + " (Axis1)"}
        tempList.push(tempData)
    })
    if(data.signals2 !== undefined){
        data.signals2.forEach(d => {
            const xAxis = []
            const yAxis = []
            d.data.forEach(e => {
                xAxis.push(e.time_stamp)
                yAxis.push(e.signal_value)
            })
            const tempData = {
                x: xAxis,
                y: yAxis,
                type: 'scatter',
                name: d.name + " (Axis2)",
                yaxis: 'y2'
            }
            tempList.push(tempData)
        })

    }
    return tempList
}

const LayoutSettings = (options) => {

    if(options.sets === 2){
        return {
            width: 950,
            height: 800,
            title: `Robot Signals`,
            yaxis: {title: options.ylabel,
                    showgrid: false,
                    automargin: true},
            yaxis2: {
                title: options.ylabel2,
                overlaying: 'y',
                side: 'right',
                showgrid: false,
                automargin: true
            },
            showlegend: true,
            margin: {
                l: 55,
                r: 150,
                b: 100,
                t: 100
              },
              legend: {
                x: -0.05,
                y: -0.08,
                orientation: 'h'
              }
        }
    }
    else{
        return {
            width: 950,
            height: 800,
            title: `Robot Signals`,
            yaxis: {title: options.ylabel,
                    showgrid: false,
                    automargin: true},
            showlegend: true,
            margin: {
                l: 55,
                r: 150,
                b: 100,
                t: 100
              },
              legend: {
                x: -0.05,
                y: -0.08,
                orientation: 'h'
              }
        }
    }
}

export default function PlotlyBasicLine({ signaldata, options }){

    const [lineData, setLineData] = useState(refactorData(signaldata))
    const [lineLayout, setLineLayout] = useState(LayoutSettings(options))

    useLayoutEffect(() => {
        setLineData(refactorData(signaldata))
        setLineLayout(LayoutSettings(options))
    }, [signaldata])


    return (<Plot
          data={lineData}
          layout={lineLayout}
      />)



}