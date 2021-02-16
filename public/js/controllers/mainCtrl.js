app.controller('mainCtrl', ['$scope', '$http', '$window', '$compile', function($scope, $http, $window, $compile) {

  function start() {

    $('#homeAnc').css('background','#ffff63');
    $('#homeAnc').css('color','#dcd0ff');

  }

  start();

  $scope.changePage = function(p) {

    $('#headerNav a').css('background','#dcd0ff');
    $('#headerNav a').css('color','#ffff63');

    $('#'+p+'Anc').css('background','#ffff63');
    $('#'+p+'Anc').css('color','#dcd0ff');
  }

}])
