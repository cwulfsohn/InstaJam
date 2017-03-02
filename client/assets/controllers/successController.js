app.controller("successController", ["$scope", "userFactory", "$location", "$cookies", function($scope, userFactory, $location, $cookies){
  if ($cookies.get("user")){
    $scope.currentUser = $cookies.get("user");
    $scope.currentUser_id = $cookies.get('id');
  }

  userFactory.showUser($scope.currentUser_id, function(data){
    if(data.err){
      console.log(data.err)
    }
    else{
      $scope.user = data.user
      console.log("User is", $scope.user)
    }
  })

}])
