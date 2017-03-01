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
.when('/social/:firstName/:id/:number', {
  templateUrl: 'partials/social.html',
  controller: "socialController"
})
.otherwise({
  redirectTo: "/"
})
})
