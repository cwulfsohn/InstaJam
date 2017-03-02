app.controller("socialController", ["$scope", "userFactory","songFactory", "$location", "$cookies", 'Upload', "$timeout", "$routeParams","$uibModal", "$timeout", function($scope, userFactory, songFactory, $location, $cookies, Upload, $timeout, $routeParams, $uibModal, $timeout){
  $scope.profile_id = $routeParams.id;
  $scope.containerView = $routeParams.number;
  $scope.id = $cookies.get('id')
  $scope.showOneUser = function(){
    userFactory.showOneUser($scope.profile_id, function(data){
      if(data.err){
        console.log(data.err)
      }
      else{
        $scope.user = data.user;
        for(var i = 0; i < $scope.user.followers.length; i++){
          if($scope.user.followers[i].followers.length > 0){
          for(var j = 0; j < $scope.user.followers[i].followers.length; j++){
            if($scope.id == $scope.user.followers[i].followers[j]){
              $scope.user.followers[i].followingcheck = true
            }
            else{
              $scope.user.followers[i].followingcheck = false
            }
          }
        }
        else{
          $scope.user.followers[i].followingcheck = false
        }
        }
        console.log($scope.user)
        for(var i = 0; i < $scope.user.following.length; i++){
          if($scope.user.following[i].followers.length > 0){
          for(var j = 0; j < $scope.user.following[i].followers.length; j++){
            if($scope.id == $scope.user.following[i].followers[j]){
              $scope.user.following[i].followingcheck = true
            }
            else{
              $scope.user.following[i].followingcheck = false
            }
          }
        }
        else{
          $scope.user.following[i].followingcheck = false
        }
        }
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
  $scope.follow = function(user_id){
    userFactory.follow(user_id, $scope.id, function(data){
      if(data.err){
        console.log(data.err)
      }
      else{
        console.log('start')
        $scope.showOneUser();
      }
  })
}
  $scope.unfollow = function(user_id){
    userFactory.unfollow(user_id, $scope.id, function(data){
      if(data.err){
        console.log(data.err)
      }
      else{
        console.log(data.work)
        $scope.showOneUser();
      }
  })
}
}])
