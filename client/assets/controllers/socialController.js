app.controller("socialController", ["$scope", "userFactory","songFactory", "$location", "$cookies", 'Upload', "$timeout", "$routeParams","$uibModal", "$timeout", function($scope, userFactory, songFactory, $location, $cookies, Upload, $timeout, $routeParams, $uibModal, $timeout){
  $scope.profile_id = $routeParams.id;
  if ($routeParams.number == 2 || $routeParams.number == 3){
    $scope.containerView = $routeParams.number;
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
    if(number == 1){
      $scope.containerView = 1
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
      $scope.containerView = 2
    }
    else{
      $scope.containerView = 3
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
}])
