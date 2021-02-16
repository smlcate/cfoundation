app.controller('mainCtrl', ['$scope', '$http', '$window', '$compile', function($scope, $http, $window, $compile) {

  $scope.careItems = [];
  $scope.careItemsToDisplay = [];

  $scope.filterTags = [];

  $scope.ribbons = [];
  $scope.ribbonsToShow = [];

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

  function getRibbons() {
    $http.get('getRibbons')
    .then(function(res) {
      $scope.ribbons = res.data;
      for (var i = 0; i < $scope.ribbons.length; i++) {
        $scope.ribbons[i].ribbonData = JSON.parse($scope.ribbons[i].ribbonData);
      }
      console.log($scope.ribbons);
    })
    .catch(function(err) {
      console.log(err);
    })
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
          buildItemDisplay('all');
          buildFilterNav();
        }

      }
      // console.log($scope.careItems);
      // console.log($scope.packageCosts);
    })
  }

  function buildItemDisplay(tag) {
    console.log($scope.careItems);
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

  function start() {

    $('#homeAnc').css('background','#ffff63');
    $('#homeAnc').css('color','#dcd0ff');

    getItems();
    getRibbons();

  }

  start();

  $scope.changeFilter = function(tag) {
    buildItemDisplay(tag[0].toLowerCase() + tag.slice(1));
  }

  $scope.changePage = function(p) {

    $('#headerNav a').css('background','#dcd0ff');
    $('#headerNav a').css('color','#ffff63');

    $('#'+p+'Anc').css('background','#ffff63');
    $('#'+p+'Anc').css('color','#dcd0ff');
  }



}])
