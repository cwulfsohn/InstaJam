app.controller("navController", ["$scope", "userFactory", "$location", "$cookies", function($scope, userFactory, $location, $cookies){
  if ($cookies.get("user")){
    $scope.currentUser = $cookies.get("user");
    $scope.currentUser_id = $cookies.get('id');
    console.log("Current user is", $scope.currentUser_id)
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
      console.log("User is", $scope.user)
    }
  })
}]);