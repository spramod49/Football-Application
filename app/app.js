const app = angular
  .module("footballApp", ["ngRoute"])
  .config(function($routeProvider) {
    "use strict";

    const matchdayRoute = {
      controller: "footballTable as ft",
      templateUrl: "app/views/football-table.html",
      resolve: {
        yearFifteenData: function(footballData) {
          return footballData.getyearFifteenData();
        },
        yearSixteenData: function(footballData) {
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
      .when("/teamwise", teamwiseRoute);
  });

function footballTable(yearFifteenData, yearSixteenData) {
  this.yearFifteenData = yearFifteenData;
  this.yearSixteenData = yearSixteenData;
  this.matchdays = [];
  this.years = ["2015", "2016"];
  this.homeTeam = null;
  this.awayTeam = null;

  for (let index = 0; index < yearFifteenData.rounds.length; index++) {
    this.matchdays.push(yearFifteenData.rounds[index].name);
  }

  this.selectedYear = this.years[0];
  this.selectedMatchday = this.matchdays[0];

  // console.log(this.yearFifteenData);
  // console.log(this.yearSixteenData);
}

app.controller("footballTable", footballTable);
