app.factory('userFactory', ["$http", function($http){
  var factory = {};
  var users = [];
  factory.create = function(user, callback){
    $http.post('/users/new', user).then(function(data){
      callback(data.data);
    })
  }
  factory.login = function(login, callback){
    $http.post('/users', login).then(function(data){
      callback(data.data)
    })
  }
  factory.showUser = function(user_id, callback){
    $http.get('/showuser/'+user_id).then(function(data){
      callback(data.data)
    })
  }
  return factory;
}])
