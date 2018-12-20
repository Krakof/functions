import React, { Component, Fragment } from "react";
import InputDate from "./component/InputDate";
import moment from "moment";
import "moment-timezone";
import store from "../schedule";
import { getTimeInFormat } from "../utils";

const week = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const { timeZone } = store;
const localTimeZone = moment.tz.guess();
const format12 = "h:mm A";
const format24 = "HH:mm";
const dateFormat = "ddd HH:mm";
const weekDayFormat = "dddd";
const initState = {
  today: "tue 16:45"
};

class NextWorkingHours extends Component {
  constructor(props) {
    super(props);

    this.state = initState;
    this.isStoreOpen = false;

    this.onDateChange = this.onDateChange.bind(this);
  }

  onDateChange(today) {
    this.setState({ today });
  }

  getHumanReadableNextWorkingHours(schedule) {
    let message;

    this.isStoreOpen = this.isInWorkingHours(schedule);

    if (!this.isStoreOpen) {
      message = this.getTimeToOpen(schedule, this.state.today);
    }

    return "Store " + (message || "is open");
  }

  isInWorkingHours(schedule) {
    const today = moment(this.state.today, dateFormat).tz(timeZone);
    const todayDayName = today.format("ddd").toLowerCase();
    const currDayWorkingHours = schedule[todayDayName] || [];

    //iterates through the working intervals of selected day
    for (let interval of currDayWorkingHours) {
      const workStart = moment(`${todayDayName} ${interval.from}`, dateFormat).tz(timeZone, true);
      const workEnd = moment(`${todayDayName} ${interval.to}`, dateFormat).tz(timeZone, true);

      //check if selected time is in working interval
      if (today.isSameOrAfter(workStart) && today.isBefore(workEnd)) {
        return true;
      }
    }

    return false;
  }

  getTimeToOpen(schedule, today) {
    const todayToStoreTimezone = moment(today, dateFormat).tz(timeZone);
    const todayName = todayToStoreTimezone.format("ddd").toLowerCase();

    //check if we have schedule for selected day at the server response
    if (schedule[todayName]) {

      //iterates through the working intervals of selected day
      for (let interval of schedule[todayName]) {
        const workStart = moment(`${todayName} ${interval.from}`, dateFormat).tz(timeZone, true);

        //check if today selected time is earlier than open hour
        if (todayToStoreTimezone.isBefore(workStart)) {
          //calculate time left to open in minutes
          let timeToWait = moment.duration(workStart.diff(todayToStoreTimezone, "minutes"), "minutes");

          return `will open ${timeToWait.humanize(true)}.`;
        }
      }
    }

    //if selected time is not in working intervals, looking for next working day
    const nextWorkingDayName = this.getNextWorkingDay(schedule, todayName);

    //convert the result to human readable format
    return this.humanizeNextWorkingDay(schedule, nextWorkingDayName, today);
  }

  getNextWorkingDay(schedule, todayName) {
    let nextDayNumber = week.indexOf(todayName) + 1;
    let count = 0;

    //iterates through the weekdays until we find not-empty schedule from server response
    while (
      !(schedule[week[nextDayNumber]] && schedule[week[nextDayNumber]].length)
    ) {
      //return an empty string if all days are checked and the schedule wasn't found
      if (count++ >= week.length) {
        return "";
      }

      nextDayNumber = ++nextDayNumber % week.length; //move to next day
      // count++;
    }

    return week[nextDayNumber];
  }

  humanizeNextWorkingDay(schedule, nextDayName, today) {

    if (nextDayName) {

      let whenOpenPhrase;
      const nextWorkingDayStart = schedule[nextDayName][0]["from"]; //an opening hour of the next working day
      const nextWorkingDay = moment(`${nextDayName} ${nextWorkingDayStart}`, dateFormat).tz(timeZone, true);
      const nextWorkingDayToLocalTimezone = nextWorkingDay.tz(localTimeZone);
      const nextWorkingDayFullName = nextWorkingDayToLocalTimezone.format(weekDayFormat);
      const todayDate = moment(today, dateFormat);
      const todayDayName = todayDate.format("ddd").toLowerCase();

      //generate store status string depends on timezone
      switch (true) {
        //if 'next day' is the same with today
        case (todayDate.isBefore(nextWorkingDayToLocalTimezone) && todayDayName === nextDayName):
          whenOpenPhrase = moment
            .duration(nextWorkingDayToLocalTimezone.diff(todayDate, "minutes"), "minutes")
            .humanize(true);
          break;

          //if next day is tomorrow
        case week.indexOf(todayDayName) + 1 === week.indexOf(nextDayName):
          whenOpenPhrase = " tomorrow ";
          break;

          //if next day is on next week
        case week.indexOf(todayDayName) >= week.indexOf(nextDayName):
          whenOpenPhrase = ` on next ${nextWorkingDayFullName} `;
          break;
        default:
          whenOpenPhrase = ` on ${nextWorkingDayFullName} `;
          break;
      }

      return (
        "will open " + whenOpenPhrase + ` at ${nextWorkingDayToLocalTimezone.format(format12)}.`
      );
    }

    return "doesn't have any open hours";
  }

  render() {
    const storeStatus = this.getHumanReadableNextWorkingHours(store.schedule);
    const dayName = getTimeInFormat(this.state.today, "ddd").toLowerCase();
    const time = getTimeInFormat(this.state.today, format24);
    const storeTime = moment(this.state.today, "ddd HH:mm")
      .tz(timeZone)
      .format("dddd h:mm A");

    return (
      <Fragment>
        <h3>isInWorkingHours() and getHumanReadableNextWorkingHours()</h3>
        <InputDate
          week={week}
          day={dayName}
          time={time}
          changeDate={this.onDateChange}
        />
        <div>isInWorkingHours =>{`${this.isStoreOpen}`}</div>
        <div>
          {storeStatus} <i className={"store-time"}>Store local time: {storeTime}</i>
        </div>
      </Fragment>
    );
  }
}

export default NextWorkingHours;
