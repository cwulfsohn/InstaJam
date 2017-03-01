app.controller("socialController", ["$scope", "userFactory","songFactory", "$location", "$cookies", 'Upload', "$timeout", "$routeParams","$uibModal", "$timeout", function($scope, userFactory, songFactory, $location, $cookies, Upload, $timeout, $routeParams, $uibModal, $timeout){
  $scope.profile_id = $routeParams.id;
  $scope.containerView = $routeParams.number;
  $scope.showOneUser = function(){
    userFactory.showOneUser($scope.profile_id, function(data){
      if(data.err){
        console.log(data.err)
      }
      else{
        $scope.user = data.user;
      }
    })
  }
  $scope.showOneUser();

  $scope.changeView = function(number){
    if(number == 1){
      $scope.containerView = 1
    }
    else if(number == 2){
      $scope.containerView = 2
    }
    else{
      $scope.containerView = 3
    }
  }
}])
