app.controller("searchController", ["$scope", "userFactory", "songFactory", "$location", "$cookies", "$routeParams", "$timeout", function($scope, userFactory, songFactory, $location, $cookies, $routeParams, $timeout){
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
      $scope.searchSongs = $scope.results.songs_by_artist.concat($scope.results.songs.concat($scope.results.tags))
      $timeout(function(){
        for (var i = 0; i < $scope.searchSongs.length; i++){
          console.log($scope.searchSongs);
          $scope.wavemaker($scope.searchSongs[i])
        }
      }, 200);
      for (var i = 0; i < $scope.searchSongs.length; i++){
        var song = $scope.searchSongs[i]
        song.well_timed_comments = {}
        console.log(song.likes);
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
    songFactory.like(song_id, user_id, function(data){
      $scope.results[type][index].likeFlag = true;
    })
  }
  $scope.disLike = function(song_id, user_id, index, type){
    songFactory.disLike(song_id, user_id, function(data){
      $scope.results[type][index].likeFlag = false;
    })
  }
  $scope.repost = function(song_id, user_id, index, type){
    songFactory.repost(song_id, user_id, function(data){
      $scope.results[type][index].repostFlag = true;
    })
  }
  $scope.removeRepost = function(song_id, user_id, index, type){
    songFactory.removeRepost(song_id, user_id, function(data){
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
