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
      templateUrl: "app/views/team-results.html",
      resolve: {
        yearFifteenData: function (footballData) {
          return footballData.getyearFifteenData();
        },
        yearSixteenData: function (footballData) {
          return footballData.getyearSixteenData();
        }
      }
    };
    const teamResultRoute = {
      controller:"teamResult",
      templateUrl: "app/views/team-result.html",
      resolve: {
        yearFifteenData: function (footballData) {
          return footballData.getyearFifteenData();
        },
        yearSixteenData: function (footballData) {
          return footballData.getyearSixteenData();
        }
      }
    }
    $routeProvider
      .when("/matchday", matchdayRoute)
      .when("/teamwise", teamwiseRoute)
      .when("/:team",teamResultRoute)
      .otherwise("/", {
        templateUrl: "index.html"
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

function teamwiseResults(yearFifteenData,yearSixteenData) {
  this.yearFifteenTeams = [];
  this.yearSixteenTeams = [];
  this.toggleFifteen = false;
  this.toggleSixteen = false;
  this.init = function() {
    for (
      let index = 0;
      index < yearFifteenData.rounds[0].matches.length;
      index++
    ) {
      this.yearFifteenTeams.push(
        yearFifteenData.rounds[0].matches[index].team1.name
      );
      this.yearFifteenTeams.push(
        yearFifteenData.rounds[0].matches[index].team2.name
      );
      this.yearSixteenTeams.push(
        yearSixteenData.rounds[0].matches[index].team1.name
      );
      this.yearSixteenTeams.push(
        yearSixteenData.rounds[0].matches[index].team2.name
      );
    }
  };

}

function teamResult($routeParams,yearFifteenData,yearSixteenData) {
  this.yearFifteenData = yearFifteenData;
  this.yearSixteenData = yearSixteenData;
  for (let index = 0; index < this.yearFifteenData.rounds.length; index++) {
    for(let j = 0; j<this.yearFifteenData.rounds[index].length; j++){
      
    }
  }
  console.log(this.yearFifteenData.rounds);
}
app.controller("footballTable", footballTable);
app.controller("teamwiseResults",teamwiseResults);
app.controller("teamResult",teamResult);
