var app = angular.module("app", ["ngRoute", "ngCookies", "ngFileUpload"]);
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
  templateUrl: "partials/success.html",
  controller: "successController"
})
.when("/profile", {
  templateUrl: "partials/profile.html",
  controller: "profileController"
})
.otherwise({
  redirectTo: "/"
})
})
