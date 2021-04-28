app.controller('donateCtrl', ['$scope', '$http', '$window', '$compile', function($scope, $http, $window, $compile) {

  var stripe = Stripe('pk_test_51IMGPkFD34Zw3SUhg5g8OxNIsvr3Ud7GCwgAjC6eMK99lYdYGApOlZGHUiovM7feORWB43lbc87ax3v4ZyYomQga00PbKBmSuK');
  var elements = stripe.elements();


  var style = {
    base: {
      color: "#32325d",
      fontSize: "30px",
    }
  };

  var card = elements.create("card", { style: style });
  card.mount("#card-element");

  var checkoutButton = document.getElementById('checkout-button');

  paypal.Buttons().render('#paypal-button-container');

  function setDonationAmount() {
    $scope.donations.inputs.amount = $scope.donations.inputs.packs * $scope.carePackagePrice;
    $scope.donations.totalAmount = $scope.donations.inputs.amount;
    console.log($scope.donations.inputs.amount);
  }

  function getCarePackagePrice() {
    if ($scope.carePackagePrice == 0) {
      $http.get('getCarePackagePrice')
      .then(function(res) {
        console.log(res);
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
    console.log($scope.donations);

    $('.donationDivs span p').css('color','#4E3B86');

    $('#donationDetailsSummaryDiv .variableDonationTexts').css('display','none');

    if ($scope.donations.inputs.monthly == false) {
      $('#oneTimeText').css('color','#C4B0FF');
      $('#oneTimeDonationSummaryText').css('display','flex');
    } else {
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
    console.log(amnt);
    $scope.donations.inputs.packs = amnt;
    $scope.donations.rolloverAmount = 0;
    $('#donationDetailsCarePackAmountSelectDiv a').css('color','#C4B0FF');
    $('#donationDetailsCarePackAmountSelectDiv a').css('background','#f7f5ff');
    $('#'+amnt+'CarePackAnc').css('color','#f7f5ff');
    $('#'+amnt+'CarePackAnc').css('background','#C4B0FF');

    getCarePackagePrice();
  }

  $scope.changeAmount = function() {
    console.log($scope.carePackagePrice);
    console.log($scope.donations.inputs.amount / $scope.carePackagePrice);
    var packs = (($scope.donations.inputs.amount / $scope.carePackagePrice).toString()).split('.')[0];
    packs = Number(packs);
    var rollover =$scope.donations.inputs.amount - (packs * $scope.carePackagePrice);
    console.log(packs);
    console.log(rollover);

    $scope.donations.inputs.packs = packs;
    $scope.donations.rolloverAmount = rollover;
    $scope.donations.totalAmount = $scope.donations.inputs.amount;
  }

  $scope.otherPacks = function() {
    $scope.donations.rolloverAmount = 0;
    $scope.donations.totalAmount = $scope.donations.inputs.packs * $scope.carePackagePrice;
    $scope.donations.inputs.amount = $scope.donations.inputs.packs * $scope.carePackagePrice;

  }
  // getCarePackagePrice();


  function getItems() {
    console.log('hit');
    $http.get('getItems')
    .then(function(res) {
      // console.log(res);
      console.log('hittt');
      $scope.careItems = [];
      for (var i = 0; i < res.data.length; i++) {
        var data = JSON.parse(res.data[i].itemData)
        $scope.careItems.push(data);
        $scope.careItems[i].id = res.data[i].id;

        if (data.tags.split(',')[0] == 'all') {

          $scope.carePackagePrice += data.price;
        }
        // console.log($scope.carePackagePrice);
        if (i == res.data.length -1) {
          console.log('hit');
          // console.log($scope.packageCosts);
          for (var j = 0; j < $scope.careItems.length; j++) {
            var item = $scope.careItems[j];
            var tags = item.tags.split(',');
            if (tags[0] != 'all') {

              for (var k = 0; k < tags.length; k++) {

                var tag = tags[k]
                // var exists = false;
                for (var l = 0; l < $scope.packageCosts.tags.length; l++) {
                  // console.log(item.name,tag);
                  if ($scope.packageCosts.tags[l].tag == tag) {

                    $scope.packageCosts.tags[l].cost += item.price;
                    // console.log($scope.packageCosts.tags[l].cost);
                    l = $scope.packageCosts.tags.length;
                    // exists = true;
                  } else {
                    if (l == $scope.packageCosts.tags.length-1) {
                      $scope.packageCosts.tags.push({
                        tag:tag,
                        cost:$scope.carePackagePrice + item.price


                      })
                      if (j == $scope.careItems.length-1 && k == tags.length-1) {
                        // buildDisplays();
                        console.log($scope.carePackagePrice);
                        console.log('hit');
                        $scope.selectCarePackAmounts(1);
                      }
                      l = $scope.packageCosts.tags.length;
                    }
                    // console.log($scope.packageCosts.tags);
                  }
                }
              }

              // console.log(tags);
            } else if(j == $scope.careItems.length-1) {
              $scope.selectCarePackAmounts(1);
            }

          }
        }
      }
      // console.log($scope.careItems);
      // console.log($scope.packageCosts);
    })
  }


  function init() {
    $scope.changePage('donate');
    $scope.selectDonationType();
    $scope.selectBillingType('credit');
    // getItems();
    $scope.selectCarePackAmounts(1);

  }

  init();

}]);
