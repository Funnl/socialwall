'use strict';

angular.module('socialwallApp')
  .controller('MainCtrl', function ($scope, $resource, $interval) {

  	$scope.map = {
		    center: {
		        latitude: 25.2500,
		        longitude: 55.3000
		    },
		    zoom: 5,
		    q:"Dubai"
		};
	$scope.map2 = {
		    center: {
		        latitude: 25.2500,
            longitude: 55.3000
		    },
		    zoom: 2,
		};
	$scope.local_markers = [];

	var lookupHash = {};

	var stopRefreshingTime = $interval(function(){
            console.log("Updating last refresh time");
            _.forEach($scope.tweets, function(tweet, index, arr){
            	var dt = moment(tweet.created_at);
        		tweet.friendly_time = dt.fromNow().toString();
            });
            _.forEach($scope.photos, function(photo, index, arr){
            	var dt = moment.unix(photo.caption.created_time);
  				photo.caption.friendly_time = dt.fromNow().toString();
            });

            $scope.$digest();
        },
        1000 * 60); // repeat every minute

	// converts a "place" as listed in a twitter profile to a lat/lon pair marker for the map
	$scope.lookup = function(location){
		if(!location || location.length < 5 || lookupHash[location]){
			// do nothing, it's already added
		}
		else 
		{
			lookupHash[location] = {}; // mark as pending
			var geocode = $resource("https://maps.googleapis.com/maps/api/geocode/json?address=" + location + "&sensor=false&key=AIzaSyCUh1kPIIlM7z9QPj3CvSYdFxxpJY6_Ts8");
			geocode.get({}).$promise.then(function(res){
				console.log("Got GEOCODE result for " + location);
				console.log(res);
				if(res.results && res.results[0]){
					var r = res.results[0];
					var m = {
						'latitude': r.geometry.location.lat,
						'longitude': r.geometry.location.lng
					};
					$scope.local_markers.push(m);
					lookupHash[location] = m;
					//console.log($scope.m);
				}
				//$scope.m = res.;
			}).catch(function(err){
				console.log("Got GEOCODE result error");
				console.log(err);
			})
		}
	}

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
  			
  			var dt = moment.unix(photo.caption.created_time);
  			photo.caption.friendly_time = dt.fromNow().toString();
  			//console.log(photo.images.thumbnail.url);
  			//console.log(photo.images.standard_resolution.url);
        $scope.$digest();
  		})
  	})
    $scope.$on('twitter', function(e, tweet){
      // Handle the new instragram posts
      // something like...

        $scope.tweets.unshift(tweet);
        console.log("Added tweet");
        console.log(JSON.stringify(tweet));

        $scope.lookup(tweet.user.location);
        
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
  	var socket = io.connect('http://whispering-everglades-6142.herokuapp.com:80');
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
