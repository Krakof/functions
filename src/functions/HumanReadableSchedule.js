import React, { Component } from "react";

import store from "../schedule";
import { isArraysOfObjectsEqual, getTimeInFormat } from "../utils";

const week = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const timeFormat = "h:mm A";

class HumanReadableSchedule extends Component {
  getHumanReadableSchedule(schedule) {

    // temp object used to merge weekdays with the same working intervals;
    let temp = {
        range: [],
        days: []
      },
      result = [],
      count = 0;

    for (let day of week) {
      let dayWorkingHours =
        schedule[day] && schedule[day].length ? schedule[day] : ["Closed"]; // if no schedule for current weekday set as 'Closed'

      //check if working intervals of the day and previous day(s) are equals
      if (isArraysOfObjectsEqual(dayWorkingHours, temp.range)) {

        temp.days.push(day);

      } else {

        if (temp.range.length) {

          result.push(temp);
        }

        temp = {
          range: dayWorkingHours,
          days: [day]
        };
      }

      if (week.length - 1 === count++) {
        result.push(temp);
      }
    }

    return this.humanizeSchedule(result);
  }

  humanizeSchedule(timing) {

    return timing.map(({ range, days }) => {

      let workingHours = range.map(interval => {

        if (typeof interval !== "string") {

          return `${getTimeInFormat(interval.from, timeFormat)} - ${getTimeInFormat(interval.to, timeFormat)}`;
        }

        return interval;
      });

      let joinDays =
        days.length > 1 ? `${days[0]}-${days[days.length - 1]}` : days[0];

      return `${joinDays.toUpperCase()} : ${workingHours.join(" , ")}`;
    });
  }

  render() {
    const humanReadableSchedule = this.getHumanReadableSchedule(store.schedule);
    const view = humanReadableSchedule.map((item, idx) => (
      <li key={idx}>{item}</li>
    ));

    return (
      <div className={"schedule"}>
        <h3>getHumanReadableSchedule()</h3>
        <ul>{view}</ul>
      </div>
    );
  }
}

export default HumanReadableSchedule;
