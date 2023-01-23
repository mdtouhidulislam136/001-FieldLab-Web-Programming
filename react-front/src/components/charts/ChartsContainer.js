import React from 'react';
//import { Typography, Popover, Card, CardContent } from '@material-ui/core'

// component that renders it's children with functionality to select the chart to focus
// this component is still very barebones and will be further developed later
export default function ChartsContainer({ children }) {
    //const [target, setTarget] = useState(null);
    //const [selectedChartId, setSelectedChartId] = useState(null); // state to hold the id of clicked/selected chart
    //const ref = useRef(null); // reference for selectedChart

    /*
    const handleClose = () => {
        setTarget(null);
        setSelectedChartId(null)
    };
    */

    /*const handleChartClick = (event, id) => {
        selectedChartId === null && setSelectedChartId(id)
        setTarget(event.currentTarget);
    }*/

    // Non-selected chart
    const chart = (chart) => (
        <div key={chart.key} className='graph' >
            {chart}
        </div >
    )

    //eventhandler not currently in use
    // onClick={(event) => handleChartClick(event, chart.key)}

    // Handless the selected chart effects
    // const selectedChart = (chart) => (
    //     <Popover
    //         key={chart.key}
    //         className="graph__popover"
    //         open={Boolean(target)}
    //         anchorEl={target}
    //         onClose={handleClose}
    //         anchorReference="anchorPosition"
    //         anchorPosition={{ top: 100, left: 100 }}
    //     >
    //         <div className='graph__selected'>
    //             <Typography className='graph__selected--hint' variant='h6'>Press outside of graph to close</Typography>
    //             <div className='graph__selected--chart' ref={ref}>
    //                 {chart}
    //             </div>
    //         </div>
    //         {/* FILTER BOX DOES NOT HAVE TO BE A CARD COMPONENT */}
    //         <Card className="graph__selected--card">
    //             <CardContent>
    //                 <Typography>Filter stuff here</Typography>
    //             </CardContent>
    //         </Card>
    //     </Popover>
    // )

    return (
        <section className="graphs">
            {children
                ? children.length > 0
                    ? children.map((c) => chart(c))
                    : chart(children)
                : <div>No charts given</div>}
        </section>
    );
}
//=> c.key === selectedChartId ? selectedChart(c) :
// : children.key === selectedChartId ? selectedChart(children)
