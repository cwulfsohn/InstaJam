app.factory('songFactory', ["$http", function($http){
  var factory = {};
  factory.getSong = function(id, callback){
    $http.get('/song/' + id).then(function(data){
      callback(data.data)
    })
  }
  return factory;
}])
