app.controller("showPlaylistController", ["$scope", "$rootScope", "songFactory","songFactory", "$location", "$cookies", 'Upload', "$timeout", "$routeParams","$uibModal", "$timeout","$route", "$rootScope", function($scope, $rootScope, songFactory, songFactory, $location, $cookies, Upload, $timeout, $routeParams, $uibModal, $timeout, $route, $rootScope){
  if ($cookies.get("user")){
    $scope.currentUser = $cookies.get("user");
    $scope.id = $cookies.get("id");
    $scope.wave = false;
    $scope.audio_ready = false;
  } else {
    $location.url('/home')
  }
  $scope.switch = function(){
    if ($('#play_symbol').hasClass("glyphicon-play")){
      $('#play_symbol').removeClass("glyphicon-play")
      $('#play_symbol').addClass("glyphicon-pause")
    }
    else {
      $('#play_symbol').removeClass("glyphicon-pause")
      $('#play_symbol').addClass("glyphicon-play")
    }
  };

  $scope.getPlaylist = function(){
    songFactory.getPlaylist($routeParams.id, function(data){
      $scope.play = "play"
      $scope.playlist = data.playlist;
      $scope.playlist.current_song = {}
      $scope.playlist.current_song.song = $scope.playlist.songs[0];
      $scope.playlist.current_song.index = 0;
      console.log($scope.playlist);
      var song;
      for (var i = 0; i < $scope.playlist.songs.length; i++) {
        song = $scope.playlist.songs[i]
        song.well_timed_comments = {};
        for (var j = 0; j < song.comments.length; j++){
          song.well_timed_comments[song.timedComments[j].time] = song.timedComments[j].comment + " -" + song.timedComments[j].user
        }
      }

      if ($scope.wave == false){
        $scope.wavemaker();
        $scope.wave = true;
      }

      $scope.likeFlag = false;
      for (var i = 0; i < $scope.playlist.likes.length; i++) {
        if ($scope.playlist.likes[i]._id == $scope.id){
          $scope.likeFlag = true;
        }
      }
      $scope.repostFlag = false;
      for (var i = 0; i < $scope.playlist.reposts.length; i++) {
        if ($scope.playlist.reposts[i]._id == $scope.id){
          $scope.repostFlag = true;
        }
      }
    });
  };
  $scope.getPlaylist();
  var wavesurfer;
  $scope.wavemaker = function(play=-1){
    wavesurfer = WaveSurfer.create({
      container: '#waveform_preview',
      backend: 'MediaElement',
      waveColor: '#17BEBB',
      progressColor: '#EF3E36',
      cursorColor: '#EF3E36',
      barWidth: 2,
      cursorWidth:0
        });
    wavesurfer.load($scope.playlist.current_song.song.song_file);
    wavesurfer.setVolume(0);

    wavesurfer.on('ready', function () {
      if (play > -1){
        wavesurfer.play()
        $rootScope.$emit('startPlay', {song: $scope.playlist.current_song.song, index: $scope.playlist.current_song.index, playlist: $scope.playlist});
      }
      $scope.$apply(function(){
        $scope.audio_ready = true;
      })
      $("#length").text(secondsToMinSec(wavesurfer.getDuration()));
      $('#play').click(function() {
        console.log("hey");
        wavesurfer.playPause();
        $rootScope.$emit('startPlay', {song: $scope.playlist.current_song.song, index: $scope.playlist.current_song.index, playlist: $scope.playlist});
      });
      $(".changeTime").click(function(){
        var time = $(this).attr("time")
        wavesurfer.play(time)
      });
      wavesurfer.on('audioprocess', function(){
        if ($scope.playlist.current_song.song.well_timed_comments[Math.floor(wavesurfer.getCurrentTime())]){
          $("#timed_comments").text($scope.playlist.current_song.song.well_timed_comments[Math.floor(wavesurfer.getCurrentTime())]);
        }
        else {
          $("#timed_comments").text(" ")
        }
      })
      wavesurfer.on("finish", function(){
          wavesurfer.stop();
          $('#play_symbol').removeClass("glyphicon-pause")
          $('#play_symbol').addClass("glyphicon-play")
      })
    });
  };

  $scope.playlistLike = function(playlist_id, user_id){
    songFactory.playlistLike(playlist_id, user_id, function(data){
      $scope.getPlaylist();
    })
  }
  $scope.playlistDisLike = function(playlist_id, user_id){
    songFactory.playlistDisLike(playlist_id, user_id, function(data){
      $scope.getPlaylist();
    })
  }
  $scope.playlistRepost = function(playlist_id, user_id){
    songFactory.playlistRepost(playlist_id, user_id, function(data){
      $scope.getPlaylist();
    })
  }
  $scope.playlistRemoveRepost = function(playlist_id, user_id){
    songFactory.playlistRemoveRepost(playlist_id, user_id, function(data){
      $scope.getPlaylist();
    })
  };
  $scope.changeSongPlaylist = function(songIndex, song){
      $scope.playlist.current_song.song = song
      $scope.playlist.current_song.index = songIndex
      wavesurfer.destroy();
      $scope.wavemaker(songIndex);

  }
  $scope.deleteSongPlaylist = function(index, song){
    console.log($scope.playlist.songs.length);
    if ($scope.playlist.songs.length < 2){
      $scope.error = "Can't delete if playlist is only one song"
    }
    else {
      songFactory.deleteSongPlaylist(index, $scope.playlist._id, song._id,  function(data){
        $scope.getPlaylist();
      })
    }
  }
  $rootScope.$on('pauseWave', function (event, song) {
    $scope.switch();
  })

  $rootScope.$on('continueWave', function (event, song) {
    $scope.switch();
  })

  // $rootScope.$on('nextSong', function (event, data) {
  //   $scope.wavemaker(data.song, data.playlistIndex, data.playlist._id)
  // })
}])
function secondsToMinSec(seconds){
  var string = ""
  var minutes = Math.trunc(seconds/60);
  var seconds = Math.trunc(seconds%60);
  if (minutes < 1){
    minutes = "00"
  }
  if (seconds < 10){
    seconds = "0" + seconds
  }
  return string + minutes + ":" + seconds;
}
