'use strict';

angular.module('socialwallApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'google-maps',
  'ngAnimate'
])
  .config(function ($locationProvider, $routeProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
