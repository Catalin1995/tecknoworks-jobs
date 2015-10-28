app.controller('UserTKWCandidatesEditController', function ($scope, $http, $routeParams) {

  $scope.jobId = window.location.href.split('/')[5]
  $scope.candidateId = $routeParams.id
  $scope.job = {}
  $scope.jobs = []
  $scope.candidate = {}
  $scope.interviews = []
  $scope.dictionaryJobs = {}
  $scope.keys = []
  $scope.userId = Cookies.get('user_id')
  $scope.createCandidateMsg = {}

  //######################## CANDIDATES ######################################
  $http.get('api/candidates/' + $scope.candidateId + generateUrlKey()).
  success(function(data){
    $scope.candidate = data['body'];
    getJob();
    getInterviews();
    getAttachments();
  }).
  error(function(data, status, headers, config) {
    logged(data);
  });

  $scope.saveCandidate = function(){
    $scope.createCandidateMsg = validateCandidate($scope.candidate)
    if ( isEmpty($scope.createCandidateMsg) ){
      $scope.candidate['job_id'] = $scope.dictionaryJobs[$scope.select]
      $http.patch('api/candidates/' + $scope.candidate.id + generateUrlKey(), {candidate: $scope.candidate}).
      success(function(data, status, headers, config){
        window.location.href = "/user_tkw/jobs/" + data['body']['job_id'] + '/candidates/' + data['body']['id'];
      }).
      error(function(data, status, headers, config){
        logged(data);
      });
    };
  };

  $scope.deleteCandidate = function(){
    $http.delete('/api/candidates/' + $scope.candidate.id  + generateUrlKey()).
    success(function(data){
      window.location.href = "/user_tkw/jobs/" + $scope.jobId;
    }).
    error(function(data){
      logged(data);
    });
  };

  //######################## JOBS ############################################
  generateDictionaryJobs = function(){
    for (var i = 0; i<$scope.jobs.length; i++){
      $scope.dictionaryJobs[$scope.jobs[i]['title']] = $scope.jobs[i]['id']
    }
    $scope.keys = Object.keys($scope.dictionaryJobs)
  }

  $scope.getJobs = function() {
    $http.get('/api/jobs'  + generateUrlKey()).
    success(function(data){
      $scope.jobs = data['body'];
      generateDictionaryJobs();
    }).
    error(function(data, status, headers, config) {
      logged(data);
    });
  }

  getJob = function(){
    $http.get('api/jobs/' + $scope.candidate.job_id  + generateUrlKey()).
    success(function(data){
      $scope.job = data['body'];
      $scope.select = $scope.job['title']
    }).
    error(function(data, status, headers, config) {
      logged(data);
    });
  }

  $scope.getJobs();

  //######################## INTERVIEWS ######################################
  getInterviews = function(){
    $http.get('api/interviews' + generateUrlKey() + '&candidate_id=' + $scope.candidate.id).
    success(function(data){
      $scope.interviews = data['body'];
    }).
    error(function(data, status, headers, config) {
      logged(data);
    });
  }

  $scope.deleteInterview = function(id){
    $http.delete('/api/interviews/' + id  + generateUrlKey()).
    success(function(data){
      getInterviews();
    }).
    error(function(data){
      logged(data);
    });
  }


  //######################## ATTACHMENTS #####################################
  $scope.fileName = function(name){
    if (name != null) {
      var array = name.split('/')
      return array[array.length-1]
    }
  }

  getAttachments = function() {
    $http.get('api/attachments' + generateUrlKey() + '&candidate_id=' + $scope.candidateId).
    success(function(data){
      $scope.attachments = data['body'];
    }).
    error(function(data, status, headers, config) {
      logged(data)
    });
  }

  $scope.deleteAttachment = function(id){
    $http.delete('/api/attachments/' + id + generateUrlKey()).
    success(function(data){
      getAttachments()
    }).
    error(function(data){
      logged(data)
    });
  };

});
