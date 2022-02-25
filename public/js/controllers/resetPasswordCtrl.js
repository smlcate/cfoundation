app.controller('resetPasswordCtrl', ['$scope', '$http', '$window', '$compile', function($scope, $http, $window, $compile) {

  $scope.auth = {
    email:'',
    password:'',
    confirmPassword: '',
    validate: true
  }

  function confirmPasswordReset() {
    if ($scope.auth.password == $scope.auth.confirmPassword) {
      $http.post('resetPassword', {auth: $scope.auth})
      .then(function(res) {
        console.log(res);
        window.location.href = '/#!/signin';
        $window.location.reload();
      })
      .catch(function(err) {
        console.log(err);
      })
    } else {
      $scope.auth.validate = false;
    }
  }

  $scope.confirmPasswordReset = function() {
    confirmPasswordReset();
  }

  function start() {
    $http.post('verifyPasswordReset', {user: {id:$scope.recoverId,token:$scope.recoverToken}})
    .then(function(res) {
      if (res.data.status = 'success') {
        $scope.auth.email = res.data.email;
      } else if (res.data.status = 'error') {

      }
      console.log(res);
    })
    .catch(function(err) {
      console.log(err);
    })
  }

  start();

}])
