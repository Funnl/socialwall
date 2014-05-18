'use strict';

angular.module('socialwallApp')
  .controller('MainCtrl', function ($scope) {

  	$scope.photos = [];
    $scope.tweets = [];
  	$scope.$on('instagram', function(e, posts){
  		// Handle the new instragram posts
  		// something like...

  		$scope.photos = [];
      posts.forEach(function(photo, index, arr){ // don't remember my js forEach...
  			$scope.photos.push(photo);
  			console.log("Added photo");
  			console.log(JSON.stringify(photo));
  			
  			var dt = moment(photo.caption.created_time);
  			photo.caption.friendly_time = dt.fromNow().toString();
  			console.log(photo.images.thumbnail.url);
  			console.log(photo.images.standard_resolution.url);
        $scope.$digest();
  		})
  	})
    $scope.$on('twitter', function(e, tweet){
      // Handle the new instragram posts
      // something like...

        $scope.tweets.unshift(tweet);
        console.log("Added tweet");
        console.log(JSON.stringify(tweet));
        
        var dt = moment(tweet.created_at);
        tweet.friendly_time = dt.fromNow().toString();
        $scope.$digest();
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
  	var socket = io.connect('http://socialwall-api.funnl.co:80');
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
	});

  socket.on('twitter', function(jsonString){
    $log.info("Got twitter update from api server");
    $log.info(jsonString);
    $rootScope.$broadcast('twitter', jsonString);
  });
  });
