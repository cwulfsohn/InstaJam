app.controller("songController", ["$scope", "songFactory", "$location", "$cookies", "$routeParams", "$sce", function($scope, songFactory, $location, $cookies, $routeParams, $sce){
  if ($cookies.get("user")){
    $scope.currentUser = $cookies.get("user");
  }
  else {
    $location.url('/')
  }
  $scope.logout = function(){
    $scope.currentUser = {};
    $cookies.remove("user");
    $location.url('/');
  }
  $scope.getSong = function(){
    songFactory.getSong($routeParams.id, function(data){
      $scope.song = data.song;
    })
  };
  $scope.getSong();
}])
