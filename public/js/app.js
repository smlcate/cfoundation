var app = angular.module('mainApp', ['ui.router'])

app.config(function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/');

  $stateProvider

  // // HOME STATES AND NESTED VIEWS ========================================
  .state('home', {
      url: '/',
      templateUrl: '../partials/home.html'
  })
  .state('admin', {
      url: '/admin',
      templateUrl: '../partials/admin.html'
  })
  .state('browse', {
      url: '/browse',
      templateUrl: '../partials/browse.html'
  })
  .state('packages', {
      url: '/packages',
      templateUrl: '../partials/carepackage.html'
  })
  .state('donate', {
      url: '/donate',
      templateUrl: '../partials/donate.html'
  })
  .state('thankyou', {
      url: '/thankyou',
      templateUrl: '../partials/thankyou.html'
  })
  .state('recipient', {
    url: '/recipient/:id/:uid',
    templateUrl:'../partials/recipient.html',
    controller: function($stateParams, $scope) {
      $scope.recipientId = $stateParams.id;
      $scope.recipientUid = $stateParams.uid;
    }
  })
  .state('giveFeedback', {
      url: '/givefeedback',
      templateUrl: '../partials/giveFeedback.html'
  })
  .state('testimonials', {
      url: '/testimonials',
      templateUrl: '../partials/testimonials.html'
  })
  .state('reviews', {
      url: '/reviews',
      templateUrl: '../partials/reviews.html'
  })

  .state('signUp', {
      url: '/signUp',
      templateUrl: '../partials/signUp.html'
  })
  .state('signIn', {
      url: '/signIn',
      templateUrl: '../partials/signIn.html'
  })
  .state('profile', {
      url: '/profile',
      templateUrl: '../partials/profile.html'
  })
  .state('forgotPassword', {
      url: '/forgotPassword',
      templateUrl: '../partials/forgotPassword.html'
  })
  .state('resetPassword', {
      url: '/resetPassword/:id/:token',
      templateUrl: '../partials/resetPassword.html',
      controller: function($stateParams, $scope) {
        $scope.recoverId = $stateParams.id;
        $scope.recoverToken = $stateParams.token;
      }
  })

})
