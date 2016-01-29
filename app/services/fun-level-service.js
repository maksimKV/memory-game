var app = angular.module('MemoryGame');

app.service('FunLevelService', function() {

	this.setLevel = function(level)
	{
		// All the images
		var image_array = ['bananas', 'books', 'cat', 'dog', 'drill',
			'easter-eggs', 'fruits', 'glasses', 'mathematics', 'mechanics', 'squirrel',
			'sunset', 'surfer', 'swan', 'woman', 'wordpress'
		];

		big_array = image_array.sort(function() { return 0.5 - Math.random() });

		var medium_array = big_array.slice();
		medium_array.pop();

		var small_array = medium_array.slice();
		small_array.pop();

		switch(true){
				case(level == 'hard'):
					big_array = big_array.concat(big_array);
					big_array = big_array.sort(function() { return 0.5 - Math.random() });
					image_array = big_array;
				break;

				case(level == 'medium'):
					medium_array = medium_array.concat(medium_array);
					medium_array = medium_array.sort(function() { return 0.5 - Math.random() });
					image_array = medium_array;
				break;

				case(level == 'easy'):
					small_array = small_array.concat(small_array);
					small_array = small_array.sort(function() { return 0.5 - Math.random() });
					image_array = small_array;
				break;
			}

		return image_array;
	}

});