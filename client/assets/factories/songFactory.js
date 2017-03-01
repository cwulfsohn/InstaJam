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
  factory.playlistLike = function(playlist_id, user_id, callback){
    $http.post('/playlist/like', {p_id: playlist_id, u_id: user_id}).then(function(data){
      callback(data.data)
    })
  }
  factory.playlistDisLike = function(playlist_id, user_id, callback){
    $http.post('/playlist/disLike', {p_id: playlist_id, u_id: user_id}).then(function(data){
      callback(data.data)
    })
  }
  factory.playlistRepost = function(playlist_id, user_id, callback){
    $http.post('/playlist/repost', {p_id: playlist_id, u_id: user_id}).then(function(data){
      callback(data.data)
    })
  }
  factory.playlistRemoveRepost = function(playlist_id, user_id, callback){
    $http.post('/playlist/removeRepost', {p_id: playlist_id, u_id: user_id}).then(function(data){
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
  factory.createComment = function(comment, callback){
    $http.post('/comment', comment).then(function(data){
      callback()
    })
  }
  factory.addToPlaylist = function(song_id, playlist_id, callback){
    $http.post("/addToPlaylist", {s_id: song_id, p_id: playlist_id}).then(function(data){
      callback(data.data)
    })
  }
  factory.search = function (search_term, callback) {
    $http.get('/search/'+search_term).then(function(data){
      calback(data.data);
    })
  }
  return factory;
}])
