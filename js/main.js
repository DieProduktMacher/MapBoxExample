$(document).ready(function () {

  var mapID = 'stepfla.h33ln32g';
  var markerLayer = null;

    // Create Map
    var map = L.mapbox.map('map', mapID)
    .setView([48.1204969, 11.5440352], 9)
    .addControl(L.mapbox.geocoderControl(mapID));

    // Create Marker
    // this feature is in the GeoJSON format: see geojson.org
    // for the full specification
    $.getJSON("js/markers.json", function (data) {
      markerLayer = L.mapbox.markerLayer(data).addTo(map);

        // Since getJSON happens asynchronously everything that depends on the Markers has to be called in here
        prepareMapFunctionalities();
      });


    function prepareMapFunctionalities() {

      /************* Fit Bounds *********/

      $('#fitBounds').click(function(){
        var southWest = new L.LatLng(40.712, -74.227),
        northEast = new L.LatLng(40.774, -74.125),
        bounds = new L.LatLngBounds(southWest, northEast);

        map.fitBounds(bounds);
      });



      /********* Marker Hover ********/

        // markerLayer.on('mouseover', function (e) {
        //     e.layer.openPopup();
        // });
        // markerLayer.on('mouseout', function (e) {
        //     e.layer.closePopup();
        // });

/********* Custom Popup Window ********/
        // https://www.mapbox.com/mapbox.js/example/v1.0.0/custom-popup/

        // Centering Markers on Click
        markerLayer.on('click', function (e) {
          map.panTo(e.layer.getLatLng());
        });

        // Programatically open Popup on Click
        $('.show-city').click(function (event) {
          event.preventDefault();

          var markerTitle = $(this).data('show-marker');
          markerLayer.eachLayer(function (marker) {
            marker.closePopup();
            if (marker.feature.properties.title === markerTitle) {
              marker.openPopup();
            }
          });
        });



        /**************** MARKER FILTERS ****************/


        // find and store a variable reference to the list of filters
        var $filters = $('#filters');

        // Wait until the marker layer is loaded in order to build a list of possible
        // types. If you are doing this with another markerLayer, you should change
        // map.markerLayer to the variable you have assigned to your markerLayer
        map.markerLayer.on('ready', function () {
            // collect the types of symbols in this layer. you can also just
            // hardcode an array of types if you know what you want to filter on,
            // like
            var types = ['city', 'restaurant'];
            var checkboxes = [];

            // create checkboxes
            for (var i = 0; i < types.length; i++) {

              var checkboxID = types[i];
              $filters.append('<li><input type="checkbox" checked id="' + checkboxID + '"><label for="' + checkboxID + '">' + checkboxID + '</li>');
              $checkbox = $('#' + checkboxID);
              $checkbox.on('change', update);
              checkboxes.push($checkbox);
            }

            // this function is called whenever someone clicks on a checkbox and changes
            // the selection of markers to be displayed
            function update() {
              var enabled = {};
                // run through each checkbox and record whether it is checked. If it is,
                // add it to the object of types to display, otherwise do not.
                for (var i = 0; i < checkboxes.length; i++) {
                  if (checkboxes[i].is(':checked')) {
                    enabled[checkboxes[i].attr('id')] = true;
                  }
                }
                markerLayer.setFilter(function (feature) {
                    // Check if category is enabled
                    return (feature.properties['category'] in enabled);
                  });
              }
            });
}
});