var app = angular.module("app", ["ngRoute", "ngCookies", "ngFileUpload", 'ngSanitize', 'ui.bootstrap']);
app.config(function ($routeProvider) {
  $routeProvider
.when('/', {
  templateUrl: 'partials/login.html',
  controller: 'userController'
})
.when('/registration', {
  templateUrl: 'partials/registration.html',
  controller: 'userController'
})
.when('/success', {
  templateUrl: "partials/userHome.html",
  controller: "successController"
})
.when("/profile/:firstName/:id", {
  templateUrl: "partials/profile.html",
  controller: "profileController"
})
.when('/upload', {
  templateUrl: 'partials/upload_song.html',
  controller: "uploadController"
})
.when('/song/:id', {
  templateUrl: 'partials/song.html',
  controller: 'songController'
})
.otherwise({
  redirectTo: "/"
})
})
.filter('secToMinSec', function(){
  return function(number){
    if(isNaN(number) || number < 1) {
      return number;
    } else {
      var string = ""
      var minutes = Math.trunc(number/60);
      if (minutes < 1){
        minutes = "00"
      }
      var seconds = Math.trunc(number%60);
      if (seconds < 10){
        seconds = "0" + seconds
      }
      return string + minutes + ":" + seconds;

    }
  }
})
