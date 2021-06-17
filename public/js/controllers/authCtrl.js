app.controller('authCtrl',  ['$scope', '$http','$window', '$compile', function($scope, $http, $window, $compile) {

  $scope.signIn = {
    error:''
  }

  $scope.auth = {
    email:'',
    password:'',
    checkPassword:''
  }

  // console.log('hello');

  $scope.signUp = function() {

    console.log($scope.auth)

    $http.get('getUsers')
    .then(function(res) {
      var users = res.data;
      var pass = true;
      console.log(users);
      for(var i = 0;i < users.length;i++) {
        if (users[i].email === $scope.auth.email) {
          pass = false;
          $('#emailErrorMessage').css('display','flex')
        }
      }
      if ($scope.auth.checkPassword !== $scope.auth.password) {
        pass = false;
        $('#passwordErrorMessage').css('display','flex')
      }

      if (pass === true) {

        $http.post('signUp', {auth:$scope.auth})
        .then(function(res) {
          console.log(res.data);

          sessionStorage.setItem('user',JSON.stringify(res.data));

          $scope.user = res.data;
          $scope.signedIn = true;
          console.log($scope.user);
          // $('.loginDisplays').css('display','none');
          // $('#accCreatedDisplay').css('display','flex');
          $('#signInUpHeaderInfoCell').css('display','none')
          $('#userHeaderInfoCell').css('display','flex')
          window.location.href = '#!/welcomePage';
          $window.location.reload();

        })

      }

    })

  }
  $scope.signIn = function() {

    console.log($scope.auth)


    $http.post('signIn', {auth:$scope.auth})
    .then(function(res) {
      console.log(res.data);
      if (res.data.success == false) {

        $scope.signIn.error = res.data.message;

      } else {

        $scope.signIn.error = '';

        sessionStorage.setItem('user',JSON.stringify(res.data));
        $('#userHeaderInfoCell').css('display','flex')
        $scope.user = res.data;
        $scope.signedIn = true;
        console.log($scope.user);

        $('#signInUpHeaderInfoCell').css('display','none')

        window.location.href = '#!/home';
        $window.location.reload();


      }

    })

  }





}])
