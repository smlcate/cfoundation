app.controller('mainCtrl', ['$scope', '$http', '$window', '$compile', function($scope, $http, $window, $compile) {

  $scope.careItems = [];
  $scope.careItemsToDisplay = [];

  $scope.filterTags = [];

  $scope.ribbons = [];
  $scope.ribbonsToShow = [];

  $scope.user = {};
  $scope.signedIn = false;

  function checkSignIn() {
    if (sessionStorage.user != null && sessionStorage.user != {} && sessionStorage.user != undefined && sessionStorage.user != 'null') {

      user = JSON.parse(sessionStorage.user)

      $scope.user = {
        email: user.email,
        fullName: user.fullName,
        id: user.id
      }

      $scope.signedIn = true;

    }
  }

  function buildFilterNav() {
    for (var j = 0; j < $scope.ribbons.length; j++) {
    for (var i = 0; i < $scope.filterTags.length; i++) {

        if ($scope.ribbons[j].ribbonData.name == 'Rectal') {

        }

        if ($scope.filterTags[i] == $scope.ribbons[j].ribbonData.name[0].toLowerCase() + $scope.ribbons[j].ribbonData.name.slice(1)) {
          ribbon = $scope.ribbons[j].ribbonData;
          $scope.ribbonsToShow.push(ribbon);
        }
      }
    }
  }

  function getRibbons() {
    $http.get('getRibbons')
    .then(function(res) {
      $scope.ribbons = res.data;
      for (var i = 0; i < $scope.ribbons.length; i++) {
        $scope.ribbons[i].ribbonData = JSON.parse($scope.ribbons[i].ribbonData);
      }
    })
    .catch(function(err) {
      console.log(err);
    })
  }

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
          buildItemDisplay('all');
          buildFilterNav();
        }

      }
    })
  }

  function buildItemDisplay(tag) {
    $scope.careItemsToDisplay = [];
    for (var i = 0; i < $scope.careItems.length; i++) {
      var tags = $scope.careItems[i].tags.split(',');
      if (tags[0] == 'all') {
        $scope.careItemsToDisplay.push($scope.careItems[i])
      } else {
        for (var j = 0; j < tags.length; j++) {
          if (tags[j] == tag) {
            $scope.careItemsToDisplay.push($scope.careItems[i])
          }
        }
      }
    }
  }


  $scope.changeFilter = function(tag) {
    buildItemDisplay(tag[0].toLowerCase() + tag.slice(1));
  }

  $scope.changePage = function(p) {

    $('#headerNav a').css('background','#E7E1FB');
    $('#headerNav a').css('color','#ffff63');

    $('#'+p+'Anc').css('background','#ffff63');
    $('#'+p+'Anc').css('color','#C4B0FF');
  }

  $scope.signOut = function() {

    sessionStorage.user = null;
    $scope.user = null;
    $scope.signedIn = false;
    $('#signInNav').css('display','flex')
    $('#userSettingsNav').css('display','none')

  }

  function start() {

    $('#homeAnc').css('background','#ffff63');
    $('#homeAnc').css('color','#E7E1FB');

    getItems();
    getRibbons();
    checkSignIn();


  }

  start();


}])
