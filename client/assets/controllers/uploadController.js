app.controller("uploadController", ["$scope", "songFactory", "$location", "$cookies", 'Upload', "$timeout", function($scope, songFactory, $location, $cookies, Upload, $timeout){
  if ($cookies.get("id")){
    $scope.currentUserId = $cookies.get("id");
    $scope.song = {}
  }

  $scope.uploadFiles = function(file) {
    $scope.song.uploader = $scope.currentUserId;
    if (file) {
      file.upload = Upload.upload({
        url: '/songs/new',
        method: 'POST',
        data: {file: file, song: $scope.song}
      });

      file.upload.then(function(data){
        if (data.data.err){
          $scope.errors = []
          for (var key in data.data.err.errors){
            $scope.errors.push(data.data.err.errors[key].message);
          }
        }
        else {
          $scope.newSong = data.data.song;
          console.log($scope.newSong);
        }
      });
    }
    else {
      $scope.errors = ["Must upload a file/file is too large"]
    }
  };
  $scope.addCover = function(file) {
    if (file) {
      file.upload = Upload.upload({
        url: '/songs/new/art',
        method: 'POST',
        data: {file: file, song: $scope.newSong._id}
      });
      file.upload.then(function(data){
        if (data.data.err){
          $scope.errors = []
          for (var key in data.data.err.errors){
            $scope.errors.push(data.data.err.errors[key].message);
          }
        }
        else {
          $location.url('/song/' + data.data.song._id)
        }
      });
    }
    else {
      $scope.errors = ["Must upload a file/file is too large"]
    }
  };
  $scope.default
}])
