app.controller("profileController", ["$scope", "userFactory","songFactory", "$location", "$cookies", 'Upload', "$timeout", "$routeParams","$uibModal", "$timeout", function($scope, userFactory, songFactory, $location, $cookies, Upload, $timeout, $routeParams, $uibModal, $timeout){

  $scope.profile_id = $routeParams.id;
  $scope.id = $cookies.get('id');
  $scope.firstName = $cookies.get('user');
  var surfers = [];
  $scope.showUser = function(){
    userFactory.showUser($scope.profile_id, function(data){
      if(data.err){
        console.log(data.err)
      }
      else{
        console.log(data.user)
        $scope.user = data.user;
        $scope.changeView(1, 0);
      }
    })
  }
  $scope.changeView = function(number, view){
    if (number == view){
      return;
    }
    else {
      if (surfers){
        for (var i = 0; i < surfers.length; i++){
          surfers[i].destroy();
        }
        surfers = []
      }
      if(number == 0){
        $scope.containerView = 0;
      }
      else if(number == 1){
        $scope.containerView = 1;
        $scope.current = {index: 0, song: {}}
        $timeout(function(){
          for (var i = 0; i < $scope.user.uploaded_songs.length; i++){
            $scope.wavemaker($scope.user.uploaded_songs[i])
          }
        }, 200);
        for (var i = 0; i < $scope.user.uploaded_songs.length; i++){
          var song = $scope.user.uploaded_songs[i]
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
      }
      else if(number == 2){
        $scope.containerView = 2
        $scope.current = {index: 0, song: {}, playlist: {}};
        $timeout(function(){
          for (var i = 0; i < $scope.user.playlists.length; i++){
            $scope.wavemaker($scope.user.playlists[i].songs[0], -3, $scope.user.playlists[i]._id)
          }
        }, 500);
        for (var i = 0; i < $scope.user.playlists.length; i++){
          var playlist = $scope.user.playlists[i];
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
      else{
        $scope.containerView = 3
        $scope.current = {index: 0, song: {}, playlist: {}};
        $timeout(function(){
          for (var i = 0; i < $scope.user.reposts.length; i++){
            $scope.wavemaker($scope.user.reposts[i])
          }
        }, 500);
        for (var i = 0; i < $scope.user.reposts.length; i++){
          var song = $scope.user.reposts[i]
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
          for (var i = 0; i < $scope.user.playlist_reposts.length; i++){
            $scope.wavemaker($scope.user.playlist_reposts[i].songs[0], -3, $scope.user.playlist_reposts[i]._id)
          }
        }, 500);
        for (var i = 0; i < $scope.user.playlist_reposts.length; i++){
          var playlist = $scope.user.playlist_reposts[i];
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
    }
  }
  $scope.showUser();
  $scope.uploadFiles = function(file, errFiles, type) {
      $scope.f = file;
      $scope.errFile = errFiles && errFiles[0];
      if (file) {
          file.upload = Upload.upload({
              url: '/image/new/'+$scope.id,
              method: 'POST',
              data: {file: file, type: type}
          }).then(function(response){
            if(response.err){
              console.log(err)
            }
            else{
              $scope.showUser();
            }
          });
          };
      }
  $scope.like = function(song_id, user_id, index){
    songFactory.like(song_id, user_id, function(data){
      $scope.user.uploaded_songs[index].likeFlag = true;
    })
  }
  $scope.disLike = function(song_id, user_id, index){
    songFactory.disLike(song_id, user_id, function(data){
      $scope.user.uploaded_songs[index].likeFlag = false;
    })
  }
  $scope.repost = function(song_id, user_id, index){
    songFactory.repost(song_id, user_id, function(data){
      $scope.user.uploaded_songs[index].repostFlag = true;
    })
  }
  $scope.removeRepost = function(song_id, user_id, index){
    songFactory.removeRepost(song_id, user_id, function(data){
      $scope.user.uploaded_songs[index].repostFlag = false;
    })
  };
  $scope.playlistLike = function(playlist_id, user_id, index){
    songFactory.playlistLike(playlist_id, user_id, function(data){
      $scope.user.playlists[index].likeFlag = true;
    })
  }
  $scope.playlistDisLike = function(playlist_id, user_id, index){
    songFactory.playlistDisLike(playlist_id, user_id, function(data){
      $scope.user.playlists[index].likeFlag = false;
    })
  }
  $scope.playlistRepost = function(playlist_id, user_id, index){
    songFactory.playlistRepost(playlist_id, user_id, function(data){
      $scope.user.playlists[index].repostFlag = true;
    })
  }
  $scope.playlistRemoveRepost = function(playlist_id, user_id, index){
    songFactory.playlistRemoveRepost(playlist_id, user_id, function(data){
      $scope.user.playlists[index].repostFlag = false;
    })
  };
  $scope.likeRepost = function(song_id, user_id, index){
    songFactory.like(song_id, user_id, function(data){
      $scope.user.reposts[index].likeFlag = true;
    })
  }
  $scope.disLikeRepost = function(song_id, user_id, index){
    songFactory.disLike(song_id, user_id, function(data){
      $scope.user.reposts[index].likeFlag = false;
    })
  }
  $scope.repostRepost = function(song_id, user_id, index){
    songFactory.repost(song_id, user_id, function(data){
      $scope.user.reposts[index].repostFlag = true;
    })
  }
  $scope.removeRepostRepost = function(song_id, user_id, index){
    songFactory.removeRepost(song_id, user_id, function(data){
      $scope.user.reposts[index].repostFlag = false;
    })
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
    console.log($scope.current.index);
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
        $location.url('/profile/'+$scope.user.username+"1"+"/"+$scope.user._id)
      })
    }

  $scope.edit = function(){
  $scope.modalInstance = $uibModal.open({
        animation: true,
        ariaLabelledBy: 'modal-title-top',
        ariaDescribedBy: 'modal-body-top',
        templateUrl: './partials/edit.html',
        controller: 'editUserController'
      })
      $scope.modalInstance.result.then(function(hello){
        console.log('closed')
      }, function(){
        $location.url('/profile/'+$scope.user.username+"2"+"/"+$scope.user._id)
      })
    }
    $scope.follow = function(user_id){
      userFactory.follow(user_id, $scope.id, function(data){
        if(data.err){
          console.log(data.err)
        }
        else{
          $scope.showUser();
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
          $scope.showUser();
        }
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
