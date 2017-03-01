app.controller("searchController", ["$scope", "userFactory", "songFactory", "$location", "$cookies", "$routeParams", function($scope, userFactory, songFactory, $location, $cookies, $routeParams){
  $scope.search_term = $routeParams.term;



  songFactory.search($scope.search_term, function(results) {
    $scope.artists = results.artists;
    $scope.songs = results.songs;
    $scope.tags = results.tags
  })

}]);
