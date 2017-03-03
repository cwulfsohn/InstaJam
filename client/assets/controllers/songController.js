app.controller("songController", ["$scope", "$rootScope", "songFactory", "$location", "$cookies", "$routeParams", "$sce","$uibModal","$route", function($scope, $rootScope, songFactory, $location, $cookies, $routeParams, $sce, $uibModal, $route){
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
      $scope.likeFlag = false;
      for (var i = 0; i < $scope.song.likes.length; i++) {
        if ($scope.song.likes[i]._id == $scope.id){
          $scope.likeFlag = true;
        }
      }
      $scope.repostFlag = false;
      for (var i = 0; i < $scope.song.reposted_by.length; i++) {
        if ($scope.song.reposted_by[i]._id == $scope.id){
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
    wavesurfer.load($scope.song.song_file);

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
      wavesurfer.on('audioprocess', function(){
        if ($scope.song.well_timed_comments[Math.floor(wavesurfer.getCurrentTime())]){
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
  $scope.changeTime = function(time){
    console.log(wavesurfer);
  }
  $scope.tagSearch = function(tag){
    $location.url('/search/' + tag)
  }
  $scope.open = function(song_id){
    $cookies.put('songId', song_id)
  $scope.modalInstance = $uibModal.open({
        animation: true,
        ariaLabelledBy: 'modal-title-top',
        ariaDescribedBy: 'modal-body-top',
        templateUrl: './partials/playlist.html',
        controller: 'playlistController'
      });
      $scope.modalInstance.result.then(function(hello){
        console.log('closed')
      }, function(){
        $route.reload();
      })
    }
    $scope.edit = function(song_id){
      $cookies.put('songId', song_id)
    $scope.modalInstance = $uibModal.open({
      animation: true,
      ariaLabelledBy: 'modal-title-top',
      ariaDescribedBy: 'modal-body-top',
      templateUrl: './partials/editSong.html',
      controller: 'editSongController'
    })
    $scope.modalInstance.result.then(function(hello){
      console.log('closed')
    }, function(){
      $route.reload();
    })
  }
  $rootScope.$on('pauseWave', function (event, song) {
    console.log($scope.current.index );
    surfers[$scope.current.index].playPause();
    $('#s' + $scope.current.index).addClass("glyphicon-play");
    $('#s' + $scope.current.index).removeClass("glyphicon-pause");
  })

  $rootScope.$on('continueWave', function (event, song) {
    surfers[$scope.current.index].playPause();
    $('#s' + $scope.current.index).addClass("glyphicon-pause");
    $('#s' + $scope.current.index).removeClass("glyphicon-play");
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
