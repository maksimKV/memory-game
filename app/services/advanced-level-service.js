var app = angular.module('MemoryGame');

app.service('AdvancedLevelService', function() {

	this.setLevel = function(){
		// All the images
		var original_images = ['bananas', 'books', 'cat', 'dog', 'drill',
			'easter-eggs', 'fruits', 'glasses', 'mathematics', 'mechanics', 'squirrel',
			'sunset', 'surfer', 'swan', 'woman', 'wordpress'
		];

		// Removing on a random principle ten images from the array
		var trimmed_images = original_images.slice();
		trimmed_images.sort(function() { return 0.5 - Math.random() });

		for(var i = 0; i < 10; i++){
			trimmed_images.pop();
		}

		var complete_images = trimmed_images.concat(trimmed_images, trimmed_images, trimmed_images, trimmed_images);
		complete_images.sort(function() { return 0.5 - Math.random() });

		return complete_images;
	}

});