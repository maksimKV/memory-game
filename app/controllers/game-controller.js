var app = angular.module('MemoryGame');

app.controller('GameController', ['$scope', '$timeout', '$interval', '$window', 'FunLevelService', 'AdvancedLevelService',
	function($scope, $timeout, $interval, $window, FunLevelService, AdvancedLevelService) {

	// Declaring the $scope variables
	$scope.game_option = null;
	$scope.level = null;

	$scope.first_image = null;
	$scope.second_image = null;

	$scope.images = [];

	$scope.state = 'closed';
	$scope.src = 'question-mark';

	$scope.main_image = 'question-mark';
	$scope.opened_image = false;

	$scope.turns = 0;
	$scope.timer = '0.0';

	$scope.timer_function;

	$scope.images_left = null;
	$scope.start_time = null;

	$scope.$watch('images_left', function(){
		if($scope.images_left < 1){
			$scope.timerCount("stop");
		}
	});

	$scope.$watchGroup(['game_option', 'level'], function() {
		if($scope.game_option == "fun" && $scope.level){
			$scope.basicGame();
		}
		else if($scope.game_option == "training" && $scope.level){
			$scope.advancedGame();
		}
	});

	$scope.start = function(value, type){
		if(type == 'option'){
			$scope.game_option = value;
		} else if(type == 'level'){
			$scope.level = value;
		}
	};

	$scope.basicGame = function(){
		$scope.images = FunLevelService.setLevel($scope.level);

		$scope.start_time = new Date().getTime();
		$scope.timerCount("start");

		if($scope.level == "easy"){
			$scope.images_left = 28;
		} else if($scope.level == "medium"){
			$scope.images_left = 30;
		} else if($scope.level == "hard"){
			$scope.images_left = 32;
		}
	}

	$scope.basicReveal = function(image, state, src){
		if($scope.first_image == null && $scope.second_image == null && state == 'closed'){
			$scope.first_image = this;
			this.state = 'opened';
			this.src = image;

		} else if($scope.second_image == null && state == 'closed'){
			this.state = 'opened';
			this.src = image;

			$scope.turns++;
			$scope.second_image = this;

			if(image != $scope.first_image.image){
				$timeout(function () {
					$scope.second_image.state = 'closed';
					$scope.second_image.src = $scope.src;

					$scope.first_image.state = 'closed';
					$scope.first_image.src = $scope.src;

					$scope.first_image = null;
					$scope.second_image = null;
				 }, 1000);
			} else {
				$scope.first_image = null;
				$scope.second_image = null;

				$scope.images_left -= 2;
			}
		}
	}

	$scope.advancedGame = function(){
		$scope.images = AdvancedLevelService.setLevel();
		$scope.main_image = $scope.images.sort(function() { return 0.5 - Math.random() })[0];

		$scope.autoReveal();
		$scope.images_left = 5;

		$scope.start_time = new Date().getTime();
		$scope.timerCount("start");
	}

	$scope.autoReveal = function() {
		var order = null;
		var flip_speed = 1300;

		$scope.opened_image = true;

		if($scope.level == "easy"){
			//Creating a two dimensional array with the order of images to be revealed
			var image_order = [
			[0,1,6,7,12,13,18,19,24,25],
			[2,3,8,9,14,15,20,21,26,27],
			[4,5,10,11,16,17,22,23,28,29]
			];

			// Mixing things up
			order = image_order.sort(function() { return 0.5 - Math.random() });
		} 
		else if($scope.level == "hard") {
			var initial_order = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29];
			var mixed_order = initial_order.sort(function() { return 0.5 - Math.random() });

			order = [mixed_order.slice(0, 10), mixed_order.slice(10, 20), mixed_order.slice(20, 30)];
			flip_speed = 1800;
		}

		// A bit of complex logic to get the image flip properly
		var i = 0;
		$interval(function(){
			switch(true){
				case(i == 0):
					RevealImages(i);
					break;

				case(i == 3):
					HideImages(i - 1);
					$scope.opened_image = false;
					break;

				default:
					RevealImages(i);
					HideImages(i - 1);
			}

   			i++;
		}, flip_speed, 4);

		function RevealImages(i) {
	    	for(var n = 0; n < 10; n++){
				var image_name = $("#" + String(order[i][n])).attr("ng-class").split(",")[1].replace("]", "").trim();
				$("#" + String(order[i][n])).attr("src", "./images/" + image_name + ".jpg");
			}
	    }

	    function HideImages(i) {
	    	for(var n = 0; n < 10; n++){
				$("#" + String(order[i][n])).attr("src", "./images/question-mark.jpg");
			}
	    }
		
	}

	$scope.advancedReveal = function(image, state, src){
		if(state == 'closed' && $scope.opened_image == false){
			var current_image = this;
			$scope.opened_image = true;

			current_image.state = 'opened';
			current_image.src = image;

			$scope.turns++;

			if($scope.main_image != image){
				$timeout(function () {
					current_image.state = $scope.state;
					current_image.src = $scope.src;

					$scope.opened_image = false;
				}, 1000);
			}
			else {
				$scope.images_left--;
				$scope.opened_image = false;
			}
		}
	}

	$scope.timerCount = function(action){
		if(action == "start"){
			$scope.timer_function = $interval(function() {
				var time = new Date().getTime() - $scope.start_time;
				var elapsed = Math.floor(time / 100) / 10;

				if(Math.round(elapsed) == elapsed) { 
					elapsed += '.0'; 
				}

				$scope.timer = elapsed;
			}, 100);
		} else if(action == "stop"){
			$interval.cancel($scope.timer_function);
			$scope.opened_image = true;
		}
	}

	$scope.restart = function(){
		$window.location.reload();
	}
}]);