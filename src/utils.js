import moment from "moment";

export const isArraysOfObjectsEqual = (arr1, arr2) => {
  if (arr1.length === arr2.length) {
    return arr1.every((elem, idx) => {
      return elem.from === arr2[idx].from && elem.to === arr2[idx].to;
    });
  }

  return false;
};

export const getTimeInFormat = (time, format) => {
  return time ? moment(time, format).format(format) : "";
};

export const getWeekDayFullName = (slug, format) => {
  return moment(slug, format).format(format);
}
