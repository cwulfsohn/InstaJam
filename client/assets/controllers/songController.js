app.controller("songController", ["$scope", "songFactory", "$location", "$cookies", "$routeParams", "$sce", function($scope, songFactory, $location, $cookies, $routeParams, $sce){
  if ($cookies.get("user")){
    $scope.currentUser = $cookies.get("user");
    $scope.id = $cookies.get("id");
    $scope.wave = false;
    $scope.audio_ready = false
  }

  $scope.switch = function(){
    if ($scope.play == "play"){
      $scope.play = "pause";
    }
    else {
      $scope.play = "play"
    }
  };

  $scope.getSong = function(){
    songFactory.getSong($routeParams.id, function(data){
      $scope.play = "play"
      $scope.song = data.song;
      $scope.song.well_timed_comments = {};
      $scope.comment = {};
      if ($scope.wave == false){
        $scope.wavemaker();
        $scope.wave = true;
      }
      for (var i = 0; i < $scope.song.comments.length; i++){
        $scope.song.well_timed_comments[$scope.song.timedComments[i].time] = $scope.song.timedComments[i].comment + " -" + $scope.song.timedComments[i].user
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
    wavesurfer.load($scope.song.song_file);

    wavesurfer.on('ready', function () {
      $scope.$apply(function(){
        $scope.audio_ready = true;
      })
      $("#length").text(secondsToMinSec(wavesurfer.getDuration()));
      $('#play').click(function() {
        wavesurfer.playPause();
      });
      wavesurfer.on('audioprocess', function(){
        if ($scope.song.well_timed_comments[Math.floor(wavesurfer.getCurrentTime())]){
          $("#timed_comments").text($scope.song.well_timed_comments[Math.floor(wavesurfer.getCurrentTime())]);
        }
        else {
          $("#timed_comments").text(" ")
        }
      })
    });
  };
  $scope.addComment = function(id){
    $scope.comment.time_marker = wavesurfer.getCurrentTime()
    $scope.comment.song = id;
    $scope.comment.user = $scope.id
    songFactory.createComment($scope.comment, function(data){
      if (data.data.err){
        $scope.errors = []
        for (var key in data.data.err.errors){
          $scope.errors.push(data.data.err.errors[key].message);
        }
      }
      else {
        $scope.getSong();
      }
    })
  };
  $scope.getSong();
  $scope.like = function(song_id, user_id){
    songFactory.like(song_id, user_id, function(data){
      $scope.getSong();
    })
  }
  $scope.disLike = function(song_id, user_id){
    songFactory.disLike(song_id, user_id, function(data){
      $scope.getSong();
    })
  }
  $scope.repost = function(song_id, user_id){
    songFactory.repost(song_id, user_id, function(data){
      $scope.getSong();
    })
  }
  $scope.removeRepost = function(song_id, user_id){
    songFactory.removeRepost(song_id, user_id, function(data){
      $scope.getSong();
    })
  }
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
