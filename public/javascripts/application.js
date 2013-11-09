$(function(){  
  L.Icon.Default.imagePath = "images" 
  var map = L.map('map-container').setView([51.505, -0.09], 13);
  L.tileLayer('http://{s}.tile.cloudmade.com/039d836ba966419b838a12f72eda8fbc/997/256/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
      maxZoom: 18
  }).addTo(map);
  var locations = []
  var markers = []
  $.each($('tr'), function(index, value) {
    locations.push($($(value).children()[2]).text())
  }); 
  locations = $.grep(locations, function(v, k){
      return $.inArray(v, locations) === k;
  });
  locations.reverse();
  $.each(locations, function(index, value) {
    $.ajax({
      url: "http://nominatim.openstreetmap.org/search", 
      data: {q: value, format: "json"}, 
      dataType: "json", 
      success: function(resp) { 
        if(resp.length > 0 && resp[0].display_name.split(",").length > 2) {
          guessed_location = resp[0]
          var marker = new L.marker([guessed_location.lat, guessed_location.lon])
          marker.addTo(map)
            .bindPopup(guessed_location.display_name)
            .openPopup();
          markers.push(new L.LatLng(guessed_location.lat, guessed_location.lon)); 
          if ((index + 1) == locations.length) {
            map.fitBounds(new L.LatLngBounds(markers).pad(1.2));            
          }
        }
      }
    });     
  });   
  

}); 
