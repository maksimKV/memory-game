(function(){

var app = angular.module('memory-game', []);

var game_option = null;
var level = null;


var setGame = function($scope){
	$scope.start = function(value, type){
		if(type == 'option'){
			game_option = value;
			$scope.game_option = value;
		} else if(type == 'level'){
			level = value;
			$scope.level = value;
		}
	};
};

// All the images
var image_array = ['bananas', 'books', 'cat', 'dog', 'drill',
	'easter-eggs', 'fruits', 'glasses', 'mathematics', 'mechanics', 'squirrel',
	'sunset', 'surfer', 'swan', 'woman', 'wordpress'];

var basicGame = function($scope, $timeout){
	var first_image = null;
	var second_image = null;

	big_array = image_array.sort(function() { return 0.5 - Math.random() });

	var medium_array = big_array.slice();
	medium_array.pop();

	var small_array = medium_array.slice();
	small_array.pop();

	$scope.$watch('level', function(){

		switch(true){
			case(level == 'hard'):
				big_array = big_array.concat(big_array);
				big_array = big_array.sort(function() { return 0.5 - Math.random() });
				$scope.images = big_array;
			break;

			case(level == 'medium'):
				medium_array = medium_array.concat(medium_array);
				medium_array = medium_array.sort(function() { return 0.5 - Math.random() });
				$scope.images = medium_array;
			break;

			case(level == 'easy'):
				small_array = small_array.concat(small_array);
				small_array = small_array.sort(function() { return 0.5 - Math.random() });
				$scope.images = small_array;
			break;
		}
	});

	
	
	$scope.state = 'closed';
	$scope.src = 'question-mark';

	// The reavealing functionality
	$scope.reveal = function(image, state, src){
		if(first_image == null && second_image == null && state == 'closed'){
			first_image = this;
			this.state = 'opened';
			this.src = image;

		} else if(second_image == null && state == 'closed'){
			this.state = 'opened';
			this.src = image;
			second_image = this;

			if(image != first_image.image){
				$timeout(function () {
					second_image.state = 'closed';
					second_image.src = $scope.src;

					first_image.state = 'closed';
					first_image.src = $scope.src;

					first_image = null;
					second_image = null;
				 }, 1000);
			} else {
				first_image = null;
				second_image = null;
			}
		}
	};
};

app.controller("setGame", ["$scope", setGame]);
app.controller("basicGame", ["$scope", "$timeout", basicGame]);
}());