const app = angular
  .module("footballApp", ["ngRoute"])
  .config(function ($routeProvider) {
    "use strict";

    const matchdayRoute = {
      controller: "footballTable as ft",
      templateUrl: "app/views/football-table.html",
      resolve: {
        yearFifteenData: function (footballData) {
          return footballData.getyearFifteenData();
        },
        yearSixteenData: function (footballData) {
          return footballData.getyearSixteenData();
        }
      }
    };

    const teamwiseRoute = {
      controller: "teamwiseResults",
      templateUrl: "teamwise.html"
    };

    $routeProvider
      .when("/matchday", matchdayRoute)
      .when("/teamwise", teamwiseRoute)
      .otherwise("/matchday", {
        templateUrl: "football-table.html"
      });
  });

function footballTable(yearFifteenData, yearSixteenData) {
  this.yearFifteenData = yearFifteenData;
  this.yearSixteenData = yearSixteenData;
  this.matchdays = [];
  this.years = ["2015", "2016"];
  this.results = [];

  for (let index = 0; index < yearFifteenData.rounds.length; index++) {
    this.matchdays.push(yearFifteenData.rounds[index].name);
  }

  this.selectedYear = this.years[0];
  this.selectedMatchday = this.matchdays[0];

  this.updateMatchday = function () {
    this.results = _.find(this.yearFifteenData.rounds, {
      name: this.selectedMatchday
    }).matches;
  };
  console.log(this.results);
}

app.controller("footballTable", footballTable);