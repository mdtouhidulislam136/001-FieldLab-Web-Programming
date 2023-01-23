import React from "react";
import {
  VictoryAxis,
  VictoryChart,
  VictoryLabel,
  VictoryLine,
  VictoryBrushContainer,
} from "victory";
import moment from "moment";

export default function MultiAxis({
  data1,
  data2,
  options,
  defTime,
  timeset,
  setTime,
  Axis1,
  Axis2,
  label,
  zeros,
}) {
  const timeToSeconds = (str) => {
    const tempStr = str.split(":");
    let ms = 0,
      m = 1000;
    if (tempStr.length === 4) {
      ms += parseInt(tempStr.pop(), 10);
    } else if (tempStr.length === 2) {
      m = 60;
    } else if (tempStr.length === 1) {
      m = 3600;
    }
    while (tempStr.length > 0) {
      ms += m * parseInt(tempStr.pop(), 10);
      m *= 60;
    }
    return ms;
  };

  const secondsToTime = (sec, accu) => {
    let tempnum = sec;
    let showtime = [0, 0, 0];
    if (tempnum >= 3600000) {
      showtime[0] = (tempnum - (tempnum % 3600000)) / 3600000;
      tempnum = tempnum % 3600000;
    }
    if (tempnum >= 60000) {
      showtime[1] = (tempnum - (tempnum % 60000)) / 60000;
      tempnum = tempnum % 60000;
    }
    if (tempnum >= 1000) {
      showtime[2] = (tempnum - (tempnum % 1000)) / 1000;
      tempnum = tempnum % 1000;
    }
    if (accu === "ms" && showtime[0] > 0) {
      showtime.shift();
      showtime.shift();
      showtime[1] = tempnum;
    }
    if (accu === "m" && showtime[0] > 0) {
      showtime.shift();
    }
    return showtime.join(":");
  };

  const timecheck = (time1, time2) => {
    const timespace = time2 - time1;
    const tickvalue = Math.round(timespace / 12);
    const returnvals = { start: time1, ticks: tickvalue };

    return returnvals;
  };

  const setTickValues = (data) => {
    const templist = [];
    let tempval = data.min;
    let fixed = 0;
    templist.push(tempval);
    while (tempval < data.max) {
      tempval = tempval + data.TickValue;
      if (tempval > -1 && tempval < 0) {
        fixed = zeros(-tempval);
        tempval = -Number(-tempval.toFixed(fixed + 1));
        templist.push(tempval);
      } else if (tempval < 1 && tempval > 0) {
        fixed = zeros(tempval);
        tempval = Number(tempval.toFixed(fixed + 1));
        templist.push(tempval);
      } else {
        templist.push(tempval);
      }
    }

    return templist;
  };

  const timeStampToMills = (data) => {
    const templist = [];
    data.forEach((element) => {
      const temptime = moment(element.time_stamp).format("HH:mm:ss:SSSS");
      templist.push({
        signal_value: element.signal_value,
        time_stamp: timeToSeconds(temptime),
      });
    });

    return templist;
  };

  const timeinterval = (start, end) => {
    const timearr = [];
    const timevals = timecheck(start, end);
    let grow = timevals.start;
    timearr.push(start);
    for (let i = 0; i < 11; i++) {
      grow += timevals.ticks;
      if (grow > start && grow < end) {
        timearr.push(grow);
      }
    }
    timearr.push(end);
    console.log(timearr);
    return timearr;
  };

  /*
    const unitnames = (name) => {
        const newname = name.charAt(0).toLowerCase();
        return newname;
   }*/

  const colours = [
    [
      "blue",
      "aqua",
      "cornflowerblue",
      "LightSeaGreen",
      "Cyan",
      "DarkSlateGray",
    ],
    ["red", "crimson", "maroon", "Coral", "Orange", "Gold"],
  ];
  const units = [
    "d",
    "c",
    "m",
    "μ",
    "n",
    "p",
    "f",
    "a",
    "z",
    "y",
    "da",
    "h",
    "k",
    "M",
    "G",
    "T",
    "P",
    "E",
    "Z",
    "Y",
  ];

  return (
    <div className="Chart_Time">
      <svg className="Chart" viewBox="0 0 465 360">
        {label && (
          <VictoryLabel text={label} x={220} y={10} textAnchor="middle" />
        )}
        <VictoryLabel y={50} x={35} text={options.ylabel} />
        <VictoryLabel y={50} x={385} text={options.ylabel2} />
        <g transform={"translate(0, 40)"}>
          <VictoryAxis
            crossAxis
            scale="linear"
            fixLabelOverlap={true}
            style={{
              axis: { stroke: "black", strokeWidth: 1 },
              ticks: { size: 5, stroke: "black", strokeWidth: 1 },
              tickLabels: { fontSize: 10, angle: -90, textAnchor: "end" },
            }}
            standalone={false}
            tickValues={timeinterval(timeset.start, timeset.end)}
            tickFormat={(e, index, ticks) => {
              if (index === 0) {
                return secondsToTime(e);
              } else if (index === ticks.length - 1) {
                return secondsToTime(e);
              } else if (
                Math.floor(ticks[index] / 3600000) >
                Math.floor(ticks[index - 1] / 3600000)
              ) {
                return secondsToTime(e);
              } else if (ticks[index] - ticks[index - 1] < 1000) {
                return secondsToTime(e, "ms");
              } else {
                return secondsToTime(e);
              }
            }}
          />
          <VictoryAxis
            dependentAxis
            key={"first"}
            standalone={false}
            style={{
              axis: { stroke: "blue" },
              ticks: { padding: -5, size: 5, stroke: "blue", strokeWidth: 1 },
              tickLabels: { fill: "blue", textAnchor: "end" },
            }}
            orientation={"left"}
            //tickCount={10}
            domain={[Axis1.min, Axis1.max]}
            tickValues={setTickValues(Axis1)}
            fixLabelOverlap={true}
            tickFormat={(e) => {
              if (e < 0.001 && e > 0) {
                return `${
                  Math.round(e * Math.pow(10, zeros(e / 1000))) / 1000
                } ${units[zeros(e) - 1]}`;
              } else if (e >= 1000) {
                return `${
                  Math.round(
                    (e / Math.pow(10, Math.floor(Math.log10(e)))) * 1000
                  ) / 1000
                } ${units[Math.floor(Math.log10(e)) + 9]}`;
              } else if (e > -0.001 && e < 0) {
                return `${
                  -Math.round(-e * Math.pow(10, zeros(-e / 1000))) / 1000
                } ${units[zeros(-e) - 1]}`;
              } else if (e <= -1000) {
                return `${
                  -Math.round(
                    (-e / Math.pow(10, Math.floor(Math.log10(-e)))) * 1000
                  ) / 1000
                } ${units[Math.floor(Math.log10(-e)) + 9]}`;
              } else {
                return e;
              }
            }}
          />
          {data1.signals.map((data, index) => (
            <VictoryLine
              key={index}
              standalone={false}
              data={timeStampToMills(data.data)}
              domain={{
                x: [timeset.start, timeset.end],
                y: [Axis1.min, Axis1.max],
              }}
              x={"time_stamp"}
              y={"signal_value"}
              style={{ data: { stroke: colours[0][index] } }}
            />
          ))}
          <VictoryAxis
            dependentAxis
            key={"second"}
            standalone={false}
            style={{
              axis: { stroke: "red" },
              ticks: { padding: -5, size: 5, stroke: "red", strokeWidth: 1 },
              tickLabels: { fill: "red", textAnchor: "start" },
            }}
            orientation={"right"}
            //tickCount={10}
            domain={[Axis2.min, Axis2.max]}
            tickValues={setTickValues(Axis2)}
            fixLabelOverlap={true}
            tickFormat={(e) => {
              if (e < 0.001 && e > 0) {
                return `${
                  Math.round(e * Math.pow(10, zeros(e / 1000))) / 1000
                } ${units[zeros(e) - 1]}`;
              } else if (e >= 1000) {
                return `${
                  Math.round(
                    (e / Math.pow(10, Math.floor(Math.log10(e)))) * 1000
                  ) / 1000
                } ${units[Math.floor(Math.log10(e)) + 9]}`;
              } else if (e > -0.001 && e < 0) {
                return `${
                  -Math.round(-e * Math.pow(10, zeros(-e / 1000))) / 1000
                } ${units[zeros(-e) - 1]}`;
              } else if (e <= -1000) {
                return `${
                  -Math.round(
                    (-e / Math.pow(10, Math.floor(Math.log10(-e)))) * 1000
                  ) / 1000
                } ${units[Math.floor(Math.log10(-e)) + 9]}`;
              } else {
                return e;
              }
            }}
          />
          {data2.signals2.map((data, index) => (
            <VictoryLine
              key={index}
              standalone={false}
              data={timeStampToMills(data.data)}
              domain={{
                x: [timeset.start, timeset.end],
                y: [Axis2.min, Axis2.max],
              }}
              x={"time_stamp"}
              y={"signal_value"}
              style={{ data: { stroke: colours[1][index] } }}
            />
          ))}
        </g>
      </svg>
      <div className="Timechart">
        Time Axis
        <VictoryChart
          padding={{ top: 0, left: 8, right: 8, bottom: 40 }}
          width={400}
          height={100}
          scale={{ x: "linear" }}
          containerComponent={
            <VictoryBrushContainer
              brushDimension="x"
              brushDomain={{ x: [timeset.start, timeset.end] }}
              onBrushDomainChange={(domain) =>
                setTime({ start: domain.x[0], end: domain.x[1] })
              }
            />
          }
        >
          <VictoryAxis
            crossAxis
            scale="linear"
            fixLabelOverlap={true}
            style={{
              axis: { stroke: "black", strokeWidth: 1 },
              ticks: { size: 5, stroke: "black", strokeWidth: 1 },
              tickLabels: { fontSize: 7, angle: -90, textAnchor: "end" },
            }}
            standalone={false}
            tickValues={timeinterval(defTime.start, defTime.end)}
            tickFormat={(e, index, ticks) => {
              if (index === 0) {
                return secondsToTime(e);
              } else if (index === ticks.length - 1) {
                return secondsToTime(e);
              } else if (
                Math.floor(ticks[index] / 3600000) >
                Math.floor(ticks[index - 1] / 3600000)
              ) {
                return secondsToTime(e);
              } else if (ticks[index] - ticks[index - 1] < 1000) {
                return secondsToTime(e, "ms");
              } else {
                return secondsToTime(e);
              }
            }}
          />
          {data1.signals.map((data, index) => (
            <VictoryLine
              key={index}
              standalone={false}
              data={timeStampToMills(data.data)}
              domain={{
                x: [defTime.start, defTime.end],
                y: [Axis1.min, Axis1.max],
              }}
              x={"time_stamp"}
              y={"signal_value"}
              style={{ data: { stroke: colours[0][index] } }}
            />
          ))}
          {data2.signals2.map((data, index) => (
            <VictoryLine
              key={index}
              standalone={false}
              data={timeStampToMills(data.data)}
              domain={{
                x: [defTime.start, defTime.end],
                y: [Axis2.min, Axis2.max],
              }}
              x={"time_stamp"}
              y={"signal_value"}
              style={{ data: { stroke: colours[1][index] } }}
            />
          ))}
        </VictoryChart>
      </div>
    </div>
  );
}
//<VictoryLabel y={390} x={10} text={`Aikaväli = klo: ${timeset.start} - klo: ${timeset.end}`}/>
