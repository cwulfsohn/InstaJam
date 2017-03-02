app.controller("editUserController",["$scope", "userFactory","songFactory", "$cookies","$uibModal",  function($scope, userFactory, songFactory, $cookies, $uibModal){
  $scope.id = $cookies.get('id')
  $scope.cancel = function(){
    $scope.$dismiss()
  }
  $scope.showOneUser = function(){
    userFactory.showOneUser($scope.id, function(data){
      if(data.err){
        console.log(data.err)
      }
      else{
      $scope.userInfo = data.user
      console.log($scope.userInfo)
    }
    })
  }
  $scope.showOneUser();
  $scope.editUser = function(){
    userFactory.editUser($scope.userInfo, function(data){
      if(data.err){
        if(data.err == "Username is taken"){
          $scope.error = {}
          $scope.error.message = data.err
        }
        else{
          $scope.error = {};
        $scope.errors = data.err
      }
      }
      else{
        $scope.errors = {};
        $scope.error = {}
        $scope.error.message = "Changes Saved"
        $scope.userInfo = data.user
      }
    })
  }
}])
