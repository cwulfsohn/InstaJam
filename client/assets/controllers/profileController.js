app.controller("profileController", ["$scope", "userFactory", "$location", "$cookies", 'Upload', "$timeout", "$routeParams", function($scope, userFactory, $location, $cookies, Upload, $timeout, $routeParams){
  $scope.profile_id = $routeParams.id;
  $scope.id = $cookies.get('id');
  $scope.firstName = $cookies.get('user');
  $scope.containerView = 0;
  $scope.showUser = function(){
    userFactory.showUser($scope.profile_id, function(data){
      if(data.err){
        console.log(data.err)
      }
      else{
        $scope.user = data.user
      }
    })
  }
  $scope.changeView = function(number){
    if(number == 0){
      $scope.containerView = 0;
    }
    else if(number == 1){
      $scope.containerView = 1
    }
    else if(number == 2){
      $scope.containerView = 2
    }
    else{
      $scope.containerView = 3
    }
  }
  $scope.showUser();
  $scope.uploadFiles = function(file, errFiles, type) {
      $scope.f = file;
      $scope.errFile = errFiles && errFiles[0];
      if (file) {
          file.upload = Upload.upload({
              url: '/image/new/'+$scope.id,
              method: 'POST',
              data: {file: file, type: type}
          }).then(function(response){
            if(response.err){
              console.log(err)
            }
            else{
              $scope.showUser();
            }
          });
          };
      }

}])
