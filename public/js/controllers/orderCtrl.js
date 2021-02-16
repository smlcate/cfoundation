app.controller('orderCtrl', ['$scope', '$http', '$window', '$compile', function($scope, $http, $window, $compile) {

  $scope.selectedDiognosies = [];


  $scope.newDiognosis = function() {

    var html = '<select id="'+$scope.selectedDiognosies.length+'receiverInfoDiognosiesDropdown" class="receiverInfoDiognosiesDropdowns" ng-model="selectedDiognosies['+$scope.selectedDiognosies.length+']" name=""><option value="{{dio.ribbonData.name}}" ng-repeat="dio in ribbons">{{dio.ribbonData.name}}</option></select>'

    angular.element($('#receiverInfoDiognosiesDropdownContainer')).append($compile(html)($scope))
  }

}])
