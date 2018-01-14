function getFootballData($http) {
  function getyearFifteenData() {
    console.log("Run");
    
    return $http.get('https://raw.githubusercontent.com/openfootball/football.json/master/2015-16/en.1.json').then(function (response) {
      return response.data;
    });
  }

  function getyearSixteenData() {
    return $http.get('https://raw.githubusercontent.com/openfootball/football.json/master/2016-17/en.1.json').then(function (response) {
      return response.data;
    });
  }
  return {
    getyearFifteenData: getyearFifteenData,
    getyearSixteenData: getyearSixteenData
  };
}
angular
  .module("footballApp")
  .factory("footballData", getFootballData);