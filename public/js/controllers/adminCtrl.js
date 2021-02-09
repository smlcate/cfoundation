app.controller('adminCtrl', ['$scope', '$http', '$window', '$compile', function($scope, $http, $window, $compile) {

  $scope.thisAdminPage = function(p) {
    $('.adminPages').css('display','none');
    $('#'+p+'AdminPage').css('display','flex');
    console.log('hit');
  }

  function start() {

    $scope.thisAdminPage('carepackage');

  }
  start();

}])
