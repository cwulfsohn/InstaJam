app.controller("searchController", ["$scope", "userFactory", "$location", "$cookies", "$routeParams", function($scope, userFactory, $location, $cookies, $routeParams){
  $scope.search_term = $routeParams.term;

  songFactory.search($scope.search_term, function(results) {
    console.log("Results are", Results);
  })

}])
