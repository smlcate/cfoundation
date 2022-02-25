app.controller('authCtrl',  ['$scope', '$http','$window', '$compile','$location', function($scope, $http, $window, $compile, $location) {

  var monthNames =  ['January','February','March','April','May','June','July','August','September','October','November','December'];

  var monthDays = [31,28,31,30,31,30,31,31,30,31,30,31];

  var daysOfWeek = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  // /^[^ ]+@[^ ]+\.[a-z]{2,3}$/

  $scope.signIn = {
    error:''
  }

  $scope.auth = {
    email:'',
    password:'',
    checkPassword:'',
    pass:true
  }

  $scope.recovery = {
    email:'',
    exists:true,
    newPass:'',
    confirmPass:''
  }

  $scope.userDonations = [];
  $scope.usersRecDonations = [];

  $scope.donationAdjustment = {
    newTotal:0,
    adjusting:false,
    donation: {}
  }

  $scope.requestPasswordReset = function() {
    $http.post('requestPasswordReset', {email:$scope.recovery.email})
    .then(function(res) {
      console.log(res.data);
      if (res.data == "Email isn't registered") {
        $scope.recovery.exists = false;
      } else {
        var tempParams = {
          to_email: $scope.recovery.email,
          from_name: 'yellowbagofhumanity.com',
          link:res.data.link
        }
        emailjs.send('service_v3v8m39','template_d9f448g', tempParams)
        .then(function(res) {
          console.log('success', res.status);
          $('#forgotPasswordConfirmationDisplay').css('display','flex');
          $('#forgotPasswordFormDisplay').css('display','none');
        })
        .catch(function(err) {
          console.log(err);
        })
      }
    })
    .catch(function(err) {
      console.log(err);
    })
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

      if (pass === true) {
        $http.post('signUp', {auth:$scope.auth})
        .then(function(res) {
          // console.log(res.data);
          $scope.user = res.data.user_data;
          $scope.user.email = res.data.email;
          $scope.user.donations = [];
          // $scope.user.permission = res.data.permission;
          // $scope.user.donations = res.data.donations;
          $scope.signedIn = true;
          // console.log('USER' + $scope.user);
          sessionStorage.setItem('user',JSON.stringify($scope.user));
          $('#signInUpHeaderInfoCell').css('display','none')
          window.location.href = '#!/welcomePage';
          $window.location.reload();

        })

      }

    })

  }

  $scope.signIn = function() {

    $http.post('signIn', {auth:$scope.auth})
    .then(function(res) {
      // console.log(res);
      // console.log(res.data);
      if (res.data.success == false) {

        $scope.signIn.error = res.data.message;

      } else {

        $scope.signIn.error = '';

        $('#userHeaderInfoCell').css('display','flex')
        $scope.user = res.data;
        // $scope.user.permission = res.data.permission;
        // $scope.user.donations = res.data.donations;
        $scope.signedIn = true;
        // console.log('USER' + $scope.user);
        sessionStorage.setItem('user',JSON.stringify($scope.user));
        $('#signInUpHeaderInfoCell').css('display','none')

        window.location.href = '#!/home';
        $window.location.reload();


      }

    })

  }

  $scope.adjustRecurringDonation = function(donation) {
    console.log(donation);
    $scope.donationAdjustment = {
      newTotal: donation.reg.donation_data.invoice.total,
      adjusting: true,
      donation: donation
    }
    console.log($scope.donationAdjustment);
  }

  $scope.cancelRecPledgeAdjustment = function() {
    $scope.donationAdjustment.adjusting = false;
  }

  $scope.endRecPledge = function() {
    console.log($scope.donationAdjustment);
    $http.post('endRecPledge', {donation:$scope.donationAdjustment.donation})
    .then(function(res) {
      console.log(res);
    })
    .catch(function(err) {
      console.log(err);
    })
  }

  $scope.updateRecPledge = function() {
    $http.post('updateRecPledge', $scope.donationAdjustment)
    .then(function(res) {
      console.log(res);
    })
    .catch(function(err) {
      console.log(err);
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
        console.log(res.data);
        // var hello = 'hello';
        for (var i = 0; i < res.data.length; i++) {

          res.data[i].reg.donation_data = JSON.parse(res.data[i].reg.donation_data);
          console.log(i);
          if (res.data[i].reg.donation_data.invoice && res.data[i].reg.donation_data.invoice.recurring == true) {

            var donor;
            var donorStartDate;

            if (res.data[i].rec) {
              donor  = JSON.parse(res.data[i].rec.recurring_donor_data);
              donorStartDate = new Date(donor.billingTimestamp);

              var creationDate = [
                donorStartDate.getMonth(),
                donorStartDate.getDate(),
                donorStartDate.getYear(),
              ]
              creationDate[2] = JSON.stringify(creationDate[2]);
              creationDate[2] = creationDate[2].slice(1);
              console.log(creationDate);

              res.data[i].reg.donation_data.invoice.pretty_creation_date = monthNames[creationDate[0]] + " " + creationDate[1] + ", " + "20" + creationDate[2];

              var now = new Date();

              var dateToCheck = [
                now.getMonth(),
                now.getDate(),
                now.getYear()
              ]

              dateToCheck[2] = JSON.stringify(dateToCheck[2]);
              dateToCheck[2] = dateToCheck[2].slice(1);

              var nextChargeDate = [
                dateToCheck[0],
                creationDate[1],
                dateToCheck[2]
              ]
              // console.log(nextChargeDate);
              if (dateToCheck[0] == creationDate[0] && dateToCheck[1] == creationDate[1] && dateToCheck[2] == creationDate[2]) {
                nextChargeDate[0]++;
              } else
              //check if date is past charge date (already charged this month)
              if (dateToCheck[1] > creationDate[1] && dateToCheck[0] == 11) {
                console.log('hit');
                nextChargeDate[0] = 0;
                Number(nextChargeDate[2])++;
              }
              if (dateToCheck[1] > creationDate[1]) {
                console.log('hit 2');
                nextChargeDate[0] = dateToCheck[0] + 1;
                if (nextChargeDate[0] > 11) {
                  nextChargeDate[0] = 0;
                }
              }
              if (monthDays[nextChargeDate[0]] < creationDate[1]) {
                console.log('hit 3');
                nextChargeDate[1] = monthDays[nextChargeDate[0]];
              }

              console.log(nextChargeDate);
              res.data[i].reg.donation_data.invoice.pretty_next_charge_date = monthNames[nextChargeDate[0]] + " " + nextChargeDate[1] + ", " + "20" + nextChargeDate[2];
            } else {
              donor = res.data[i].reg.donation_data;
            }

            // if (dateToCheck[2] != creationDate[2]) {
            //   if (creationDate[1] == 31 && dateToCheck[1] == 30 && monthDays[dateToCheck[0]-1] == 30) {
            //     creationDate[1] == 30;
            //   }
            //   if (dateToCheck[1] == creationDate[1]) {
            //     charge = true;
            //   }
            // } else if(dateToCheck[0] != creationDate[0]) {
            //   if (creationDate[1] == 31 && dateToCheck[1] == 30 && monthDays[dateToCheck[0]-1] == 30) {
            //     creationDate[1] == 30;
            //   }
            //   if (dateToCheck[1] == creationDate[1]) {
            //     charge = true;
            //   }
            // }
          }
        }
        for (var i = 0; i < res.data.length; i++) {
          if(res.data[i].rec && res.data[i].rec != null) {
            $scope.usersRecDonations.push(res.data[i]);
          } else {
            $scope.userDonations.push(res.data[i]);
          }
        }
        console.log($scope.userDonations);
        console.log($scope.usersRecDonations);
      })
      .catch(function(err) {
        console.log(err);
      })
    }

  }

  start();

}])
