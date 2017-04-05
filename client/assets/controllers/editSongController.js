app.controller("editSongController",["$scope", "userFactory","songFactory", "$cookies","$uibModal",  function($scope, userFactory, songFactory, $cookies, $uibModal){
  $scope.song_id = $cookies.get('songId')
  $scope.getSong = function(){
    songFactory.getSong($scope.song_id, function(data){
      if(data.err){
        console.log(data.err)
      }
      else{
        $scope.songInfo = data.song
      }
    })
  }
  $scope.getSong();
  $scope.editSong = function(){
    songFactory.editSong($scope.songInfo, function(data){
      if(data.err){
        $scope.error = {}
        $scope.errors = data.err
      }
      else{
        $scope.errors = {};
        $scope.error = {}
        $scope.error.message = "Changes Saved"
        $scope.songInfo = data.song
      }
    })
  }
  $scope.cancel = function(){
    $scope.$dismiss()
  }
}])
