app.controller("navController", ["$scope", "userFactory", "$location", "$cookies", function($scope, userFactory, $location, $cookies){
  if ($cookies.get("user")){
    $scope.currentUser = $cookies.get("user");
    $scope.currentUser_id = $cookies.get('id');
  } else {
    $location.url('/login');
  }

  $scope.logout = function(){
    $scope.currentUser = {};
    $cookies.remove("user");
    $cookies.remove("id");
    $location.url('/login');
  }

  userFactory.showUser($scope.currentUser_id, function(data){
    if(data.err){
      console.log(data.err)
    }
    else{
      $scope.currentUser = data.user
    }
  })

  $scope.search = function (search_term) {
    $location.url('search/'+search_term)
  }

}]);
