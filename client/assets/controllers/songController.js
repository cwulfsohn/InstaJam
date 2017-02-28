app.controller("songController", ["$scope", "songFactory", "$location", "$cookies", "$routeParams", "$sce", function($scope, songFactory, $location, $cookies, $routeParams, $sce){
  if ($cookies.get("user")){
    $scope.currentUser = $cookies.get("user");
  }
  else {
    $location.url('/')
  }
  $scope.logout = function(){
    $scope.currentUser = {};
    $cookies.remove("user");
    $location.url('/');
  }
  $scope.getSong = function(){
    songFactory.getSong($routeParams.id, function(data){
      $scope.song = data.song;
      var wavesurfer = WaveSurfer.create({
        container: '#waveform_preview',
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
            wavesurfer.play();
        });
        $('#pause').click(function() {
            wavesurfer.pause();
        });
        wavesurfer.on('audioprocess', function(){
            $("#currentTime").text("Current second:" + wavesurfer.getCurrentTime());
        })
      });
    })
  };
  $scope.getSong();
}])

function secondsToMinSec(seconds){
  var string = ""
  var minutes = Math.trunc(seconds/60);
  var seconds = Math.trunc(seconds%60);
  return string + minutes + ":" + seconds;
}
