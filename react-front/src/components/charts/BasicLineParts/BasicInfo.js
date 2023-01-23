import React from 'react'
import { VictoryLegend} from "victory";

export default function BasicInfo({data1, data2, set}) {



    const colours1 = ["red", "blue", "orange", "black", "yellow", "green"]
    const colours2 = [["blue", "aqua", "cornflowerblue"], ["red", "crimson", "maroon"]]

    if(set === 1)
    {
        return (<div className="DataInfo1">
        <VictoryLegend x={10} y={0} orientation="horizontal" data={data1.signals} itemsPerRow={3} colorScale={colours1} />
        </div>)
    }
    else{

        return (<div> <div className="DataInfo1">
        <VictoryLegend x={10} y={0} orientation="horizontal" data={data1.signals} itemsPerRow={3} colorScale={colours2[0]} style={{ labels: { fontSize: 10 } }} />
        </div>
        <div className="DataInfo2">
        <VictoryLegend x={10} y={0} orientation="horizontal" data={data2.signals2} itemsPerRow={3} colorScale={colours2[1]} style={{ labels: { fontSize: 10 } }} />
        </div></div> )
    }

}