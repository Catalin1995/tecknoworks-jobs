app.controller('UserTKWJobsController', function ($scope, $http, $routeParams) {
  $scope.jobs = [];
  $scope.jobHashStatus = {};

  $scope.status = [
    {number: '0', text: 'DRAFT', },
    {number: '1', text: 'PUBLISHED'},
    {number: '2', text: 'FILLED'},
    {number: '3', text: 'EXPIRED'},
    {number: '4', text: 'DASHBOARD'}
  ];

  $scope.save = function(id) {
    var job = {};
    for(var i=0; i<$scope.jobs.length; i++){
      if( $scope.jobs[i].id == id){
        job = $scope.jobs[i];
      }
    }
    $http.put('/api/jobs/' + job.id + generateUrlKey(), {job: {description: job.description, status: $scope.jobHashStatus[job.id].number}}).
    success(function(data, status, headers, config) {
    }).
    error(function(data, status, headers, config) {
      logged(data)
    });
    getJobs();
  }

  $scope.deleteJob = function(id){
    $http.delete('/api/jobs/' + id + generateUrlKey()).
    success(function(data){
      getJobs();
    }).
    error(function(data){
      logged(data);
    });
  };

  completeStatus = function(){
    for(var i = 0; i < $scope.numberOfJobs; i++){
      $scope.jobHashStatus[$scope.jobs[i].id] = $scope.status[$scope.jobs[i].status]
    }
  }

  getJobs = function(){
    $http.get('api/jobs' + generateUrlKey()).
    success(function(data){
      $scope.jobs = data['body'];
      $scope.numberOfJobs = $scope.jobs.length;
      completeStatus();
    }).
    error(function(data) {
      logged(data)
    });
  };

  getJobs()

});
