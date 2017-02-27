app.controller("uploadController", ["$scope", "userFactory", "$location", "$cookies", 'Upload', "$timeout", function($scope, userFactory, $location, $cookies, Upload, $timeout){
      $scope.uploadFiles = function(file, errFiles) {
          $scope.f = file;
          $scope.errFile = errFiles && errFiles[0];
          if (file) {
              file.upload = Upload.upload({
                  url: '/songs/new',
                  method: 'POST',
                  data: {file: file}
              });

              file.upload.then(function (response) {
                  $timeout(function () {
                      file.result = response.data;
                  });
              }, function (response) {
                  if (response.status > 0)
                      $scope.errorMsg = response.status + ': ' + response.data;
              }, function (evt) {
                  file.progress = Math.min(100, parseInt(100.0 *
                                           evt.loaded / evt.total));
              });
          }
      }
}])
