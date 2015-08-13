app.controller('JobsController', function ($scope, $http, $location) {

  $scope.jobs = [];

  $http.get('api/jobs').success(function(data){
    $scope.jobs = data['body'];
    $scope.numberOfJobs = $scope.jobs.length;
  });

  $scope.goTo = function (job) {
    $location.url('/jobs/' + job.id);
  }

  images_name = ['career-business-analyst',
  'career-business-domain-expert',
  'career-data-modeller',
  'career-developer',
  'career-graphic-designer',
  'career-infrastructure-architect',
  'career-performance-tester',
  'career-project-manager',
  'career-security-tester',
  'career-support-analyst',
  'career-tech-lead',
  'career-tester',
  'career-ux-designer']

  last_number = -1

  function change_image(){
    var randomNumber = Math.floor(Math.random() * 12);
    while (randomNumber == last_number){
      var randomNumber = Math.floor(Math.random() * 12);
    }
    last_number = randomNumber
    var imgName = images_name[randomNumber] + '.jpg';
    $scope.number = imgName
    document.getElementById("imageid").src = '/img/' + imgName ;
    setTimeout(change_image, 5000);
  }

  change_image();

});
