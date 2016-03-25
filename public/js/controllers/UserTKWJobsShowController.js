app.controller('UserTKWJobsShowController', function ($scope, $http, $routeParams) {
  $scope.jobId = $routeParams.id;
  $scope.job = {};
  $scope.candidate = {};
  $scope.createCandidateMsg = {}

  //############################## JOBS #####################################
  $http.get('api/jobs/' + $scope.jobId + generateUrlKey()).
  success(function(data){
    $scope.job = data['body'];
    getCandidates()
    mdContent = $scope.job.description
    $scope.htmlContent = markdown.toHTML( mdContent );
    $("markout").innerHTML = $scope.htmlContent
  }).
  error(function(data){
    logged(data);
  });

  $scope.deleteJob = function(id){
    $http.delete('/api/jobs/' + $scope.job.id + generateUrlKey()).
    success(function(data){
      window.location.href = "/user_tkw/jobs";
    }).
    error(function(data){
      logged(data);
    });
  };

  //############################ CANDIDATES ##################################
  getCandidates = function(){
    $http.get('api/candidates' + generateUrlKey() + '&job_id=' + $scope.job.id).
    success(function(data){
      $scope.candidates = data['body'];
      $scope.copy_candidates = $scope.candidates
      for(var i=0; i < $scope.copy_candidates.length; i++){
        if ($scope.copy_candidates[i].status == 0){
          $scope.copy_candidates[i]["class"] = "";
        } else if ($scope.copy_candidates[i].status > 0) {
          $scope.copy_candidates[i]["class"] = "success";
        } else if ($scope.copy_candidates[i].status < 0) {
          $scope.copy_candidates[i]["class"] = "danger";
        }
      }
    }).
    error(function(data){
      logged(data)
    });
  };

  $scope.createCandidate = function(){
    $scope.createCandidateMsg = validateCandidate($scope.candidate)
    if ( isEmpty($scope.createCandidateMsg) ){
      $scope.candidate['job_id'] = $scope.job.id

      $http.post('/api/candidates' + generateUrlKey(), {candidate: $scope.candidate}).
      success(function(data, status, headers, config) {
        $scope.candidate = {};
        getCandidates();
      }).
      error(function(data, status, headers, config) {
        logged(data)
      });
    }
  }

  $scope.deleteCandidate = function(id){
    $http.delete('/api/candidates/' + id + generateUrlKey()).
    success(function(data){
      getCandidates()
    }).
    error(function(data){
      logged(data);
    });
  };
});
