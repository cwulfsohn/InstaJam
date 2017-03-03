app.controller("showPlaylistController", ["$scope", "songFactory","songFactory", "$location", "$cookies", 'Upload', "$timeout", "$routeParams","$uibModal", "$timeout","$route", "$rootScope", function($scope, songFactory, songFactory, $location, $cookies, Upload, $timeout, $routeParams, $uibModal, $timeout, $route, $rootScope){

}])
function secondsToMinSec(seconds){
  var string = ""
  var minutes = Math.trunc(seconds/60);
  var seconds = Math.trunc(seconds%60);
  if (minutes < 1){
    minutes = "00"
  }
  if (seconds < 10){
    seconds = "0" + seconds
  }
  return string + minutes + ":" + seconds;
}
