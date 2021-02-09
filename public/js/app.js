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
  .state('carepackage', {
      url: '/carepackage',
      templateUrl: '../partials/carepackage.html'
  })

})
