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
      controller: "teamwiseResults as tr",
      templateUrl: "app/views/team-results.html",
      resolve: {
        yearFifteenData: function(footballData) {
          return footballData.getyearFifteenData();
        },
        yearSixteenData: function(footballData) {
          return footballData.getyearSixteenData();
        }
        // teamWiseYear: function(teamWiseYear) {
        //   return teamWiseYear.yearClicked;
        // }
      }
    };
    const teamResultRoute = {
      controller: "teamResult as tr",
      templateUrl: "app/views/team-result.html",
      resolve: {
        yearFifteenData: function(footballData) {
          return footballData.getyearFifteenData();
        },
        yearSixteenData: function(footballData) {
          return footballData.getyearSixteenData();
        }
      }
    };
    $routeProvider
      .when("/matchday", matchdayRoute)
      .when("/teamwise", teamwiseRoute)
      .when("/:team", teamResultRoute)
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

  this.init = function() {
    this.updateTable();
  }.bind(this);

  this.updateTable = function() {
    this.results = {};
    var index = _.findIndex(
      this.yearFifteenData.rounds,
      function(o) {
        return o.name == this.selectedMatchday;
      }.bind(this)
    );
    if (this.selectedYear === "2015") {
      this.results = this.yearFifteenData.rounds[index];
    } else {
      this.results = this.yearSixteenData.rounds[index];
    }
  };
}

function teamwiseResults(yearFifteenData, yearSixteenData, teamWiseYear) {
  this.yearFifteenTeams = [];
  this.yearSixteenTeams = [];
  this.toggleFifteen = false;
  this.toggleSixteen = false;

  this.yearButtonClicked = year => {
    teamWiseYear.yearClicked = year;
  };

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

function teamResult(
  $routeParams,
  yearFifteenData,
  yearSixteenData,
  teamWiseYear
) {
  this.yearFifteenData = yearFifteenData;
  this.yearSixteenData = yearSixteenData;
  this.year = teamWiseYear.yearClicked;
  this.biggestWin = {
    away: {
      name: "",
      scoreline: ""
    },
    home: {
      name: "",
      scoreline: ""
    }
  };
  this.biggestLoss = {};
  this.games_fifteen = {
    won: 0,
    lost: 0,
    draw: 0,
    points: 0
  };
  this.games_sixteen = {
    won: 0,
    lost: 0,
    draw: 0,
    points: 0
  };
  this.team_fifteen = {
    name: $routeParams.team,
    results: []
  };
  this.team_sixteen = {
    name: $routeParams.team,
    results: []
  };

  for (let index = 0; index < this.yearFifteenData.rounds.length; index++) {
    for (
      let j = 0;
      j < this.yearFifteenData.rounds[index].matches.length;
      j++
    ) {
      var temp_fifteen_obj = _.pick(
        this.yearFifteenData.rounds[index].matches[j],
        ["team1", "team2"]
      );

      if (temp_fifteen_obj.team1.name == $routeParams.team) {
        var result_decision = () => {
          if (
            this.yearFifteenData.rounds[index].matches[j].score1 >
            this.yearFifteenData.rounds[index].matches[j].score2
          ) {
            this.games_fifteen.won++;
            return "W";
          } else if (
            this.yearFifteenData.rounds[index].matches[j].score1 ==
            this.yearFifteenData.rounds[index].matches[j].score2
          ) {
            this.games_fifteen.draw++;
            return "D";
          } else {
            this.games_fifteen.lost++;
            return "L";
          }
        };
        var obj = {
          opponent: temp_fifteen_obj.team2.name,
          score:
            this.yearFifteenData.rounds[index].matches[j].score1 +
            "-" +
            this.yearFifteenData.rounds[index].matches[j].score2,
          result: result_decision(),
          location: "Home"
        };
        this.team_fifteen.results.push(obj);
      } else if (temp_fifteen_obj.team2.name === $routeParams.team) {
        var result_decision = () => {
          if (
            this.yearFifteenData.rounds[index].matches[j].score2 >
            this.yearFifteenData.rounds[index].matches[j].score1
          ) {
            this.games_fifteen.won++;
            return "W";
          } else if (
            this.yearFifteenData.rounds[index].matches[j].score1 ==
            this.yearFifteenData.rounds[index].matches[j].score2
          ) {
            this.games_fifteen.draw++;
            return "D";
          } else {
            this.games_fifteen.lost++;
            return "L";
          }
        };
        var obj = {
          opponent: temp_fifteen_obj.team1.name,
          score:
            this.yearFifteenData.rounds[index].matches[j].score1 +
            "-" +
            this.yearFifteenData.rounds[index].matches[j].score2,
          result: result_decision(),
          location: "Away"
        };
        this.team_fifteen.results.push(obj);
      }
    }
  }
  for (let index = 0; index < this.yearSixteenData.rounds.length; index++) {
    for (
      let j = 0;
      j < this.yearSixteenData.rounds[index].matches.length;
      j++
    ) {
      var temp_sixteen_obj = _.pick(
        this.yearSixteenData.rounds[index].matches[j],
        ["team1", "team2"]
      );
      //year sixteen results
      if (
        this.yearSixteenData.rounds[index].matches[j].team1.name ==
        $routeParams.team
      ) {
        var result_decision = () => {
          if (
            this.yearSixteenData.rounds[index].matches[j].score1 >
            this.yearSixteenData.rounds[index].matches[j].score2
          ) {
            this.games_sixteen.won++;
            return "W";
          } else if (
            this.yearSixteenData.rounds[index].matches[j].score1 ==
            this.yearSixteenData.rounds[index].matches[j].score2
          ) {
            this.games_sixteen.draw++;
            return "D";
          } else {
            this.games_sixteen.lost++;
            return "L";
          }
        };
        var obj = {
          opponent: this.yearSixteenData.rounds[index].matches[j].team2.name,
          score:
            this.yearSixteenData.rounds[index].matches[j].score1 +
            "-" +
            this.yearSixteenData.rounds[index].matches[j].score2,
          result: result_decision(),
          location: "Home"
        };
        this.team_sixteen.results.push(obj);
      } else if (
        this.yearSixteenData.rounds[index].matches[j].team2.name ===
        $routeParams.team
      ) {
        var result_decision = () => {
          if (
            this.yearSixteenData.rounds[index].matches[j].score2 >
            this.yearSixteenData.rounds[index].matches[j].score1
          ) {
            this.games_sixteen.won++;
            return "W";
          } else if (
            this.yearSixteenData.rounds[index].matches[j].score1 ==
            this.yearSixteenData.rounds[index].matches[j].score2
          ) {
            this.games_sixteen.draw++;
            return "D";
          } else {
            this.games_sixteen.lost++;
            return "L";
          }
        };
        var obj = {
          opponent: this.yearSixteenData.rounds[index].matches[j].team1.name,
          score:
            this.yearSixteenData.rounds[index].matches[j].score1 +
            "-" +
            this.yearSixteenData.rounds[index].matches[j].score2,
          result: result_decision(),
          location: "Away"
        };
        this.team_sixteen.results.push(obj);
      }
    }
  }
  this.games_fifteen.points =
    this.games_fifteen.won * 3 + this.games_fifteen.draw * 1;
  this.games_sixteen.points =
    this.games_sixteen.won * 3 + this.games_sixteen.draw * 1;
  this.showStatistics = false;
  this.showGames_fifteen = false;
  console.log(this.team_sixteen.results);
}
function teamWiseYear() {
  this.yearClicked;
}
app.service("teamWiseYear", teamWiseYear);
app.controller("footballTable", footballTable);
app.controller("teamwiseResults", teamwiseResults);
app.controller("teamResult", teamResult);
