app.factory('songFactory', ["$http", function($http){
  var factory = {};
  factory.getSong = function(id, callback){
    $http.get('/song/' + id).then(function(data){
      callback(data.data)
    })
  }
  factory.like = function(song_id, user_id, callback){
    $http.post('/like', {s_id: song_id, u_id: user_id}).then(function(data){
      callback(data.data)
    })
  }
  factory.disLike = function(song_id, user_id, callback){
    $http.post('/disLike', {s_id: song_id, u_id: user_id}).then(function(data){
      callback(data.data)
    })
  }
  factory.repost = function(song_id, user_id, callback){
    $http.post('/repost', {s_id: song_id, u_id: user_id}).then(function(data){
      callback(data.data)
    })
  }
  factory.removeRepost = function(song_id, user_id, callback){
    $http.post('/removeRepost', {s_id: song_id, u_id: user_id}).then(function(data){
      callback(data.data)
    })
  }
  factory.showPlaylists = function(song_id, user_id, callback){
    $http.get('/playlist/'+song_id+"/"+user_id).then(function(data){
      callback(data.data)
    })
  }
  factory.createPlaylist = function(playlist, callback){
    $http.post('/createPlaylist', playlist).then(function(data){
      callback(data.data)
    })
  }
  return factory;
}])
