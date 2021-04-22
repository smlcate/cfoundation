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

  function init() {
    $scope.changePage('donate');
    $scope.selectDonationType();
    $scope.selectBillingType('credit');

  }

  init();

}]);
