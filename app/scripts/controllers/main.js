'use strict';

angular.module('socialwallApp')
  .controller('MainCtrl', function ($scope) {

  	$scope.pictures = [];
  	$scope.$on('instagram', function(e, posts){
  		// Handle the new instragram posts
  		// something like...

  		posts.forEach(function(arr, index, elem){ // don't remember my js forEach...
  			$scope.pictures.push(elem);
  			console.log("Added picture");
  			console.log(elem);
  		})
  	})
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });

  angular.module('socialwallApp')
  .controller('DataController', function ($scope, $log, $rootScope) {

  	$scope.debugMessages = [];
  	var socket = io.connect('http://socialwall-api.funnl.co');
	//var socket = io.connect('http://localhost');
	socket.on('instagram', function(jsonString){
		$log.info("Got instagram update from api server");
		$log.info(jsonString);
		var jsonData = JSON.parse(jsonString);
		$log.info(jsonData);
		$scope.debugMessages.push(jsonData.data);

		// The Instagram data is wrapped for pagination, which we aren't using
		// so, we are just going to use the raw data
		$rootScope.$broadcast('instagram', jsonData.data);
	})
  });
