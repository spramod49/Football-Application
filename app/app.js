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
      controller: "teamwiseResults as tr",
      templateUrl: "team-results.html"
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
  this.results = {};

  for (let index = 0; index < yearFifteenData.rounds.length; index++) {
    this.matchdays.push(yearFifteenData.rounds[index].name);
  }

  this.selectedYear = this.years[0];
  this.selectedMatchday = this.matchdays[0];

  this.init = function(){
    this.updateTable();
  }.bind(this);

  this.updateTable = function () {
    this.results = {};
    var index = _.findIndex(
      this.yearFifteenData.rounds, 
      function(o) 
      { 
        return o.name == this.selectedMatchday; 
      }.bind(this)
      );
    if (this.selectedYear === "2015") 
    {
      this.results = this.yearFifteenData.rounds[index];  
    }
    else
    {
      this.results = this.yearSixteenData.rounds[index];
    }
  };
}

app.controller("footballTable", footballTable);