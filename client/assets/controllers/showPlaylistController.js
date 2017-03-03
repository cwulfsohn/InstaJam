app.controller("showPlaylistController", ["$scope", "songFactory","songFactory", "$location", "$cookies", 'Upload', "$timeout", "$routeParams","$uibModal", "$timeout","$route", "$rootScope", function($scope, songFactory, songFactory, $location, $cookies, Upload, $timeout, $routeParams, $uibModal, $timeout, $route, $rootScope){
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
      $scope.playlist.currentSong = $scope.playlist.songs[0]
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
  var wavesurfer;
  $scope.wavemaker = function(){
    wavesurfer = WaveSurfer.create({
      container: '#waveform_preview',
      backend: 'MediaElement',
      waveColor: '#17BEBB',
      progressColor: '#EF3E36',
      cursorColor: '#EF3E36',
      barWidth: 2,
      cursorWidth:0
        });
    wavesurfer.load($scope.playlist.current_song.song_file);

    wavesurfer.on('ready', function () {
      $scope.$apply(function(){
        $scope.audio_ready = true;
      })
      $("#length").text(secondsToMinSec(wavesurfer.getDuration()));
      $('#play').click(function() {
        wavesurfer.playPause();
      });
      $(".changeTime").click(function(){
        var time = $(this).attr("time")
        console.log(time);
        wavesurfer.play(time)
      });
      /////
      wavesurfer.on('audioprocess', function(){
        if ($scope.playlist.current_song.well_timed_comments[Math.floor(wavesurfer.getCurrentTime())]){
          $("#timed_comments").text($scope.song.well_timed_comments[Math.floor(wavesurfer.getCurrentTime())]);
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

  $scope.playlistLikeRepost = function(playlist_id, user_id, index){
    songFactory.playlistLike(playlist_id, user_id, function(data){
      $scope.user.playlist_reposts[index].likeFlag = true;
    })
  }
  $scope.playlistDisLikeRepost = function(playlist_id, user_id, index){
    songFactory.playlistDisLike(playlist_id, user_id, function(data){
      $scope.user.playlist_reposts[index].likeFlag = false;
    })
  }
  $scope.playlistRepostRepost = function(playlist_id, user_id, index){
    songFactory.playlistRepost(playlist_id, user_id, function(data){
      $scope.user.playlist_reposts[index].repostFlag = true;
    })
  }
  $scope.playlistRemoveRepostRepost = function(playlist_id, user_id, index){
    songFactory.playlistRemoveRepost(playlist_id, user_id, function(data){
      $scope.user.playlist_reposts[index].repostFlag = false;
    })
  };
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
