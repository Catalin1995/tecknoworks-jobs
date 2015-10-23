var app = angular.module('app', ['ngRoute', 'ngResource', 'ui.bootstrap.datetimepicker', 'ngSanitize'] );

var $ = function (id) { return document.getElementById(id); };

app.controller('MainController', ['$scope', '$http', function($scope, $http, $routeParams) {
  $scope.candidate = {};
  $scope.jobs = [];
  $scope.dictionaryJobs = {};
  $scope.candidates = [];
  $scope.selectedCandidate = null;

  generateDictionaryJobs = function(){
    for (var i = 0; i<$scope.jobs.length; i++){
      $scope.dictionaryJobs[$scope.jobs[i]['title']] = $scope.jobs[i]['id']
    }
    $scope.keys = Object.keys($scope.dictionaryJobs)
  }

  $scope.addCandidate = function(){
    $scope.candidate['job_id'] = $scope.dictionaryJobs[$scope.select]
    $http.post('api/candidates' + generateUrlKey(), {candidate: $scope.candidate}).
    success(function(data, status, headers, config){
      window.location.href = "/user_tkw/jobs/" + data['body']['job_id'] + '/candidates/' + data['body']['id'];
    }).
    error(function(data, status, headers, config){
    });
  }

  $scope.createInterview = function(){
    var timeString = generateTimeFormat($scope.data.date)
    var interviewHash = {date_and_time: timeString, candidate_id: $scope.selectedCandidate}
    console.log(timeString)

    $http.post('api/interviews' + generateUrlKey(), {interview: interviewHash}).
    success(function(data){
      var candidateId = data['body']['candidate_id'];
      var jobId = getIdJob(candidateId);
      var interviewId = data['body']['id'];

      // window.location.href = "/user_tkw/jobs/" + jobId + '/candidates/' + candidateId + '/interview/' + interviewId;
    }).
    error(function(data, status, headers, config) {
      logged(data)
    });
  }

  getIdJob = function(candidateId){
    for( var i=0; i<$scope.candidates.length; i++){
      if( String($scope.candidates[i].id) == String(candidateId) ){
        return $scope.candidates[i].job_id
      }
    }
  }

  $http.get('/api/logged/' + Cookies.get('key_id') + generateUrlKey()).
  success(function(data){
    createMenu(true);
    getJobs();
    getCandidates();
  }).
  error(function(data){
    createMenu(false);
  });

  getJobs = function(){
    $http.get('/api/jobs' + generateUrlKey()).
    success(function(data){
      $scope.jobs = data['body'];
      generateDictionaryJobs();
    }).
    error(function(data){
    });
  }

  getCandidates = function(){
    $http.get('/api/all_candidates' + generateUrlKey()).
    success(function(data){
      $scope.candidates = data['body'];
    }).
    error(function(data){
    });
  }

  createMenu = function(logged){
    jQuery(function($){
      var TECKNO = window.TECKNO || {};
      TECKNO.listenerMenu = function(){
        if (logged == true){
          $('#mobile-nav').on('click', function(e){
            $(this).toggleClass('open');
            $("#menu, body, header, li.logged").toggleClass('open');
            e.preventDefault();
          });
          $('#menu-nav a, #menu-nav-mobile a').on('click', function(){
            $('#mobile-nav, #menu, body, header, li.logged').removeClass('open');
          });
          $(document).keydown(function(e){
            if(e.which == 27) {
              $('#mobile-nav, #menu, body, header, li.logged').removeClass('open');
            }
          });
        } else {
          $('#mobile-nav').on('click', function(e){
            $(this).toggleClass('open');
            $("#menu, body, header, li.no-logged").toggleClass('open');
            e.preventDefault();
          });
          $('#menu-nav a, #menu-nav-mobile a').on('click', function(){
            $('#mobile-nav,#menu, body, header, li.no-logged').removeClass('open');
          });
          $(document).keydown(function(e){
            if(e.which == 27) {
              $('#mobile-nav,#menu, body, header, li.no-logged').removeClass('open');
            }
          });
        }
      }

      $(document).ready(function(){
        TECKNO.listenerMenu();
      });
    });
  }

  $scope.logout = function(){
    Cookies.remove('consumer_key');
    Cookies.remove('secret_key');
    Cookies.remove('user_id');
    Cookies.remove('key_id');
    window.location.href = '/jobs';
  }

}]);

app.config(['$locationProvider', function($locationProvider) {
  $locationProvider.html5Mode(true);
}]);

app.config(['$routeProvider',
function($routeProvider) {

  $routeProvider

  .when('/jobs', {
    templateUrl: 'partials/jobs/jobs.html',
    controller: 'JobsController',
  })

  .when('/jobs/:id', {
    templateUrl: 'partials/jobs/job.html',
    controller: 'JobController',
  })

  .when('/user_tkw/login', {
    templateUrl: 'partials/user_tkw/login.html',
    controller: 'LoginController',
  })

  .when('/user_tkw/jobs', {
    templateUrl: 'partials/user_tkw/jobs/jobs.html',
    controller: 'UserTKWJobsController',
  })

  .when('/user_tkw/jobs/new', {
    templateUrl: 'partials/user_tkw/jobs/new.html',
    controller: 'UserTKWJobsNewController',
  })

  .when('/user_tkw/jobs/:id', {
    templateUrl: 'partials/user_tkw/jobs/job.html',
    controller: 'UserTKWJobsShowController',
  })

  .when('/user_tkw/jobs/:id/edit', {
    templateUrl: 'partials/user_tkw/jobs/edit.html',
    controller: 'UserTKWJobsEditController',
  })

  .when('/user_tkw/jobs/:id/candidates/:id', {
    templateUrl: 'partials/user_tkw/candidates/show.html',
    controller: 'UserTKWCandidatesShowController',
  })

  .when('/user_tkw/jobs/:id/candidates/:id/edit', {
    templateUrl: 'partials/user_tkw/candidates/edit.html',
    controller: 'UserTKWCandidatesEditController',
  })

  .when('/user_tkw/jobs/:id/candidates/:id/interview/:id', {
    templateUrl: 'partials/user_tkw/interviews/show.html',
    controller: 'UserTKWInterviewsShowController',
  })

  .otherwise({
    redirectTo: function(current, path, search) {
      if(search.goto) {
        return "/" + search.goto
      } else {
        return "/jobs"
      }
    }
  });

}]);
