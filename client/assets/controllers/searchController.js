app.controller("searchController", ["$scope", "userFactory", "songFactory", "$location", "$cookies", "$routeParams", function($scope, userFactory, songFactory, $location, $cookies, $routeParams){
  $scope.search_query = $routeParams.term;
  $scope.total_tracks = 0;
  $scope.total_playlists = 0;
  $scope.total_users = 0;
  $scope.view = 0;
  $scope.changeView = function (view) {
    $scope.view = view;
  };

  songFactory.search($routeParams.term, function(results) {
    $scope.results = results;
    $scope.total_tracks = results.songs.length + results.songs_by_artist.length + results.tags.length;;
    $scope.total_playlists = results.playlists.length;
    $scope.total_users = results.users.length
  })
}])
