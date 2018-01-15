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
      controller:"teamResult as tr",
      templateUrl: "app/views/team-result.html",
      resolve: {
        yearFifteenData: function (footballData) {
          return footballData.getyearFifteenData();
        },
        yearSixteenData: function (footballData) {
          return footballData.getyearSixteenData();
        }
      }
    };
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
  this.collectiveResults = [];
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
  this.games = {
    won: 0,
    lost: 0,
    draw: 0,
    points: 0
  };
  this.team = {
    name:$routeParams.team,
    results: []
  };
  var temp_win_diff =0;
  var temp_loss_diff =0;

  for (let index = 0; index < this.yearFifteenData.rounds.length; index++) {
    for(let j = 0; j<this.yearFifteenData.rounds[index].matches.length; j++){
      var temp_obj = _.pick(this.yearFifteenData.rounds[index].matches[j],["team1","team2"]);      
      
      if(temp_obj.team1.name == $routeParams.team)
      {
          //  if(this.yearFifteenData.rounds[index].matches[j].score1-this.yearFifteenData.rounds[index].matches[j].score2>temp_win_diff){
          //     this.biggestWin.home.name = temp_obj.team2.name;
          //     this.biggestWin.home.scoreline = this.yearFifteenData.rounds[index].matches[j].score1+"-"+this.yearFifteenData.rounds[index].matches[j].score2;
          //  }
          //  else if(this.yearFifteenData.rounds[index].matches[j].score1-this.yearFifteenData.rounds[index].matches[j].score2<temp_loss_diff){
          //   this.biggestLoss.home.name = temp_obj.team2.name;
          //   this.biggestLoss.home.scoreline = this.yearFifteenData.rounds[index].matches[j].score1+"-"+this.yearFifteenData.rounds[index].matches[j].score2;
          //  }
          var result_decision = ()=>{
            if(this.yearFifteenData.rounds[index].matches[j].score1 > this.yearFifteenData.rounds[index].matches[j].score2){
              return "W";
            }
            else if (this.yearFifteenData.rounds[index].matches[j].score1 == this.yearFifteenData.rounds[index].matches[j].score2) {
              return "D";
            }
            else{
              return "L";
            }
          };
          var obj = {
            opponent : temp_obj.team2.name,
            score:this.yearFifteenData.rounds[index].matches[j].score1+"-"+this.yearFifteenData.rounds[index].matches[j].score2,
            result: result_decision(),
            location: "Home"
          };
          this.team.results.push(obj);
      }
      else if (temp_obj.team2.name === $routeParams.team) {

      //   if(this.yearFifteenData.rounds[index].matches[j].score2-this.yearFifteenData.rounds[index].matches[j].score1>temp_win_diff){
      //     this.biggestWin.away.name = temp_obj.team1.name;
      //     this.biggestWin.away.scoreline = this.yearFifteenData.rounds[index].matches[j].score1+"-"+this.yearFifteenData.rounds[index].matches[j].score2;
      //  }
      //  else if(this.yearFifteenData.rounds[index].matches[j].score2-this.yearFifteenData.rounds[index].matches[j].score1<temp_loss_diff){
      //   this.biggestLoss.away.name = temp_obj.team2.name;
      //   this.biggestLoss.away.scoreline = this.yearFifteenData.rounds[index].matches[j].score1+"-"+this.yearFifteenData.rounds[index].matches[j].score2;
      //  }
        var result_decision = ()=>{
          if(this.yearFifteenData.rounds[index].matches[j].score2 > this.yearFifteenData.rounds[index].matches[j].score1){
            return "W";
          }
          else if (this.yearFifteenData.rounds[index].matches[j].score1 == this.yearFifteenData.rounds[index].matches[j].score2) {
            return "D";
          }
          else{
            return "L";
          }
        };
        var obj = {
          opponent : temp_obj.team1.name,
          score:this.yearFifteenData.rounds[index].matches[j].score1+"-"+this.yearFifteenData.rounds[index].matches[j].score2,
          result: result_decision(),
          location: "Away"
        };
        this.team.results.push(obj);
      }
    }
  }
  for (let index = 0; index < this.team.results.length; index++) {
    if (this.team.results[index].result == "W") {
      this.games.won++;
    } else if(this.team.results[index].result == "L"){
      this.games.lost++;
    }
    else{
      this.games.draw++;
    }
  }
  this.games.points = (this.games.won*3) + (this.games.draw*1);  
  this.showStatistics = false;
  this.showGames = false;

  console.log(this.team.results);
}

app.controller("footballTable", footballTable);
app.controller("teamwiseResults",teamwiseResults);
app.controller("teamResult",teamResult);
