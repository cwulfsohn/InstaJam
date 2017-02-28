app.controller("profileController", ["$scope", "userFactory","songFactory", "$location", "$cookies", 'Upload', "$timeout", "$routeParams","$uibModal", function($scope, userFactory, songFactory, $location, $cookies, Upload, $timeout, $routeParams, $uibModal){
  if ($cookies.get("user")){
    $scope.currentUser = $cookies.get("user");
  }
  else {
    $location.url('/')
  }

  $scope.profile_id = $routeParams.id;
  $scope.id = $cookies.get('id');
  $scope.firstName = $cookies.get('user');
  $scope.containerView = 0;
  $scope.showUser = function(){
    userFactory.showUser($scope.profile_id, function(data){
      if(data.err){
        console.log(data.err)
      }
      else{
        $scope.user = data.user;
      }
    })
  }
  $scope.changeView = function(number){
    if(number == 0){
      $scope.containerView = 0;
    }
    else if(number == 1){
      $scope.containerView = 1;
      console.log($scope.user.uploaded_songs);
      for (var i = 0; i < $scope.user.uploaded_songs.length; i++){
        console.log($scope.user.uploaded_songs);
        $scope.wavemaker("#" + $scope.user.uploaded_songs[i]._id.toString())
      }
    }
    else if(number == 2){
      $scope.containerView = 2
    }
    else{
      $scope.containerView = 3
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
  $scope.like = function(song_id, user_id){
    songFactory.like(song_id, user_id, function(data){
      $scope.showUser();
    })
  }
  $scope.disLike = function(song_id, user_id){
    songFactory.disLike(song_id, user_id, function(data){
      $scope.showUser();
    })
  }
  $scope.repost = function(song_id, user_id){
    songFactory.repost(song_id, user_id, function(data){
      $scope.showUser();
    })
  }
  $scope.removeRepost = function(song_id, user_id){
    songFactory.removeRepost(song_id, user_id, function(data){
      $scope.showUser();
    })
  };
  $scope.wavemaker = function(songId){
    var wavesurfer = WaveSurfer.create({
      container: songId,
      waveColor: '#17BEBB',
      progressColor: '#EF3E36',
      cursorColor: '#EF3E36',
      barWidth: 2,
      cursorWidth:0
        });
    wavesurfer.load($scope.song.song_file);

    wavesurfer.on('ready', function () {
      $("#length").text(secondsToMinSec(wavesurfer.getDuration()));
      $('#play').click(function() {
        wavesurfer.playPause();
      });
      wavesurfer.on('audioprocess', function(){
          $("#currentTime").text("Current second:" + wavesurfer.getCurrentTime());
      })
    });
  };
  $scope.open = function(song_id){
    $cookies.put('songId', song_id)
  $uibModal.open({
        animation: true,
        ariaLabelledBy: 'modal-title-top',
        ariaDescribedBy: 'modal-body-top',
        templateUrl: './partials/playlist.html',
        contorller: 'playlistController'
      });
    }
}])
