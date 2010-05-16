/*
 * simpleWeather
 * 
 * A simple jQuery plugin to display the weather information
 * for a locations. Weather is pulled from the public Yahoo!
 * Weather feed via their api.
 *
 * Developed by James Fleeting <twofivethreetwo@gmail.com>
 * Another project from monkeeCreate <http://monkeecreate.com>
 *
 * Version 1.0 - Last updated: May 16 2010
 */

(function($) {
	$.extend({
		simpleWeather: function(options){
			var options = $.extend({
				location: '76309',
				tempUnit: 'f',
				success: function(weather){},
				error: function(message){}
			}, options);

			var weatherUrl = 'http://query.yahooapis.com/v1/public/yql?format=json&diagnostics=true&callback=&q=';
			if(options.location != '')
				weatherUrl += 'select * from weather.forecast where location in ("'+options.location+'") and u="'+options.tempUnit+'"';
			else {
				options.error("No location given.");
				return false;
			}
						
			$.ajax({
				url: weatherUrl,
				dataType: 'json',
				success: function(data) {
					if(data != null) {
						$.each(data.query.results, function(i, result) {
							currentDate = new Date();
							sunRise = new Date(currentDate.toDateString() +' '+ result.astronomy.sunrise);
							sunSet = new Date(currentDate.toDateString() +' '+ result.astronomy.sunset);
							if (currentDate>sunRise && currentDate<sunSet)
								timeOfDay = 'd'; 
							else
								timeOfDay = 'n';
							
							var weather = {							
								title: result.item.title,
								temp: result.item.condition.temp,
								units:{
									temp: result.units.temperature,
									distance: result.units.distance,
									pressure: result.units.pressure,
									speed: result.units.speed
								},
								currently: result.item.condition.text,
								high: result.item.forecast[0].high,
								low: result.item.forecast[0].low,
								forecast: result.item.forecast[0].text,
								wind:{
									chill: result.wind.chill,
									direction: result.wind.direction,
									speed: result.wind.speed
								},
								humidity: result.atmosphere.humidity,
								pressure: result.atmosphere.pressure,
								rising: result.atmosphere.rising,
								visibility: result.atmosphere.visibility,
								sunrise: result.astronomy.sunrise,
								sunset: result.astronomy.sunset,
								description: result.item.description,
								image: "http://l.yimg.com/a/i/us/nws/weather/gr/"+result.item.condition.code+timeOfDay+".png",
								tomorrow:{
									high: result.item.forecast[1].high,
									low: result.item.forecast[1].low,
									forecast: result.item.forecast[1].text,
									date: result.item.forecast[1].date,
									day: result.item.forecast[1].day,
									image: "http://l.yimg.com/a/i/us/nws/weather/gr/"+result.item.forecast[1].code+"d.png",
								},
								city: result.location.city,
								country: result.location.country,
								region: result.location.region,
								updated: result.item.pubDate,
								link: result.item.link,
							};
							
							options.success(weather);
						});
					} else {
						options.error("Bad request.");
					}
				}
			});
			
			return this;
		}		
	});
})(jQuery);