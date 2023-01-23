import React, { useState, useMemo } from "react";
import {
  SingleAxis,
  MultiAxis,
  BasicInfo,
  SingleOptions,
  MultiOptions,
} from "./BasicLineParts";
//import { blue } from '@material-ui/core/colors';
import "./BasicLineChart.scss";
import moment from "moment";

// line chart made to display static non-changing data, WIP
/**
 * Charts built with Victory charts library
 * https://formidable.com/open-source/victory/docs/victory-chart/

 */

export default function BasicLineChart({ signaldata, options }) {
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

  const [Axis1, SetAxis1] = useState();
  const [Axis2, SetAxis2] = useState();
  const [timeset, SetTimeset] = useState();

  const unique = (data) => {
    const temparray = [];
    data.forEach((element) => {
      temparray.push({ name: element.name, data: [...element.data] });
    });
    return temparray;
  };
  const zeros = (n) => {
    let i = 0;
    let tempnum = n;
    if (tempnum < 1 && tempnum > 0) {
      while (tempnum < 1) {
        tempnum = tempnum * 10;
        i++;
      }
    } else {
      i = Math.floor(Math.log10(tempnum));
    }

    return i;
  };

  const Tick = (data, multiplier) => {
    let temptick = 0;
    if (data < 1 && data > 0) {
      if (
        data * Math.pow(10, multiplier) >= 0 &&
        data * Math.pow(10, multiplier) <= 2
      ) {
        temptick = 0.2 / Math.pow(10, multiplier);
      } else if (
        data * Math.pow(10, multiplier) >= 3 &&
        data * Math.pow(10, multiplier) <= 5
      ) {
        temptick = 0.5 / Math.pow(10, multiplier);
      } else if (
        data * Math.pow(10, multiplier) >= 6 &&
        data * Math.pow(10, multiplier) <= 10
      ) {
        temptick = 1 / Math.pow(10, multiplier);
      }
    } else {
      if (
        data / Math.pow(10, multiplier) >= 0 &&
        data / Math.pow(10, multiplier) <= 2
      ) {
        temptick = 0.2 * Math.pow(10, multiplier);
      } else if (
        data / Math.pow(10, multiplier) >= 3 &&
        data / Math.pow(10, multiplier) <= 5
      ) {
        temptick = 0.5 * Math.pow(10, multiplier);
      } else if (
        data / Math.pow(10, multiplier) >= 6 &&
        data / Math.pow(10, multiplier) <= 10
      ) {
        temptick = 1 * Math.pow(10, multiplier);
      }
    }
    return temptick;
  };

  const Axisvalues = (array) => {
    let roundedMax = 0;
    let roundedMin = 0;
    let MaxMulti = 0;
    let MinMulti = 0;
    let tickvalue = 0;

    const maxvalue = Math.max(
      ...array.map((datapoint) =>
        Math.max(...datapoint.data.map((p) => p.signal_value))
      )
    );
    if (maxvalue > 0) {
      MaxMulti = zeros(maxvalue);
      if (maxvalue > 0 && maxvalue < 1) {
        roundedMax =
          Math.ceil(maxvalue * Math.pow(10, MaxMulti)) / Math.pow(10, MaxMulti);
      } else if (MaxMulti === 0) {
        roundedMax = Math.ceil(maxvalue);
      } else {
        roundedMax =
          Math.ceil(maxvalue / Math.pow(10, MaxMulti)) * Math.pow(10, MaxMulti);
      }
    }

    const minvalue = Math.min(
      ...array.map((datapoint) =>
        Math.min(...datapoint.data.map((p) => p.signal_value))
      )
    );

    if (minvalue < 0) {
      MinMulti = zeros(-minvalue);
      if (-minvalue > 0 && -minvalue < 1) {
        roundedMin =
          -Math.ceil(-minvalue * Math.pow(10, MinMulti)) /
          Math.pow(10, MinMulti);
      } else if (MinMulti === 0) {
        roundedMin = -Math.ceil(-minvalue);
      } else {
        roundedMin = -(
          Math.ceil(-minvalue / Math.pow(10, MinMulti)) * Math.pow(10, MinMulti)
        );
      }
    }

    if (roundedMax >= -roundedMin) {
      tickvalue = Tick(roundedMax, MaxMulti);
      if (-roundedMin < tickvalue && -roundedMin !== 0) {
        roundedMin = -tickvalue;
      }
    } else if (roundedMax < -roundedMin) {
      tickvalue = Tick(-roundedMin, MinMulti);
      if (roundedMax < tickvalue && roundedMax !== 0) {
        roundedMax = tickvalue;
      }
    }

    return { max: roundedMax, min: roundedMin, TickValue: tickvalue };
  };
  const getdeftime = () => {
    const templist = [];
    let startsec = 0;
    let endsec = 0;
    signaldata.signals1.forEach((element) => {
      startsec = timeToSeconds(
        moment(element.data[0].time_stamp).format("HH:mm:ss:SSS")
      );
      endsec = timeToSeconds(
        moment(element.data[element.data.length - 1].time_stamp).format(
          "HH:mm:ss:SSS"
        )
      );
      templist.push({ start: startsec, end: endsec });
    });
    if (signaldata.signals2 !== undefined && signaldata.signals2.length > 1) {
      signaldata.signals2.forEach((element) => {
        startsec = timeToSeconds(
          moment(element.data[0].time_stamp).format("HH:mm:ss:SSS")
        );
        endsec = timeToSeconds(
          moment(element.data[element.data.length - 1].time_stamp).format(
            "HH:mm:ss:SSS"
          )
        );
        templist.push({ start: startsec, end: endsec });
      });
    }
    const endtime = Math.max(...templist.map((tend) => tend.end));
    const starttime = Math.min(...templist.map((tend) => tend.start));
    return { start: starttime, end: endtime };
  };
  /*
    new Date(Math.max(...templist.map((datapoint) => Math.max(...datapoint.data.map((p) => new Date(p.time_stamp).getTime())))))
    new Date(Math.min(...templist.map((datapoint) => Math.min(...datapoint.data.map((p) => new Date(p.time_stamp).getTime())))))
    */

  const default_time = getdeftime();

  useMemo(() => {
    if (options.sets === 2) {
      SetAxis2(Axisvalues(signaldata.signals2));
    }
    SetAxis1(Axisvalues(signaldata.signals1));
    SetTimeset(getdeftime());
  }, [signaldata.signals1, signaldata.signals2]);

  const functions = (set) => {
    if (set === 1) {
      const tempfunc = {
        SetAxis1,
        SetTimeset,
      };
      return tempfunc;
    } else if (set === 2) {
      const tempfunc = {
        SetAxis1,
        SetAxis2,
        SetTimeset,
      };
      return tempfunc;
    }
  };

  const default1 = {
    signals: unique(signaldata.signals1),
    default_Axis: Axisvalues(signaldata.signals1),
  };

  if (options.sets === 1) {
    return (
      <section className="BasicLineChart">
        <SingleOptions
          func={functions(options.sets)}
          data1={default1}
          def_time={default_time}
        />
        <SingleAxis
          data1={default1}
          timeset={timeset}
          defTime={default_time}
          setTime={SetTimeset}
          options={options}
          Axis={Axis1}
          zeros={zeros}
          label={"Robotsignals"}
        />
        <BasicInfo data1={default1} set={options.sets} />
      </section>
    );
  } else if (options.sets === 2) {
    const default2 = {
      signals2: unique(signaldata.signals2),
      default_Axis: Axisvalues(signaldata.signals2),
    };

    return (
      <section className="BasicLineChart">
        <MultiOptions
          func={functions(options.sets)}
          data1={default1}
          data2={default2}
          def_time={default_time}
        />
        <MultiAxis
          data1={default1}
          data2={default2}
          defTime={default_time}
          setTime={SetTimeset}
          timeset={timeset}
          options={options}
          Axis1={Axis1}
          Axis2={Axis2}
          zeros={zeros}
          label={"Robotsignals"}
        />
        <BasicInfo data1={default1} data2={default2} set={options.sets} />
      </section>
    );
  }
}

//  {(dataset2 != undefined || dataset2.lenght < 1) ? <MultiAxis data1={dataset1} data2={dataset2} options={options} label={label}/> : }
