app.controller('donateCtrl', ['$scope', '$http', '$window', '$compile', function($scope, $http, $window, $compile) {

  var stripe = Stripe('pk_live_51JpLEKHS4sILE1hO6mCqrgNCRlrwsfrlZNnCiGk10HW35KUS3exg2TOhmjvlh7QgUQy9X3QKJ5MLKUmpRRaNLyDv006YJKAwq9');

  var elements = stripe.elements();


  var style = {
    base: {
      color: "#32325d",
      fontSize: "30px",
    }
  };

  var card = elements.create("card", { style: style });
  card.mount("#card-element");

  const form = $('#payment-form');

  var checkoutButton = document.getElementById('checkout-button');

  paypal.Buttons().render('#paypal-button-container');

  function setDonationAmount() {
    $scope.donations.inputs.amount = $scope.donations.inputs.packs * $scope.carePackagePrice;
    $scope.donations.totalAmount = $scope.donations.inputs.amount;
  }

  function getCarePackagePrice() {
    if ($scope.carePackagePrice == 0) {
      $http.get('getCarePackagePrice')
      .then(function(res) {
        $scope.carePackagePrice = Number(res.data[0].settingsData);
        setDonationAmount();
      })
      .catch(function(err) {
        console.log(err);
      })
    } else {
      setDonationAmount();
    }
  }



  $scope.donations = {
    rolloverAmount:0,
    totalAmount:10,
    inputs: {
      monthly:false,
      amount:10,
      packs:1,
      anon:false,
      billing: {
        fullName:'',
        email:'',
        password:'',
        confirmPassword:''
      }
    }
  }

  $scope.careItems = [];

  $scope.carePackagePrice = 0;

  $scope.packageCosts = {
    tags:[
      {
        tag:'all',
        cost:0
      }
    ]
  };


  $scope.selectDonationType = function() {

    $('.donationDivs span p').css('color','#4E3B86');

    $('#donationDetailsSummaryDiv .variableDonationTexts').css('display','none');

    if ($scope.donations.inputs.monthly == false) {
      // $scope.donations.inputs.monthly = true;
      $('#oneTimeText').css('color','#C4B0FF');
      $('#oneTimeDonationSummaryText').css('display','flex');
    } else {
      // $scope.donations.inputs.monthly = false;
      $('#monthlyText').css('color','#C4B0FF');
      $('#monthlyDonationSummaryText').css('display','flex');
    }

  }

  $scope.selectBillingType = function(t) {
    $('#donationBillingSelectNav a').css('color','#C4B0FF');
    $('#donationBillingSelectNav a').css('background','#f7f5ff');
    // $('#donationBillingSelectNav a').css('filter','none');
    $('.donationBillingTypeDivs').css('display','none');


    $('#'+t+'TypeAnc').css('color','f7f5ff');
    $('#'+t+'TypeAnc').css('background','#C4B0FF');
    // $('#'+t+'TypeAnc').css('filter','drop-shadow(0px 1px 1px black)');
    $('#'+t+'BillingDiv').css('display','flex');


  }

  $scope.selectCarePackAmounts = function(amnt) {
    $scope.donations.inputs.packs = amnt;
    $scope.donations.rolloverAmount = 0;
    $('#donationDetailsCarePackAmountSelectDiv a').css('color','#C4B0FF');
    $('#donationDetailsCarePackAmountSelectDiv a').css('background','#f7f5ff');
    $('#'+amnt+'CarePackAnc').css('color','#f7f5ff');
    $('#'+amnt+'CarePackAnc').css('background','#C4B0FF');

    getCarePackagePrice();
  }

  $scope.changeAmount = function() {
    var packs = (($scope.donations.inputs.amount / $scope.carePackagePrice).toString()).split('.')[0];
    packs = Number(packs);
    var rollover =$scope.donations.inputs.amount - (packs * $scope.carePackagePrice);

    $scope.donations.inputs.packs = packs;
    $scope.donations.rolloverAmount = rollover;
    $scope.donations.totalAmount = $scope.donations.inputs.amount;
  }

  $scope.otherPacks = function() {
    $scope.donations.rolloverAmount = 0;
    $scope.donations.totalAmount = $scope.donations.inputs.packs * $scope.carePackagePrice;
    $scope.donations.inputs.amount = $scope.donations.inputs.packs * $scope.carePackagePrice;

  }

  function buildDonationPage() {
    if ($scope.user != null && $scope.user != undefined) {

      $scope.donations.inputs.billing.email = $scope.user.email;
      $scope.donations.inputs.billing.fullName = $scope.user.fullName;

    }
  }

  function getItems() {
    $http.get('getItems')
    .then(function(res) {

      $scope.careItems = [];

      for (var i = 0; i < res.data.length; i++) {

        var data = JSON.parse(res.data[i].itemData)
        $scope.careItems.push(data);
        $scope.careItems[i].id = res.data[i].id;

        if (data.tags.split(',')[0] == 'all') {

          $scope.carePackagePrice += data.price;
        }

        if (i == res.data.length -1) {
          for (var j = 0; j < $scope.careItems.length; j++) {
            var item = $scope.careItems[j];
            var tags = item.tags.split(',');
            if (tags[0] != 'all') {

              for (var k = 0; k < tags.length; k++) {

                var tag = tags[k]

                for (var l = 0; l < $scope.packageCosts.tags.length; l++) {
                  if ($scope.packageCosts.tags[l].tag == tag) {

                    $scope.packageCosts.tags[l].cost += item.price;
                    l = $scope.packageCosts.tags.length;
                  } else {
                    if (l == $scope.packageCosts.tags.length-1) {
                      $scope.packageCosts.tags.push({
                        tag:tag,
                        cost:$scope.carePackagePrice + item.price


                      })
                      if (j == $scope.careItems.length-1 && k == tags.length-1) {
                        $scope.selectCarePackAmounts(1);
                      }
                      l = $scope.packageCosts.tags.length;
                    }
                  }
                }
              }
            } else if(j == $scope.careItems.length-1) {
              $scope.selectCarePackAmounts(1);
            }

          }
        }
      }
    })
  }

  $scope.confirmDonation  = async (e) => {
    // e.preventDefault();
    const clientSecret = await $http.post('createPaymentIntent', {paymentMethodType:card, currency:'usd', amount:$scope.donations.totalAmount*100})
    .then(function(res) {
      console.log(res.data);
      return res.data.clientSecret;
    });

    const {paymentIntent} = await stripe.confirmCardPayment(
      clientSecret, {
        payment_method: {
          card: card,
          billing_details: {
            name: $scope.donations.inputs.billing.name,
            email: $scope.donations.inputs.billing.email,
          }
        }
      }
    );

    if (paymentIntent.status == 'succeeded') {

      // Donations include: total donation amount, email and name of donor, if recurring - stripe/paypal customer id
      if ($scope.donations.inputs.billing.email != null && $scope.donations.inputs.billing.email != '' && $scope.donations.inputs.billing.email != undefined) {
        if ($scope.donations.inputs.billing.fullName != null && $scope.donations.inputs.billing.fullName != '' && $scope.donations.inputs.billing.fullName != undefined) {
          var donation = {
            email: $scope.donations.inputs.billing.email,
            fullName: $scope.donations.inputs.billing.fullName,
            invoice: {
              total: $scope.donations.totalAmount,
              rollover:$scope.donations.rolloverAmount,
              packs: $scope.donations.inputs.packs,
              packagePrice: $scope.carePackagePrice,
              recurring: $scope.donations.inputs.monthly
            }
          }

          if ($scope.signedIn == false && $scope.donations.inputs.monthly ==  true) {

            if ($scope.donations.inputs.billing.password != null && $scope.donations.inputs.billing.password != '' && $scope.donations.inputs.billing.password != undefined) {

              if ($scope.donations.inputs.billing.confirmPassword != null && $scope.donations.inputs.billing.confirmPassword != '' && $scope.donations.inputs.billing.confirmPassword != undefined) {

                if ($scope.donations.inputs.billing.password == $scope.donations.inputs.billing.confirmPassword) {

                  $http.get('getUsers')
                  .then(function(res) {
                    var users = res.data;
                    var pass = true;
                    var auth = {
                      email: $scope.donations.inputs.billing.email,
                      fullName: $scope.donations.inputs.billing.fullName,
                      password: $scope.donations.inputs.billing.password
                    }

                    for(var i = 0;i < users.length;i++) {
                      if (users[i].email === auth.email) {
                        pass = false;
                        $('#emailErrorMessage').css('display','flex')
                      }
                    }

                    if (pass === true) {

                      $http.post('signUp', {auth:auth})
                      .then(function(res) {

                        sessionStorage.setItem('user',JSON.stringify(res.data));

                        $scope.user = res.data;
                        $scope.signedIn = true;

                        $('#signInUpHeaderInfoCell').css('display','none')
                        $('#userHeaderInfoCell').css('display','flex')

                        $http.post('makeDonation', {donation:donation})
                        .then(function(res) {
                          window.location.href = '/#!/';
                          $window.location.reload();
                        })
                        .catch(function(err) {
                          console.log(err);
                        })

                      })

                    }

                  })
                }
              } else {
                //check password error
              }
            } else {
              // password error
            }

          } else {

            $http.post('makeDonation', {donation:donation})
            .then(function(res) {
              window.location.href = '/#!/';
              $window.location.reload();
            })
            .catch(function(err) {
              console.log(err);
            })

          }
        } else {
          //only name error
        }

      } else {
        //email error
        if ($scope.donations.inputs.billing.email != null && $scope.donations.inputs.billing.email != '' && $scope.donations.inputs.billing.email != undefined) {
          //email and name error
        }
      }
    } else {
      console.log('Payment Failed');
    }



  }


  function init() {
    $scope.changePage('donate');
    $scope.selectDonationType();
    $scope.selectBillingType('credit');
    // getItems();
    $scope.selectCarePackAmounts(1);
    buildDonationPage();
  }

  init();

}]);
