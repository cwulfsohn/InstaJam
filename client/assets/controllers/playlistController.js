app.controller("playlistController", ["$scope", "userFactory","songFactory", "$cookies","$uibModal", function($scope, userFactory, songFactory, $cookies, $uibModal){
    $scope.song_id = $cookies.get('songId')
    $scope.user_id = $cookies.get('id')
    $scope.containerView = 0;
    $scope.playlist = {}
    $scope.changeView = function(number){
      if(number == 0){
        $scope.containerView = 0;
      }
      else{
        $scope.containerView = 1
      }
    }
    $scope.showPlaylists = function(){
      songFactory.showPlaylists($scope.song_id, $scope.user_id, function(data){
        if(data.err){
          console.log(data.err)
        }
        else{
          $scope.playlists = data.playlists
          $scope.song = data.song
          $cookies.remove('songId')
        }
      })
    }
    $scope.showPlaylists();
    $scope.createPlaylist = function(){
      $scope.playlist.song_id = $scope.song_id
      $scope.playlist.user_id = $scope.user_id
      songFactory.createPlaylist($scope.playlist, function(data){
        if(data.err){
          console.log(data.err)
        }
        else{
          $scope.containerView = 0;
          $scope.showPlaylists();
        }
      })
    }
    $scope.cancel = function(){
      $scope.$parent.$dismiss()
    }
    $scope.addToPlaylist = function(song_id, playlist_id){
      songFactory.addToPlaylist(song_id, playlist_id, function(data){
        if(data.err){
          console.log(data.err)
        }
        else{
          console.log(data.playlist)
          $scope.showPlaylists();
        }
      })
    }
    console.log($scope.$parent);
}])
