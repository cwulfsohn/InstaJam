app.controller("searchController", ["$scope", "userFactory", "songFactory", "$location", "$cookies", "$routeParams", function($scope, userFactory, songFactory, $location, $cookies, $routeParams){
  $scope.search_term = $routeParams.term;
  $scope.total_tracks = 0;
  $scope.total_playlists = 0;
  $scope.total_people = 0;

  songFactory.search($scope.search_term, function(results) {
    $scope.results = results;
    $scope.total_tracks = results.songs.length;
    $scope.total_playlists = results.playlist_titles.length;
    $scope.total_people = results.users.length + results.artists.length;
  })
}])
