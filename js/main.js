$(document).ready(function(){

  var mapID = 'stepfla.h33ln32g';
  var markerLayer = null;

  // Create Map
  var map = L.mapbox.map('map', mapID)
  .setView([48.1204969, 11.5440352], 9)
  .addControl(L.mapbox.geocoderControl(mapID));

  // Create Marker
  // this feature is in the GeoJSON format: see geojson.org
  // for the full specification
  $.getJSON( "js/markers.json", function( data ) {
    markerLayer = L.mapbox.markerLayer(data).addTo(map);

    // Since getJSON happens asynchronously everything that depends on the Markers has to be called in here
    prepareMapFunctionalities();
  });


  function prepareMapFunctionalities() {
    // Marker Hover
    markerLayer.on('mouseover', function(e) {
      e.layer.openPopup();
    });
    markerLayer.on('mouseout', function(e) {
      e.layer.closePopup();
    });

    // Custom Popup Window
    // https://www.mapbox.com/mapbox.js/example/v1.0.0/custom-popup/

    // Centering Markers on Click
    map.markerLayer.on('click', function(e) {
      map.panTo(e.layer.getLatLng());
    });

  // Programatically open Popup
  $('.show-city').click(function( event ){
    event.preventDefault();
    clickButton($(this).data('show-marker'));
  });

  function clickButton(markerTitle) {
    markerLayer.eachLayer(function(marker) {
        // you can replace this test for anything else, to choose the right
        // marker on which to open a popup. by default, popups are exclusive
        // so opening a new one will close all of the others.
        if (marker.feature.properties.title === markerTitle) {
          marker.openPopup();
        }
      });
  }
}
});


