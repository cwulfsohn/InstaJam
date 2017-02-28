var app = angular.module("app", ["ngRoute", "ngCookies"]);
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
.otherwise({
  redirectTo: "/"
})
})
