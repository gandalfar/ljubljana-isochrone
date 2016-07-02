jQuery(document).ready(function($) {
	var map, googleLayer, maskLayer, marker, slider, points;

	updateMap = function(){
		var sliderValue = Math.round(slider.noUiSlider.get()) * 60;

		if ( points ) {
			var visiblePoints = $.grep(points, function(item, i) {
				return sliderValue >= item[2];
			});

			maskLayer.setData(visiblePoints);
			map.addLayer(maskLayer);

			$('.js-travel-time').html(Math.round(sliderValue / 60) + ' minutes');
		} else {
			$.get('data.json', function(data) {
				points = data;
				updateMap();
			});
		}
	};

	slider = $('#slider').get(0);
	noUiSlider.create(slider, {
		start: [10],
		step: 5,
		range: {
			'min': 0,
			'max': 120
		},
		connect: 'lower',
		pips: { 
			mode: 'steps',
			density: 2
		}

	});
	slider.noUiSlider.on('change', updateMap);

	map = L.map('map').setView([46.056515, 14.501460], 11);
	googleLayer = new L.Google('ROADMAP', {
			options: {
				maxZoom: 13
			}
	});
	map.addLayer(googleLayer);
	
	maskLayer = L.TileLayer.maskCanvas({
		radius: 800,
		useAbsoluteRadius: true
	});
	marker = L.marker([46.048148, 14.493625]).addTo(map);
	updateMap();

	$(window).on("resize", function() {
	    $("#map").height( $(window).height() - $('.container-main').height() );
	    map.invalidateSize();
	}).trigger("resize");
});
