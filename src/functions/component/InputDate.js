import React, { Component } from "react";
import PropTypes from 'prop-types';
import { getWeekDayFullName } from "../../utils";


const propTypes = {
  week: PropTypes.array.isRequired,
  time: PropTypes.string.isRequired,
  day: PropTypes.string.isRequired,
  changeDate: PropTypes.func.isRequired
};

class InputDate extends Component {
  onDayChangeHandler = e => {
    this.props.changeDate(`${e.target.value} ${this.props.time}`);
  };

  onTimeChangeHandler = e => {
    const time = e.target.value || "00:00";
    this.props.changeDate(`${this.props.day} ${time}`);
  };

  daySelect() {
    const options = this.props.week.map(day => {
      return (
        <option key={day} value={day}>
          {getWeekDayFullName(day, "dddd")}
        </option>
      );
    });

    return (
      <div className="input-group mb-3">
        <select
          className="custom-select"
          value={this.props.day}
          onChange={this.onDayChangeHandler}
        >
          {options}
        </select>
      </div>
    );
  }

  render() {
    const daySelector = this.daySelect();

    return (
      <div className="input-group">
        {daySelector}
        <div className="input-group mb-3">
          <input
            type="time"
            className="form-control"
            onChange={this.onTimeChangeHandler}
            value={this.props.time}
          />
        </div>
      </div>
    );
  }
}

InputDate.propTypes = propTypes;

export default InputDate;
