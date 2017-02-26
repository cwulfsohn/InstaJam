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
