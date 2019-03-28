/* jshint strict: global, esversion: 6, devel: true */
"use strict";

Object.prototype.podstaw = function(dane) {
  let nowySzablon = this;
  Object.getOwnPropertyNames(dane).forEach(property => {
    nowySzablon = nowySzablon.replace("{" + property + "}", dane[property]);
  });

  return nowySzablon;
};

let szablon =
  '<table border="{border}">' +
  "  <tr><td>{first}</td><td>{last}</td></tr>" +
  "</table>";

let dane = {
  first: "Jan",
  last: "Kowalski",
  pesel: "97042176329",
  border: "10px"
};

console.log(szablon.podstaw(dane));
