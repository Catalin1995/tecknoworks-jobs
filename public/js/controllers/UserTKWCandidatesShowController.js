app.controller('UserTKWCandidatesShowController', function ($scope, $http, $routeParams, FileUploader) {
  $scope.jobId = window.location.href.split('/')[5];
  $scope.candidateId = $routeParams.id;
  $scope.job = {};
  $scope.candidate = {};
  $scope.interviews = [];
  $scope.date = '';
  $scope.time = '';
  $scope.uploader = new FileUploader();

  //########################## CANDIDATES ####################################
  $http.get('api/candidates/' + $scope.candidateId  + generateUrlKey()).
  success(function(data){
    $scope.candidate = data['body'];
    if ($scope.candidate.status == 0){
      $scope.candidate["string_status"] = "None";
    } else if ($scope.candidate.status > 0) {
      $scope.candidate["string_status"] = "Accepted";
    } else {
      $scope.candidate["string_status"] = "Refused";
    }
    console.log($scope.candidate)
    getJob();
    getAttachments();
    getInterviews();
    $scope.uploader.url = '/api/attachments' + generateUrlKey() + '&candidate_id=' + $scope.candidate.id;
    $scope.uploader.removeAfterUpload = true;
  }).
  error(function(data, status, headers, config) {
    logged(data)
  });

  $scope.deleteCandidate = function(){
    $http.delete('/api/candidates/' + $scope.candidate.id  + generateUrlKey()).
    success(function(data){
      window.location.href = "/user_tkw/jobs/" + $scope.jobId;
    }).
    error(function(data){
      logged(data)
    });
  };

  $scope.uploadFile = function(item){
    item.upload();
    getAttachments();
  }

  $scope.cancel = function(item){
    var index = $scope.uploader.queue.indexOf(item)
    if (index > -1) {
      $scope.uploader.queue.splice(index, 1);
    }
  }

  $scope.changeStatus = function(id){
    $scope.candidate.status = id;
    $http.patch('api/candidates/' + $scope.candidate.id + generateUrlKey(), {candidate: $scope.candidate}).
    success(function(data, status, headers, config){
      window.location.href = "/user_tkw/jobs/" + data['body']['job_id'] + '/candidates/' + data['body']['id'];
    }).
    error(function(data, status, headers, config){
      logged(data);
    });
  }

  //########################## JOBS ##########################################
  getJob = function(){
    $http.get('api/jobs/' + $scope.candidate.job_id + generateUrlKey()).
    success(function(data){
      $scope.job = data['body'];
    }).
    error(function(data, status, headers, config) {
      logged(data);
    });
  }

  //######################### INTERVIEWS #####################################
  getInterviews = function() {
    $http.get('api/interviews' + generateUrlKey() + '&candidate_id=' + $scope.candidate.id).
    success(function(data){
      $scope.interviews = data['body'];
    }).
    error(function(data, status, headers, config) {
      logged(data)
    });
  }

  $scope.createInterview = function(){
    var timeString = generateTimeFormat($scope.data.date)
    var interviewHash = {date_and_time: timeString, candidate_id: $scope.candidate.id}
    $http.post('api/interviews' + generateUrlKey(), {interview: interviewHash}).
    success(function(data){
      getInterviews();
    }).
    error(function(data, status, headers, config) {
      logged(data)
    });
  };

  //######################## ATTACHMENTS ####################################
  $scope.fileName = function(name){
    var array = name.split('/')
    return array[array.length-1]
  }

  getAttachments = function() {
    $http.get('api/attachments' + generateUrlKey() + '&candidate_id=' + $scope.candidate.id).
    success(function(data){
      $scope.attachments = data['body'];
    }).
    error(function(data, status, headers, config) {
      logged(data)
    });
  }

  $scope.pushButton = function(){
    console.log($scope.uploader)
  }

});
