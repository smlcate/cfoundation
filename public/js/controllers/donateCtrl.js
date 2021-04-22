app.controller('donateCtrl', ['$scope', '$http', '$window', '$compile', function($scope, $http, $window, $compile) {

  var stripe = Stripe('pk_test_51IMGPkFD34Zw3SUhg5g8OxNIsvr3Ud7GCwgAjC6eMK99lYdYGApOlZGHUiovM7feORWB43lbc87ax3v4ZyYomQga00PbKBmSuK');
  var elements = stripe.elements();


  var style = {
    base: {
      color: "#32325d",
    }
  };

  var card = elements.create("card", { style: style });
  card.mount("#card-element");

  var checkoutButton = document.getElementById('checkout-button');


  $scope.donations = {
    inputs: {
      monthly:false,
      amount:10,
      packs:1,
      otherPackAmount:1,
      billing: {
        fullName:'',
        email:'',
      }
    }
  }

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

    $('.donationDivs span p').css('color','black');

    if ($scope.donations.inputs.monthly == false) {
      $('#oneTimeText').css('color','#C4B0FF');
    } else {
      $('#monthlyText').css('color','#C4B0FF');
    }

  }

  $scope.selectBillingType = function(t) {
    $('#donationBillingSelectNav a').css('color','black');
    $('#'+t+'TypeAnc').css('color','#C4B0FF');
  }

  $scope.selectCarePackAmounts = function(amnt) {
    $scope.donations.inputs.packs = amnt;
    $('#donationDetailsCarePackAmountSelectDiv a').css('color','#C4B0FF');
    $('#donationDetailsCarePackAmountSelectDiv a').css('background','#f7f5ff');
    $('#'+amnt+'CarePackAnc').css('color','#f7f5ff');
    $('#'+amnt+'CarePackAnc').css('background','#C4B0FF');

    setDonationAmount();
  }

  function getItems() {
    $http.get('getItems')
    .then(function(res) {
      // console.log(res);
      $scope.careItems = [];
      for (var i = 0; i < res.data.length; i++) {
        var data = JSON.parse(res.data[i].itemData)
        $scope.careItems.push(data);
        $scope.careItems[i].id = res.data[i].id;

        if (data.tags.split(',')[0] == 'all') {

          $scope.packageCosts.tags[0].cost += data.price;
        }
        // console.log($scope.packageCosts.tags[0].cost);
        if (i == res.data.length -1) {
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
                        cost:$scope.packageCosts.tags[0].cost + item.price

                      })
                      if (j == $scope.careItems.length-1 && k == tags.length-1) {
                        // buildDisplays();
                        console.log($scope.carePackagePrice);
                        $scope.selectCarePackAmounts(1);
                      }
                      l = $scope.packageCosts.tags.length;
                    }
                    // console.log($scope.packageCosts.tags);
                  }
                }
              }

              // console.log(tags);
            }

          }
        }
      }
      // console.log($scope.careItems);
      // console.log($scope.packageCosts);
    })
  }

  function setDonationAmount() {
    $scope.donations.inputs.amount = $scope.donations.inputs.packs * $scope.packageCosts.tags[0].cost;
    console.log($scope.donations.inputs.amount);
  }

  function init() {
    $scope.changePage('donate');
    $scope.selectDonationType();
    $scope.selectBillingType('credit');
    getItems();


  }

  init();

}]);
