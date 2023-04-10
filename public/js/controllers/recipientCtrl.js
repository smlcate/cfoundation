app.controller('recipientCtrl', ['$scope', '$http', '$window', '$compile', '$location', function($scope, $http, $window, $compile, $location) {
  console.log($scope.recipientId, $scope.recipientUid);
  function checkUid() {
    $http.post('checkUid', {id:$scope.recipientId,uid:$scope.recipientUid})
    .then(function(res) {
      console.log(res.data);
    })
    .catch(function(err) {
      console.log(err);
    })
  }
  checkUid();
}])
