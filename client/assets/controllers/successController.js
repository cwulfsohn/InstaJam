app.controller("successController", ["$scope", "userFactory", "$location", "$cookies", function($scope, userFactory, $location, $cookies){
  if ($cookies.get("user")){
    $scope.user = $cookies.get("username");
    $scope.id = $cookies.get('id');
  }
  else {
    $location.url('/home')
  }

  userFactory.showUser($scope.id, function(data){
    if(data.err){
      console.log(data.err)
    }
    else{
      $scope.user = data.user
      console.log($scope.user)
    }
  })

}])
