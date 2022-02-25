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
