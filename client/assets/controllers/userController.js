app.controller("userController", ["$scope", "userFactory", "$location", "$cookies", function($scope, userFactory, $location, $cookies){
  if ($cookies.get("user")){
    console.log('hello')
    $location.url('/success');
  }else{
    $location.url('/home')
  }

  $scope.user = {}
  $scope.userLogin = {}
  $scope.register = function(){
    userFactory.create($scope.user, function(data){
      console.log(data)
      if (data.err){
        $scope.errors = [];
        if(data.err == "Email has been taken"){
          $scope.errors.push(data.err)
        }
        else if(data.err == "Username has been taken"){
          $scope.errors.push(data.err)
        }
        else{
          for (key in data.err.errors){
            $scope.errors.push(data.err.errors[key].message)
          }
        }
      }
      else if (data.badPass){
        $scope.errors = [];
        $scope.errors.push(data.badPass)
      }
      else {
        $cookies.put("user", data.user.firstName);
        $cookies.put("id", data.user._id);
        $scope.cancel();
        $location.url('/success');
      }
    })
  }
  $scope.login = function(){
    userFactory.login($scope.userLogin, function(data){
      if(data.user){
        $cookies.put("id", data.user._id);
        $cookies.put("user", data.user.firstName);
        console.log($cookies.get('user'), $cookies.get('id'))
        console.log(data.user);
        $cookies.put("user", data.user.firstName);
        $cookies.put("id", data.user._id);
        $scope.cancel();
        $location.url("/success");
      }
      else {
        console.log('error')
        $scope.error = "Incorrect email or password";
      }
    })
  }
  $scope.cancel = function(){
    $scope.$dismiss()
  }
}])
