
app.controller('orderCtrl', ['$scope', '$http', '$window', '$compile', function($scope, $http, $window, $compile) {

  var stripe = Stripe('pk_test_51JpLEKHS4sILE1hOo0Pobyo8MhuazGd6DFXzi0pMXj1oaSkP1MZHblgDrYIAVi7H5xL0K3IBhjPW44UMejOctYVt00hnckXsJK');
  var elements = stripe.elements();


  var style = {
    base: {
      color: "#32325d",
      fontSize: "30px"
    }
  };

  var card = elements.create("card", { style: style });
  card.mount("#card-element");

   var checkoutButton = document.getElementById('checkout-button');

  $scope.order = {
    recipient: {
      name:'',
      diagnosies:[]
    },
    contents:[],
    card_message:'',
    shipping: {
      address:'',
      city:'',
      state:'',
      room:''
    },
    billing: {
      email:'',
      fName:'',
      lName:''
    }
  }

  $scope.display = 0;

  function sendOrder() {
    $http.post('newOrder', {order:JSON.stringify($scope.order)})
    .then(function(res) {
      // console.log(res);
    })
    .catch(function(err) {
      console.log(err);
    })
  }

  // function buildFilterNav() {
  //   for (var j = 0; j < $scope.ribbons.length; j++) {
  //   for (var i = 0; i < $scope.filterTags.length; i++) {
  //
  //       if ($scope.ribbons[j].ribbonData.name == 'Rectal') {
  //       }
  //
  //       if ($scope.filterTags[i] == $scope.ribbons[j].ribbonData.name[0].toLowerCase() + $scope.ribbons[j].ribbonData.name.slice(1)) {
  //         ribbon = $scope.ribbons[j].ribbonData;
  //         $scope.ribbonsToShow.push(ribbon);
  //         buildDisplays();
  //
  //       }
  //     }
  //   }
  // }

  function getItems() {
    $http.get('getItems')
    .then(function(res) {
      $scope.careItems = [];
      for (var i = 0; i < res.data.length; i++) {
        var data = JSON.parse(res.data[i].itemData)
        $scope.careItems.push(data);
        $scope.careItems[i].id = res.data[i].id;
        if (data.tags.split(',')[0] != 'all') {
          tags = data.tags.split(',');
          if ($scope.filterTags.length > 0) {
            for (var k = 0; k < tags.length; k++) {
              var exists = false;
              for (var j = 0; j < $scope.filterTags.length; j++) {

                if ($scope.filterTags[j] == tags[k][0].toLowerCase() + tags[k].slice(1)) {
                  exists == true;
                  j = $scope.filterTags.length;
                } else if(j == $scope.filterTags.length-1 && exists == false) {
                  $scope.filterTags.push(tags[k]);
                }

              }
            }
          } else {
            $scope.filterTags = data.tags.split(',');
          }

        }
        if (i == res.data.length-1) {
          // buildFilterNav();
        }

      }
    })
  }


  function buildItemDisplay() {
    $scope.careItemsToDisplay = [];
    for (var i = 0; i < $scope.careItems.length; i++) {
      var tags = $scope.careItems[i].tags.split(',');
      if (tags[0] == 'all') {
        $scope.careItemsToDisplay.push($scope.careItems[i])
      } else {
        for (var j = 0; j < tags.length; j++) {
          for (var k = 0; k < $scope.order.recipient.diagnosies.length; k++) {
            if (tags[j] == $scope.order.recipient.diagnosies[k].name[0].toLowerCase()+$scope.order.recipient.diagnosies[k].name.slice(1)) {
              $scope.careItemsToDisplay.push($scope.careItems[i])
            }
          }
        }

      }
    }
  }





  $scope.selectDiagnosis = function(i) {

    $scope.order.recipient.diagnosies.push({
      name:''
    })
    console.log($scope.order.recipient.diagnosies);
    var html = '<select id="'+($scope.order.recipient.diagnosies.length-1)+'receiverInfoDiagnosiesDropdown" class="receiverInfoDiagnosiesDropdowns" ng-model="order.recipient.diagnosies['+($scope.order.recipient.diagnosies.length-1)+'].name" ng-change="selectDiagnosis('+($scope.order.recipient.diagnosies.length-1)+')" name=""><option value="{{dio.ribbonData.name}}" ng-repeat="dio in ribbons">{{dio.ribbonData.name}}</option></select><a id="'+($scope.order.recipient.diagnosies.length-1)+'receiverInfoDiagnosiesRemoveAnc" ng-if="order.recipient.diagnosies['+($scope.order.recipient.diagnosies.length-1)+'].name != ' + `''` + '" href="" ng-click="removeDiagnosis('+($scope.order.recipient.diagnosies.length-1)+')">X</a>'

    $('#'+($scope.order.recipient.diagnosies.length-1)+'receiverInfoDiagnosiesRemoveAnc').remove();

    angular.element($('#receiverInfoDiagnosiesDropdownContainer')).append($compile(html)($scope));

  }

  $scope.removeDiagnosis = function(i) {

    var name = $scope.order.recipient.diagnosies[i].name;

    var arr = $scope.order.recipient.diagnosies;

    $('#'+($scope.order.recipient.diagnosies.length-1)+'receiverInfoDiagnosiesDropdown').remove();
    $('#'+($scope.order.recipient.diagnosies.length-1)+'receiverInfoDiagnosiesRemoveAnc').remove();

    arr = arr.filter(function(item) {
      // console.log(item, name);
        return item.name != name
    })


    $scope.order.recipient.diagnosies = arr;


    console.log($scope.order.recipient.diagnosies)

  }

  $scope.changeOrderDisplay = function(d) {
    $('.packageDisplays').css('display','none');
    if (d == 'c') {
      $scope.display ++;
    } else {
      $scope.display --;
    }
    if ($scope.display == 0) {
      $('#receiverInfoPackageDisplay').css('display','flex');
    } else if ($scope.display == 1) {
      $('#receiverCheckoutPackageDisplay').css('display','flex');
    }
   //  else if ($scope.display == 1) {
   //   $('#receiverItemPackageDisplay').css('display','flex');
   //   buildItemDisplay();
   // } else if ($scope.display == 2) {
   //   $('#receiverCardPackageDisplay').css('display','flex');
   // }
  }

  $scope.confirmOrder = async (e) => {
    // e.preventDefault();
    const clientSecret = await $http.post('createOrderPaymentIntent', {paymentMethodType:card, currency:'usd'})
    .then(function(res) {
      return res.data.clientSecret;
    });

    const {paymentIntent} = await stripe.confirmCardPayment(
      clientSecret, {
        payment_method: {
          card: card,
          billing_details: {
            name: $scope.order.billing.fName + $scope.order.billing.lName,
            email: $scope.order.billing.email,
          }
        }
      }
    );
    if (paymentIntent.status == 'succeeded') {
      $scope.order.contents = $scope.careItemsToDisplay;
      $http.post('newOrder',{order:$scope.order})
      .then(function(res) {
        // console.log(res);
      })
      .catch(function(error) {
        console.error('Error:', error);
      });

    }
  }
  function start() {

    if ($scope.careItems.length == 0) {
      getItems();
      $scope.selectDiagnosis(0);
    }

    $scope.changePage('purchase');
  }
  start();

}])
