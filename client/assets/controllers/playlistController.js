app.controller("playlistController", ["$scope", "userFactory","songFactory", "$cookies","$uibModal", function($scope, userFactory, songFactory, $cookies, $uibModal){
    $scope.song_id = $cookies.get('songId')
    $scope.user_id = $cookies.get('id')
    $scope.showPlaylists = function(){
      songFactory.showPlaylists($scope.song_id, $scope.user_id, function(data){
        if(data.err){
          console.log(data.err)
        }
        else{
          $scope.playlists = (data.playlists)
          $scope.song = data.song
          $cookies.remove('songId')
        }
      })
    }
    $scope.showPlaylists();
    $scope.cancel = function(){
      $uibModal.dismiss()
    }
}])
