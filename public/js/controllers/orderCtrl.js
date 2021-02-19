
app.controller('orderCtrl', ['$scope', '$http', '$window', '$compile', function($scope, $http, $window, $compile) {

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

  $scope.order = {
    recipient: {
      name:'',
      diognosies:[{
        name:'',
      }]
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
      console.log(res);
    })
    .catch(function(err) {
      console.log(err);
    })
  }

  function buildFilterNav() {
    for (var j = 0; j < $scope.ribbons.length; j++) {
    for (var i = 0; i < $scope.filterTags.length; i++) {
        // console.log($scope.filterTags[i]);
        // console.log($scope.ribbons[j].ribbonData.name[0].toLowerCase() + $scope.ribbons[j].ribbonData.name.slice(1));
        if ($scope.ribbons[j].ribbonData.name == 'Rectal') {
          console.log('RECTAL');
        }
        console.log(j);
        if ($scope.filterTags[i] == $scope.ribbons[j].ribbonData.name[0].toLowerCase() + $scope.ribbons[j].ribbonData.name.slice(1)) {
          ribbon = $scope.ribbons[j].ribbonData;
          $scope.ribbonsToShow.push(ribbon);
          console.log($scope.ribbonsToShow);
        }
      }
    }
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
        if (data.tags.split(',')[0] != 'all') {
          tags = data.tags.split(',');
          if ($scope.filterTags.length > 0) {
            for (var k = 0; k < tags.length; k++) {
              var exists = false;
              for (var j = 0; j < $scope.filterTags.length; j++) {
                // console.log(tags[k][0].toLowerCase() + tags[k].slice(1));
                // console.log($scope.filterTags[j]);
                if ($scope.filterTags[j] == tags[k][0].toLowerCase() + tags[k].slice(1)) {
                  // console.log('exists');
                  exists == true;
                  j = $scope.filterTags.length;
                } else if(j == $scope.filterTags.length-1 && exists == false) {
                  $scope.filterTags.push(tags[k]);
                  // console.log($scope.filterTags);
                }

              }
            }
          } else {
            $scope.filterTags = data.tags.split(',');
            // console.log($scope.filterTags);
          }

        }
        if (i == res.data.length-1) {
          // console.log($scope.filterTags);
          // buildItemDisplay('all');
          buildFilterNav();
        }

      }
      // console.log($scope.careItems);
      // console.log($scope.packageCosts);
    })
  }


  function buildItemDisplay() {
    console.log($scope.careItems);
    console.log($scope.order);
    $scope.careItemsToDisplay = [];
    for (var i = 0; i < $scope.careItems.length; i++) {
      var tags = $scope.careItems[i].tags.split(',');
      if (tags[0] == 'all') {
        $scope.careItemsToDisplay.push($scope.careItems[i])
      } else {
        for (var j = 0; j < tags.length; j++) {
          for (var k = 0; k < $scope.order.recipient.diognosies.length; k++) {
            console.log($scope.order.recipient.diognosies[k]);
            if (tags[j] == $scope.order.recipient.diognosies[k].name[0].toLowerCase()+$scope.order.recipient.diognosies[k].name.slice(1)) {
              $scope.careItemsToDisplay.push($scope.careItems[i])
            }
          }
        }

      }
    }
  }


  function start() {

    if ($scope.careItems.length == 0) {
      getItems();
    }

    // buildItemDisplay('all');
  }
  start();


  $scope.newDiognosis = function() {

    $scope.order.recipient.diognosies.push({
      name:''
    })

    var html = '<select id="'+$scope.order.recipient.diognosies.length+'receiverInfoDiognosiesDropdown" class="receiverInfoDiognosiesDropdowns" ng-model="order.recipient.diognosies['+($scope.order.recipient.diognosies.length-1)+'].name" name=""><option value="{{dio.ribbonData.name}}" ng-repeat="dio in ribbons">{{dio.ribbonData.name}}</option></select>'

    angular.element($('#receiverInfoDiognosiesDropdownContainer')).append($compile(html)($scope))
  }

  // $scope.selectDiognosis = function(i) {
  //   console.log(i);
  // }

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
      $('#receiverItemPackageDisplay').css('display','flex');
      buildItemDisplay();
    } else if ($scope.display == 2) {
      $('#receiverCardPackageDisplay').css('display','flex');
    } else if ($scope.display == 3) {
      $('#receiverCheckoutPackageDisplay').css('display','flex');
    }
  }

  $scope.sendOrder = function() {
    $scope.order.contents = $scope.careItemsToDisplay;
     $http.post('newOrder',{order:$scope.order})
      .then(function(res) {
        console.log(res);
      })
      .catch(function(error) {
        console.error('Error:', error);
      });
    // sendOrder();
  }

}])
