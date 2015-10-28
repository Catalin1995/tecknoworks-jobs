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
    }).
    error(function(data){
      logged(data)
    });
  };

  $scope.createCandidate = function(){
    if (validateCandidate()){
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

  validateCandidate = function(){
    $scope.createCandidateMsg = {}
    var ok = true
    if (!validateName()){
      $scope.createCandidateMsg['name'] = "* Minimum 3 characters(just letters and spaces)"
      ok = false;
    }

    if (!validateEmailFormat()){
      $scope.createCandidateMsg['email'] = "* Invalid format"
      ok = false;
    }

    if (!validatePhoneNumber()){
      $scope.createCandidateMsg['phoneNumber'] = "* Invalid format(10 digits)"
      ok = false;
    }

    if ($scope.candidate['source'] == null || $scope.candidate['source'] == ''){
      $scope.createCandidateMsg['source'] = "* Source can't be nill"
      ok = false;
    }
    return ok
  }

});
