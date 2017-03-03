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
  factory.showOneUser = function(user_id, callback){
    $http.get('/showoneuser/'+user_id).then(function(data){
      callback(data.data)
    })
  }
  factory.follow = function(follow_user_id, follower_user_id, callback){
    $http.post("/follow", {follow: follow_user_id, follower: follower_user_id}).then(function(data){
      callback(data.data)
    })
  }
  factory.unfollow = function(follow_user_id, follower_user_id, callback){
    $http.post("/unfollow", {follow: follow_user_id, follower: follower_user_id}).then(function(data){
      callback(data.data)
    })
  }
  factory.editUser = function(user, callback){
    $http.post('/editUser', user).then(function(data){
      callback(data.data)
    })
  }
  factory.getHomeSongs = function(id=0, callback){
    $http.get('/home/' + id).then(function(data){
      callback(data.data);
    })
  }
  return factory;
}])
