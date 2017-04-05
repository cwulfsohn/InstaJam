app.controller("socialController", ["$scope", "$rootScope", "userFactory","songFactory", "$location", "$cookies", 'Upload', "$timeout", "$routeParams","$uibModal", "$route", function($scope, $rootScope, userFactory, songFactory, $location, $cookies, Upload, $timeout, $routeParams, $uibModal, $route){
  if (!$cookies.get("user")){
    $location.url('/home')
  }
  $scope.profile_id = $routeParams.id;
  if ($routeParams.number == 2 || $routeParams.number == 3){
    console.log($routeParams.number)
    $scope.containerView = $routeParams.number;
    $scope.flag = $routeParams.number;
  }
  else{
    $scope.containerView = 1
  }
  $scope.id = $cookies.get('id')
  var surfers = [];
  $scope.showOneUser = function(){
    userFactory.showOneUser($scope.profile_id, function(data){
      if(data.err){
        console.log(data.err)
      }
      else{
        console.log(data);
        $scope.user = data.user;
        if ($scope.containerView === 1){
          $scope.changeView(1)
        }
        for(var i = 0; i < $scope.user.followers.length; i++){
          if($scope.user.followers[i].followers.length > 0){
          for(var j = 0; j < $scope.user.followers[i].followers.length; j++){
            if($scope.id == $scope.user.followers[i].followers[j]){
              $scope.user.followers[i].followingcheck = true
            }
            else{
              $scope.user.followers[i].followingcheck = false
            }
          }
        }
        else{
          $scope.user.followers[i].followingcheck = false
        }
        }
        console.log($scope.user)
        for(var i = 0; i < $scope.user.following.length; i++){
          if($scope.user.following[i].followers.length > 0){
          for(var j = 0; j < $scope.user.following[i].followers.length; j++){
            if($scope.id == $scope.user.following[i].followers[j]){
              $scope.user.following[i].followingcheck = true
            }
            else{
              $scope.user.following[i].followingcheck = false
            }
          }
        }
        else{
          $scope.user.following[i].followingcheck = false
        }
        }
      }
    })
  }
  $scope.showOneUser();

  $scope.changeView = function(number){

    if($scope.flag == number){
      return;
    }
    else {
      if (surfers){
        for (var i = 0; i < surfers.length; i++){
          surfers[i].destroy();
        }
        surfers = [];
      }
    }
    if(number == 1){
      $scope.flag = 1
      $scope.containerView = 1;
      $scope.current = {index: 0, song: {}, playlist: {}};
      $timeout(function(){
        for (var i = 0; i < $scope.user.like_songs.length; i++){
          $scope.wavemaker($scope.user.like_songs[i])
        }
      }, 500);
      for (var i = 0; i < $scope.user.like_songs.length; i++){
        var song = $scope.user.like_songs[i]
        song.well_timed_comments = {}
        if (song.likes.indexOf($scope.id) > -1){
          song.likeFlag = true;
        } else {
          song.likeFlag = false;
        }
        if (song.reposted_by.indexOf($scope.id) > -1){
          song.repostFlag = true;
        } else {
          song.repostFlag = false;
        }
        for (var j = 0; j < song.timedComments.length; j++){
          song.well_timed_comments[song.timedComments[j].time] = song.timedComments[j].comment + " -" + song.timedComments[j].user
        }
      }
      $timeout(function(){
        for (var i = 0; i < $scope.user.like_playlists.length; i++){
          $scope.wavemaker($scope.user.like_playlists[i].songs[0], -3, $scope.user.like_playlists[i]._id)
        }
      }, 500);
      for (var i = 0; i < $scope.user.like_playlists.length; i++){
        var playlist = $scope.user.like_playlists[i];
        playlist.current_song = {song: playlist.songs[0], index: 0}
        if (playlist.likes.indexOf($scope.id) > -1){
          playlist.likeFlag = true;
        } else {
          playlist.likeFlag = false;
        }
        if (playlist.reposts.indexOf($scope.id) > -1){
          playlist.repostFlag = true;
        } else {
          playlist.repostFlag = false;
        }
        for (var j = 0; j < playlist.songs.length; j++) {
          var song = playlist.songs[j];
          song.well_timed_comments = {};
          for (var k = 0; k < song.timedComments.length; k++){
            song.well_timed_comments[song.timedComments[k].time] = song.timedComments[k].comment + " -" + song.timedComments[k].user
          }
        }
      }
    }
    else if(number == 2){
      $scope.flag = 2
      $scope.containerView = 2;
    }
    else{
      $scope.flag = 3;
      $scope.containerView = 3;
    }
  }
  $scope.follow = function(user_id){
    userFactory.follow(user_id, $scope.id, function(data){
      if(data.err){
        console.log(data.err)
      }
      else{
        console.log('start')
        $scope.showOneUser();
      }
  })
}
  $scope.unfollow = function(user_id){
    userFactory.unfollow(user_id, $scope.id, function(data){
      if(data.err){
        console.log(data.err)
      }
      else{
        console.log(data.work)
        $scope.showOneUser();
      }
  })
};
  $scope.wavemaker = function(song, play=-2, alt_id=false){
  if (alt_id){
    var id = '.w' + alt_id;
  }
  else {
    var id = '.w' + song._id;
  }
  var wavesurfer = WaveSurfer.create({
    container: id,
    backend: 'MediaElement',
    waveColor: '#17BEBB',
    progressColor: '#EF3E36',
    cursorColor: '#EF3E36',
    barWidth: 2,
    cursorWidth:0
      });
  wavesurfer.load(song.song_file);
  wavesurfer.setVolume(0);

  wavesurfer.on('ready', function () {
    if (play > -1){
      wavesurfer.play()
    }
    $("#l" + song._id).text(secondsToMinSec(wavesurfer.getDuration()));
    $('.preview_play_button').on("click", function(){
      wavesurfer.on('audioprocess', function(){
        if ($scope.current.song.well_timed_comments[Math.floor(surfers[$scope.current.index].getCurrentTime())]){
          $("#t" + $scope.current.index).text($scope.current.song.well_timed_comments[Math.floor(surfers[$scope.current.index].getCurrentTime())]);
        }
        else {
          $("#t"+ $scope.current.index).text(" ")
        }
      })
    })
    wavesurfer.on("finish", function(){
      if (!$.isEmptyObject($scope.current.playlist) && ($scope.current.playlist.songs[$scope.current.playlist.current_song.index + 1] != undefined)){
        $scope.$apply(function(){
          $scope.current.playlist.current_song.song = $scope.current.playlist.songs[$scope.current.playlist.current_song.index + 1];
          $scope.current.playlist.current_song.index = $scope.current.playlist.current_song.index + 1;
          $scope.current.song = $scope.current.playlist.current_song.song;
          surfers[$scope.current.index].destroy();
          $scope.wavemaker($scope.current.song, $scope.current.index, $scope.current.playlist._id);
        })
      }
      else {
        surfers[$scope.current.index].stop();
        $('#s' + $scope.current.index).removeClass("glyphicon-pause")
        $('#s' + $scope.current.index).addClass("glyphicon-play")
      }
    })
  });
  if (play > -1){
    surfers[$scope.current.index] = wavesurfer
  }
  else {
    surfers.push(wavesurfer);
  }
};
  $scope.play_pause = function(index, song, playlist={}){
    $scope.current = {index:index, song:song, playlist: playlist};
    for (var i = 0; i < surfers.length; i++){
      if (surfers[i].isPlaying() && surfers[i] != surfers[index]){
        surfers[i].stop();
        $('#s' + i).addClass("glyphicon-play")
        $('#s' + i).removeClass("glyphicon-pause")
      }
    }
    if ($('#s' + index).hasClass("glyphicon-play")){
      $('#s' + index).addClass("glyphicon-pause")
      $('#s' + index).removeClass("glyphicon-play")
    }
    else {
      $('#s' + index).removeClass("glyphicon-pause")
      $('#s' + index).addClass("glyphicon-play")
    }
    surfers[index].playPause();
    if (playlist.hasOwnProperty('current_song')){
      console.log(index);
      $rootScope.$emit('startPlay', {song: song, index: playlist.current_song.index, playlist: playlist, playlistIndex: index});
    } else {
      $rootScope.$emit('startPlay', {song: song, index: index, playlist: playlist});
    }
  };
  $scope.changeSongPlaylist = function(playlistIndex, songIndex, song, playlist){
    $scope.current = {index:playlistIndex, song:song, playlist: playlist};
    for (var i = 0; i < surfers.length; i++){
      if (surfers[i].isPlaying() && surfers[i] != surfers[playlistIndex]){
        surfers[i].stop();
        $('#s' + i).addClass("glyphicon-play")
        $('#s' + i).removeClass("glyphicon-pause")
      }
    }

      $scope.current.playlist.current_song.song = $scope.current.song;
      $scope.current.playlist.current_song.index = songIndex
      surfers[playlistIndex].destroy();
      $scope.wavemaker($scope.current.song, $scope.current.index, $scope.current.playlist._id);
    $rootScope.$emit('startPlay', {song: song, index: songIndex, playlist: playlist});
  };
  $scope.like = function(song_id, user_id, index){
    songFactory.like(song_id, user_id, function(data){
      $scope.user.like_songs[index].likeFlag = true;
    })
  }
  $scope.disLike = function(song_id, user_id, index){
    songFactory.disLike(song_id, user_id, function(data){
      $scope.user.like_songs[index].likeFlag = false;
    })
  }
  $scope.repost = function(song_id, user_id, index){
    songFactory.repost(song_id, user_id, function(data){
      $scope.user.like_songs[index].repostFlag = true;
    })
  }
  $scope.removeRepost = function(song_id, user_id, index){
    songFactory.removeRepost(song_id, user_id, function(data){
      $scope.user.like_songs[index].repostFlag = false;
    })
  };
  $scope.playlistLike = function(playlist_id, user_id, index){
    songFactory.playlistLike(playlist_id, user_id, function(data){
      $scope.user.like_playlists[index].likeFlag = true;
    })
  }
  $scope.playlistDisLike = function(playlist_id, user_id, index){
    songFactory.playlistDisLike(playlist_id, user_id, function(data){
      $scope.user.like_playlists[index].likeFlag = false;
    })
  }
  $scope.playlistRepost = function(playlist_id, user_id, index){
    songFactory.playlistRepost(playlist_id, user_id, function(data){
      $scope.user.like_playlists[index].repostFlag = true;
    })
  }
  $scope.playlistRemoveRepost = function(playlist_id, user_id, index){
    songFactory.playlistRemoveRepost(playlist_id, user_id, function(data){
      $scope.user.like_playlists[index].repostFlag = false;
    })
  };
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
