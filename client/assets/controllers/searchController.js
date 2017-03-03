app.controller("searchController", ["$scope", "$rootScope", "userFactory", "songFactory", "$location", "$cookies", "$routeParams", "$timeout","$uibModal", "$route", function($scope, $rootScope, userFactory, songFactory, $location, $cookies, $routeParams, $timeout, $uibModal, $route){
  $scope.search_query = $routeParams.term;
  $scope.total_tracks = 0;
  $scope.total_playlists = 0;
  $scope.total_users = 0;
  $scope.view = 0;
  $scope.id = $cookies.get("id")
  var surfers = []
  songFactory.search($routeParams.term, function(results) {
    $scope.results = results;
    $scope.total_tracks = results.songs.length + results.songs_by_artist.length + results.tags.length;;
    $scope.total_playlists = results.playlists.length;
    $scope.total_users = results.users.length;
    console.log(results.users)
    $scope.changeView(0)
  })
  $scope.changeView = function (view) {
    $scope.view = view;
    if (surfers.length > 0){
      for (var i = 0; i < surfers.length; i++){
        surfers[i].destroy();
      }
      surfers = []
    }
    if(view == 0){
      $scope.current = {index: 0, song: {}}
      for (var i = 0; i < $scope.results.songs_by_artist.length; i++) {
        $scope.results.songs_by_artist[i]._id = "a" + $scope.results.songs_by_artist[i]._id
      }
      for (var i = 0; i < $scope.results.tags.length; i++) {
        $scope.results.tags[i]._id = "t" + $scope.results.tags[i]._id
      }
      $scope.searchSongs = $scope.results.songs_by_artist.concat($scope.results.songs.concat($scope.results.tags))
      $timeout(function(){
        for (var i = 0; i < $scope.searchSongs.length; i++){
          $scope.wavemaker($scope.searchSongs[i])
        }
      }, 200);
      for (var i = 0; i < $scope.searchSongs.length; i++){
        var song = $scope.searchSongs[i]
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
    } else if(view == 1){
          for(var k = 0; k < $scope.results.users.length; k++){
            $scope.results.users[k].followercount = $scope.results.users[k].followers.length
            if($scope.results.users[k].followers.indexOf($scope.id) !== -1){
              $scope.results.users[k].followercheck = false
            }
            else{
              $scope.results.users[k].followercheck = true
            }
            console.log($scope.results.users[k])
          }
        }
    else if(view == 2){
      $scope.containerView = 2
      $scope.current = {index: 0, song: {}, playlist: {}};
      $timeout(function(){
        for (var i = 0; i < $scope.results.playlists.length; i++){
          $scope.wavemaker($scope.results.playlists[i].songs[0], -3, $scope.results.playlists[i]._id)
        }
      }, 500);
      for (var i = 0; i < $scope.results.playlists.length; i++){
        var playlist = $scope.results.playlists[i];
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
  $scope.like = function(song_id, user_id, index, type){
    songFactory.like(song_id.slice(1), user_id, function(data){
      $scope.results[type][index].likeFlag = true;
    })
  }
  $scope.disLike = function(song_id, user_id, index, type){
    songFactory.disLike(song_id.slice(1), user_id, function(data){
      $scope.results[type][index].likeFlag = false;
    })
  }
  $scope.repost = function(song_id, user_id, index, type){
    songFactory.repost(song_id.slice(1), user_id, function(data){
      $scope.results[type][index].repostFlag = true;
    })
  }
  $scope.removeRepost = function(song_id, user_id, index, type){
    songFactory.removeRepost(song_id.slice(1), user_id, function(data){
      $scope.results[type][index].repostFlag = false;
    })
  };
  $scope.playlistLike = function(playlist_id, user_id, index){
    songFactory.playlistLike(playlist_id, user_id, function(data){
      $scope.results.playlists[index].likeFlag = true;
    })
  }
  $scope.playlistDisLike = function(playlist_id, user_id, index){
    songFactory.playlistDisLike(playlist_id, user_id, function(data){
      $scope.results.playlists[index].likeFlag = false;
    })
  }
  $scope.playlistRepost = function(playlist_id, user_id, index){
    songFactory.playlistRepost(playlist_id, user_id, function(data){
      $scope.results.playlists[index].repostFlag = true;
    })
  }
  $scope.playlistRemoveRepost = function(playlist_id, user_id, index){
    songFactory.playlistRemoveRepost(playlist_id, user_id, function(data){
      $scope.results.playlists[index].repostFlag = false;
    })
  };

  $scope.follow = function(user_id, index){
    userFactory.follow(user_id, $scope.id, function(data){
      if(data.err){
        console.log(data.err)
      }
      else{
        $scope.results.users[index].followercheck = false
        $scope.results.users[index].followercount += 1
      }
  })
}
  $scope.unfollow = function(user_id, index){
    userFactory.unfollow(user_id, $scope.id, function(data){
      if(data.err){
        console.log(data.err)
      }
      else{
        $scope.results.users[index].followercheck = true
        $scope.results.users[index].followercount -= 1
      }
  })
}
$scope.open = function(song_id){
  console.log(song_id)
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
      console.log('hello');
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
}]);

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
