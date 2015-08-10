var app = angular.module('app', ['ngRoute', 'ngResource']);

var $ = function (id) { return document.getElementById(id); };

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider

    .when('/', {
      templateUrl: 'partials/jobs/jobs.html',
      controller: "JobsController"
    })

    .when('/jobs', {
      templateUrl: 'partials/jobs/jobs.html',
      controller: 'JobsController'
    })

    .when('/jobs/:id', {
      templateUrl: 'partials/jobs/job.html',
      controller: 'JobController'
    })

    .otherwise({
      redirectTo: '/jobs'
    });

}]);
