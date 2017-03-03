app.controller("playerController", ["$scope", "$rootScope", "playerFactory", "$cookies", function($scope, $rootScope, playerFactory, $cookies) {

  $scope.isPaused = true,
  $scope.trackList = [];
  $scope.currentIndex = 0;
  $scope.currentSong;

  $scope.play = function () {
    $scope.isPaused = false;
    console.log("Play", $scope.isPaused)
    if($scope.trackList.length > 0){
      playerFactory.src = $scope.trackList[$scope.currentIndex];
      playerFactory.play();
    }
  }

  $scope.pause = function () {
    $scope.isPaused = !$scope.isPaused;
    console.log("Pause...", $scope.isPaused)
    if ($scope.isPaused){
      $rootScope.$emit('pauseWave', {song : $scope.currentSong, index : $scope.currentIndex})
      playerFactory.pause();
    } else {
      playerFactory.play();
    }
  }

  $scope.prev = function () {
    if ($scope.currentIndex > 0) {
      $scope.currentIndex -= 1;
      $scope.play();
    }
  }

  $scope.next = function () {
    if ($scope.currentIndex < $scope.trackList.length) {
      $scope.currentIndex += 1;
      $scope.play();
    }
  }

  $rootScope.$on('startPlaylist', function (event, songs) {
    //set tracklist to data
    //play song(s)
  });

  $rootScope.$on('startSong', function(event, song) {
    console.log($scope.currentSong);
    console.log(song.song);
    if (!$scope.currentSong) {
      console.log("No Song Yet");
      $scope.currentSong = song.song;
      $scope.trackList[song.index] = song.song.song_file
      $scope.currentIndex = song.index;
      $scope.play()
      return;
    }
    if (song.song._id == $scope.currentSong._id) {
      console.log("Gonna Pause");
      $scope.pause()
      return;
    }
    console.log("They're not equal");
    $scope.currentSong = song.song;
    $scope.trackList[song.index] = song.song.song_file
    $scope.currentIndex = song.index;
    $scope.play()
  });


}])
