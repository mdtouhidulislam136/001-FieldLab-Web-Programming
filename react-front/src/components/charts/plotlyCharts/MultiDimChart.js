import React from 'react'
import Plot from 'react-plotly.js'


// line chart made to display static non-changing data, WIP
/**
 * Charts built with Victory charts library
 * https://formidable.com/open-source/victory/docs/victory-chart/

 */

export default function MultiDimChart({ signaldata, options }) {


    const traces = signaldata.signals1.map((axis) => {
        const values = {xvals:[], yvals:[], zvals:[]}

        axis.data.forEach(element => {
            values.xvals.push(element.signal_value.x)
            values.yvals.push(element.signal_value.y)
            values.zvals.push(element.signal_value.z)
        });

        return {
         x: values.xvals,
         y: values.yvals,
         z: values.zvals,
         type: 'scatter3d',
         mode: 'lines',
         name: axis.name
        }
    })

    return (
        <Plot
          data={traces}
          layout={{
            width: 900,
            height: 800,
            title: `Robot Signals`
          }}
        />
      );

    }

