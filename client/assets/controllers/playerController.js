app.controller("playerController", ["$scope", "$rootScope", "playerFactory", "$cookies", function($scope, $rootScope, playerFactory, $cookies) {

  $scope.isPaused = true,
  $scope.trackList = []; //song file paths only
  $scope.currentIndex = 0;
  $scope.currentPlaylist = {'songs': []}; //entire song objects
  $scope.currentSong; //an index referring to song in currentPlaylist
  $scope.currentPlaylistID = 1;
  $scope.playlistIndex;

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
    if ($scope.isPaused){
      $rootScope.$emit('pauseWave')
      playerFactory.pause();
    } else {
      $rootScope.$emit('continueWave')
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
      if ($scope.currentPlaylistID != 1) {
        $rootScope.$emit('nextSong', { song: $scope.currentPlaylist.songs[$scope.currentIndex],playlistIndex: $scope.playlistIndex, songIndex: $scope.currentIndex, playist: $scope.currentPlaylist } )
      }
    }
  }

  $rootScope.$on('startPlay', function(event, data) {
    if (data.playlist.hasOwnProperty('songs')) { //when play pause is clicked, check if the click was on a playlist. if it was...
      if (($scope.currentPlaylist.songs.length > 0) && (data.playlist._id == $scope.currentPlaylistID)) { // if there is a current playlist and the one clicked is the same as current
        if(data.playlist.songs[data.index]._id == $scope.currentPlaylist.songs[$scope.currentIndex]._id) { //check to see if the song clicked is the current song in the playlist
          console.log(data.playlist.songs[data.index]._id);
          $scope.pause() // if it is, pause.
        } else {
          $scope.currentIndex = data.index;
          $scope.play(); //if it isn't, change the song.
        }
      } else {
        $scope.trackList = [];
        $scope.currentPlaylist = data.playlist;
        for (song in data.playlist.songs) {
          $scope.trackList.push(data.playlist.songs[song].song_file);
        }
        $scope.currentPlaylistID = data.playlist._id;
        $scope.currentIndex = data.index;
        $scope.playlistIndex = data.playlistIndex;
        $scope.play();
      }
      return;
    } else {
      if (!$scope.trackList[0]) {
        $scope.currentPlaylist.songs.push(data.song)
        $scope.trackList.push(data.song.song_file);
        $scope.currentPlaylistID = 1;
        $scope.currentIndex = 0;
        $scope.play()
      } else if (data.song._id == $scope.currentPlaylist.songs[$scope.currentIndex]._id) {
        $scope.pause() // will play or pause depending on status of song
        return;
      } else { // playlist isn't empty and song isn't the current song        console.log("and its ID is" , $scope.currentPlaylistID);
        if ($scope.currentPlaylistID != 1){ //if switching from a playlist to an individual track, empty playlist and play trackList
          $scope.currentPlaylistID = 1;
          $scope.currentPlaylist = {'songs': []};
          $scope.trackList = [];
          $scope.currentPlaylist.songs.push(data.song);
          $scope.trackList.push(data.song.song_file);
          $scope.currentIndex = 0;
          $scope.play();
        } else {
          $scope.currentPlaylist.songs.push(data.song);
          $scope.trackList.push(data.song.song_file);
          $scope.currentIndex += 1;
          $scope.play()
        }
      }
    }
  });


}])
