---

title: "Blending colors with Javscript"
date: 2015.05.22
tags:
  - javascript
  - colors
  - css
publish: true

---

Recently I needed a way mix colors; specifically, get a new
color, from a given pair of colors and a percentage value (how 'much'
to mix the colors).

Here is a screenshot of what I am talking about:

![blend-js-screenshot](http://i.imgur.com/3cYq4bu.png)

The solution is to simply the split the colors into their red, green, and blue
channels and mix them separately.

```javascript
(function(window) {
	function define_blend() {
		var Blend = {};

		Blend.at = function(start_color, end_color, percent) {
			var r = mix(rgb(start_color, 'r'), rgb(end_color, 'r'), percent);
			var g = mix(rgb(start_color, 'g'), rgb(end_color, 'g'), percent);
			var b = mix(rgb(start_color, 'b'), rgb(end_color, 'b'), percent);

			return "#" + hex(r) + hex(g) + hex(b);
		}

		return Blend;
	}

	if (typeof(Blend) === 'undefined') {
		window.Blend = define_blend();
	} else {
		console.log('Blend already exists!');
	}

	function mix(rgb_a, rgb_b, percent) {
		return Math.round((rgb_b - rgb_a) * percent + rgb_a);
	}

	function rgb(hex_color, channel) {
		switch (channel) {
			case 'r':
				return parseInt(hex_color.substring(1, 3), 16);
			break;
			case 'g':
				return parseInt(hex_color.substring(3, 5), 16);
			break;
			case 'b':
				return parseInt(hex_color.substring(5, 7), 16);
			break;
		}
	}

	function hex(dec) {
		if (0 <= dec && dec <= 255) {
			return ("0" + dec.toString(16)).slice(-2);
		}
	}
})(window);
```

To use it, simply call

`Blend.at(<hex-color-1>, <hex-color-2>, <percentage>)`

which will return a new hex color code.

Here is the `test.js` file that generated what you saw on the screenshot.
```javascript
$(function() {
	var $body = $('body');
	var color1 = "#F53265"; // red
	var color2 = "#32F5C2"; // green
	var gap = 0.00;

  var bg, $div, p;

	$body.append($('<div class="example-1"></div>'));
	$body.append($('<div class="example-2"></div>'));
	$body.append($('<div class="example-3"></div>'));

	for (p = 0.0; p <= 1.0; p += 0.01) {
	  bg = Blend.at(color1, color2, p);
		$div = $('<div class="panel-2"></div>');

		$div.css('display', 'inline-block');
		$div.css('height', '50px');
		$div.css('margin-right', '0px');
		$div.css('width', '4px');
		$div.css('background-color', bg);

		$div.appendTo('.example-1');
	}

	for (p = 0.0; p <= 1.0; p += 0.01) {
		bg = Blend.at(color1, color2, p);
		$div = $('<div class="panel"></div>');

		$div.css('display', 'inline-block');
		$div.css('height', '50px');
		$div.css('margin-right', gap + 'px');
		$div.css('width', gap * 1.5 +'px');
		$div.css('background-color', bg)

		gap += 0.05;

		$div.appendTo('.example-2');
	}

	for (i = 0; i < 50; i++) {
		var max = 100, min = 0;
		var random_p = Math.floor(Math.random() * (max - min + 1)) + min;
		bg = Blend.at(color1, color2, (random_p / 100));
		$div = $('<div class="panel-3"></div>');

		$div.css('display', 'inline-block');
		$div.css('height', '50px');
		$div.css('margin-right', '0px');
		$div.css('width', '10px');
		$div.css('background-color', bg);
		console.log(random_p);
		console.log(bg);

		$div.appendTo('.example-3');
	}
});
```
