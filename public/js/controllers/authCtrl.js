app.controller('authCtrl',  ['$scope', '$http','$window', '$compile','$location', function($scope, $http, $window, $compile, $location) {

  $scope.signIn = {
    error:''
  }

  $scope.auth = {
    email:'',
    password:'',
    checkPassword:'',
    pass:true
  }

  $scope.passwordStart = function() {
    if ($scope.auth.password != '') {
      $('#signupCheckPasswordInput').css('display','flex');
    } else {
      $scope.auth.checkPassword = '';
      $('#signupCheckPasswordInput').css('display','none');
    }
  }

  $scope.checkPasswords = function() {
    if ($scope.auth.checkPassword !== $scope.auth.password) {
      $scope.auth.pass = false;
      $('#passwordSuccessMessage').css('display','none');
      $('#passwordErrorMessage').css('display','flex');
    } else {
      $scope.auth.pass = true;
      $('#passwordErrorMessage').css('display','none');
      $('#passwordSuccessMessage').css('display','flex');
    }

  }

  $scope.signUp = function() {

    $http.get('getUsers')
    .then(function(res) {
      var users = res.data;
      var pass = true;
      for(var i = 0;i < users.length;i++) {
        if (users[i].email === $scope.auth.email) {
          pass = false;
          $('#emailErrorMessage').css('display','flex')
        }
      }

      if ($scope.auth.pass === true) {
        $http.post('signUp', {auth:$scope.auth})
        .then(function(res) {
          sessionStorage.setItem('user',JSON.stringify(res.data));

          $scope.user = res.data;
          $scope.signedIn = true;

          $('#signInUpHeaderInfoCell').css('display','none')
          $('#userHeaderInfoCell').css('display','flex')
          window.location.href = '#!/welcomePage';
          $window.location.reload();

        })

      }

    })

  }
  $scope.signIn = function() {

    $http.post('signIn', {auth:$scope.auth})
    .then(function(res) {
      if (res.data.success == false) {

        $scope.signIn.error = res.data.message;

      } else {

        $scope.signIn.error = '';

        sessionStorage.setItem('user',JSON.stringify(res.data));
        $('#userHeaderInfoCell').css('display','flex')
        $scope.user = res.data;
        $scope.user.permission = res.data.permission;
        $scope.signedIn = true;

        $('#signInUpHeaderInfoCell').css('display','none')

        window.location.href = '#!/home';
        $window.location.reload();


      }

    })

  }

  console.log('hit');
  function start() {
    var path = $location.path();
    path = path.split('/')[1];

    if (path == '') {
      $scope.changePage('home', false);
    } else if (path[0] == 's') {
      $scope.changePage(path, true);
    } else {
      $scope.changePage(path, false);
    }
  }

  start();

}])
