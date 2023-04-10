app.controller('reviewsCtrl', ['$scope', '$http', '$window', '$compile', '$location', function($scope, $http, $window, $compile, $location) {

  $scope.reviewController = {
    type: '',
    page: 1,
    thankyou:false,
    thanked:false
  }

  $scope.newReview = {
    reviewType: 'recipient',
    name:'',
    anonymous: false,
    permissionToPost: false,
    ratings: {
      items: 0,
      bag: 0,
      satisfaction: 0,
      website:0,
      comments:'',
    },
    ribbons:[''],
    testimonial:''
  }

  $scope.selectFeedbackType = function(type) {
    $('#feedbackTypeSelectSpan a').css('font-size', '1em');
    $('#' + type + 'SelectAnc').css('font-size', '1.5em');
    $scope.reviewController.type = type;
  }

  $scope.selectReviewType = function(type) {
    $('#testimonialTypeSelectSpan a').css('font-size', '1em');
    $('#' + type + 'SelectAnc').css('font-size', '1.5em');
    $scope.newReview.reviewType = type;
  }

  $scope.selectDiagnosis = function(i) {
    console.log(i);
    thisRibbon = $scope.newReview.ribbons[i];
    if (
      thisRibbon !== '' &&
      thisRibbon !== null &&
      $scope.newReview.ribbons.length === i + 1
    ) {
      console.log('hit');
      console.log($scope.newReview.ribbons);
      $scope.newReview.ribbons.push('');
    }
  }

  $scope.removeDiagnosis = function(i) {

    var name = i;
    var arr = $scope.newReview.ribbons;

    $scope.newReview.ribbons = [];

    arr = arr.filter(function(item) {
        return item != name
    })

    for (var i = 0; i < arr.length; i++) {
      if (i == arr.length - 1) {
        $scope.newReview.ribbons = arr;
        if($scope.newReview.ribbons.length == 0) {
          $scope.newReview.ribbons.push('');
        }
      }
    }

  }


  $scope.feedbackPageChange = function(amount) {
    $scope.reviewController.page += amount;
  }

  $scope.ratingSelect = function(type, rating) {
    if (type == 'items') {
      $scope.newReview.ratings.items = rating;
      $('#itemsSelect a').css('font-size', '1em')
      $('#itemsSelectAnc' + rating).css('font-size', '1.5em')
    }
    if (type == 'bag') {
      $scope.newReview.ratings.bag = rating;
      $('#bagSelect a').css('font-size', '1em')
      $('#bagSelectAnc' + rating).css('font-size', '1.5em')
    }
    if (type == 'website') {
      $scope.newReview.ratings.website = rating;
      $('#websiteSelect a').css('font-size', '1em')
      $('#websiteSelectAnc' + rating).css('font-size', '1.5em')
    }
    if (type == 'satisfaction') {
      $scope.newReview.ratings.satisfaction = rating;
      $('#satisfactionSelect a').css('font-size', '1em')
      $('#satisfactionSelectAnc' + rating).css('font-size', '1.5em')
    }
  }

  $scope.submitReview = function(type) {
    if (type == 'review') {
      var data = {
        name:$scope.newReview.name,
        ratings:$scope.newReview.ratings,
        type:$scope.newReview.reviewType,
        permission:$scope.newReview.permissionToPost,
        favorite:false,
        ribbons:$scope.newReview.ribbons
      }
      if ($scope.newReview.anonymous) {
        data.name = 'Anonymous'
      }
      $http.post('postReview', JSON.stringify(data))
      .then(function(data) {
        if (data.data == 'success') {
          $scope.reviewController.thankyou = true;
        }
      })
      .catch(function(err) {
        console.log(err);
      })
    } else {
      var data = {
        name:$scope.newReview.name,
        testimonial:$scope.newReview.testimonial,
        type:$scope.newReview.reviewType,
        permission:$scope.newReview.permissionToPost,
        favorite:false,
        ribbons:$scope.newReview.ribbons
      }
      console.log(data);
      if ($scope.newReview.anonymous) {
        data.name = 'Anonymous'
      }
      $http.post('addTestimonial', {testimonial_data:JSON.stringify(data)})
      .then(function(data) {
        if (data.status == 200) {
          $scope.reviewController.thankyou = true;
        }
      })
      .catch(function(err) {
        console.log(err);
      })
    }
  }

  $scope.toTestimony = function() {
    $scope.reviewController.type = 'testimony';
    $scope.reviewController.page = 3;
    $scope.reviewController.thankyou = false;
    $scope.reviewController.thanked = true;
  }
  $scope.toReview = function() {
    $scope.reviewController.type = 'review';
    $scope.reviewController.page = 3;
    $scope.reviewController.thankyou = false;
    $scope.reviewController.thanked = true;
  }

  function init() {
    $scope.selectReviewType('recipient');
    $scope.selectFeedbackType('review');
  }

  init();

}]);
