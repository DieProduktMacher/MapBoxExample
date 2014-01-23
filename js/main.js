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

  // Programatically open Popup on Click
  $('.show-city').click(function( event ){
    event.preventDefault();
    var markerTitle = $(this).data('show-marker');
    markerLayer.eachLayer(function(marker) {
        if (marker.feature.properties.title === markerTitle) {
          marker.openPopup();
        }
      });
  });



  /**************** MARKER FILTERS ****************/


// find and store a variable reference to the list of filters
var filters = document.getElementById('filters');

// Wait until the marker layer is loaded in order to build a list of possible
// types. If you are doing this with another markerLayer, you should change
// map.markerLayer to the variable you have assigned to your markerLayer
map.markerLayer.on('ready', function() {
  // collect the types of symbols in this layer. you can also just
  // hardcode an array of types if you know what you want to filter on,
  // like
  var types = ['city', 'restaurant'];

  var checkboxes = [];
  // create a filter interface
  for (var i = 0; i < types.length; i++) {

    // create an <li> list element for each type, and add an input checkbox
    // and label inside
    var li = filters.appendChild(document.createElement('li'));
    var checkbox = li.appendChild(document.createElement('input'));
    var label = li.appendChild(document.createElement('label'));
    checkbox.type = 'checkbox';
    checkbox.id = types[i];
    checkbox.checked = true;
    // create a label to the right of the checkbox with explanatory text
    label.innerHTML = types[i];
    label.setAttribute('for', types[i]);
    // whenever a person clicks on this checkbox, call the update() function
    // below
    checkbox.addEventListener('change', update);
    checkboxes.push(checkbox);
  }

  // this function is called whenever someone clicks on a checkbox and changes
  // the selection of markers to be displayed
  function update() {
    console.log("update");
    var enabled = {};
    // run through each checkbox and record whether it is checked. If it is,
    // add it to the object of types to display, otherwise do not.
    for (var i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].checked) enabled[checkboxes[i].id] = true;
      console.log("checking");
    }
    markerLayer.setFilter(function(feature) {
      console.log("Set Filter");
      // if this symbol is in the list, return true. if not, return false.
      // the 'in' operator in javascript does exactly that: given a string
      // or number, it says if that is in a object
      // 2 in { 2: true } // true
      // 2 in { } // false
      return (feature.properties['category'] in enabled);
    });
  }
});
}
});


