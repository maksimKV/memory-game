var app = angular.module('MemoryGame');

app.controller('GameController', ['$scope', '$timeout', 'FunLevelService',
	function($scope, $timeout, FunLevelService) {

	// Declarin the $scope variables
	$scope.game_option = null;
	$scope.level = null;

	$scope.first_image = null;
	$scope.second_image = null;

	$scope.images = [];

	$scope.state = 'closed';
	$scope.src = 'question-mark';

	$scope.$watchGroup(['game_option', 'level'], function() {
		if($scope.game_option == "fun" && $scope.level){
			$scope.basicGame();
		}
		else if($scope.game_option == "training"){

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
	}

	$scope.basicReveal = function(image, state, src){
		if($scope.first_image == null && $scope.second_image == null && state == 'closed'){
			$scope.first_image = this;
			this.state = 'opened';
			this.src = image;

		} else if($scope.second_image == null && state == 'closed'){
			this.state = 'opened';
			this.src = image;
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
			}
		}
	}
}]);