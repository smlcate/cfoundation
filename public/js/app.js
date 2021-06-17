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

})
