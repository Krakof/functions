import React, { Component } from "react";
import HumanReadableSchedule from "./functions/HumanReadableSchedule";
import NextWorkingHours from "./functions/NextWorkingHours";
import "./App.scss";

class App extends Component {
  render() {
    return (
      <div className="App">
        <HumanReadableSchedule />
        <NextWorkingHours />
      </div>
    );
  }
}

export default App;
