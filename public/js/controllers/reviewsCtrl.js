app.controller('reviewsCtrl', ['$scope', '$http', '$window', '$compile', '$location', function($scope, $http, $window, $compile, $location) {

$scope.newReview = {
  reviewType: 'recipient',
  name:'',
  anonymous: false,
  permissionToPost: false,
  ratings: {
    items: 0,
    bag: 0,
    satisfaction: 0,
  },
  testimonial:''
}

$scope.selectReviewType = function(type) {
  $('#testimonialTypeSelectSpan a').css('font-size', '1em');
  $('#' + type + 'SelectAnc').css('font-size', '1.5em');
  $scope.newReview.reviewType = type;
}

$scope.ratingSelect = function(type, rating) {
  if (type == 'items') {
    $scope.newReview.ratings.items = rating;
  }
  if (type == 'bag') {
    $scope.newReview.ratings.bag = rating;
  }
  if (type == 'satisfaction') {
    $scope.newReview.ratings.satisfaction = rating;
  }
  console.log($scope.newReview)
}

$scope.submitReview = function() {
  $http.post('postReview', $scope.newReview)
  .then(function(data) {
    console.log(data);
  })
  .catch(function(err) {
    console.log(err);
  })
}

function init() {
  $scope.selectReviewType('recipient');
}

init();

}]);
