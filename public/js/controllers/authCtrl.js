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

  $scope.userDonations = [];

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
      console.log(res);
      if (res.data.success == false) {

        $scope.signIn.error = res.data.message;

      } else {

        $scope.signIn.error = '';

        $('#userHeaderInfoCell').css('display','flex')
        $scope.user = res.data;
        // $scope.user.permission = res.data.permission;
        // $scope.user.donations = res.data.donations;
        $scope.signedIn = true;
        console.log('USER' + $scope.user);
        sessionStorage.setItem('user',JSON.stringify($scope.user));
        $('#signInUpHeaderInfoCell').css('display','none')

        window.location.href = '#!/home';
        $window.location.reload();


      }

    })

  }

  function start() {
    var path = $location.path();
    path = path.split('/')[1];

    if (path == '') {
      $scope.changePage('home', false);
    } else if (path[0] == 's' || path[1] == 'r') {
      $scope.changePage(path, true);
    } else {
      $scope.changePage(path, false);
    }

    if ($scope.user != null && $scope.user.email) {
      $http.post('getUsersDonations',$scope.user)
      .then(function(res) {
        for (var i = 0; i < res.data.length; i++) {
          res.data[i].reg.donation_data = JSON.parse(res.data[i].reg.donation_data);
        }
        $scope.userDonations = res.data;
        console.log($scope.userDonations);
      })
      .catch(function(err) {
        console.log(err);
      })
    }

  }

  start();

}])
