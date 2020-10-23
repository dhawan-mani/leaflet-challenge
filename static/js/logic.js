
var myMap = L.map("mapid", {
  center: [35.007, -97.0929],
  zoom: 5,
  layers: Satellite
});

// Adding tile layer
var GrayScale = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/light-v10",
  accessToken: API_KEY
})

var Satellite =  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/satellite-v9",
  accessToken: API_KEY
}).addTo(myMap)

var Outdoors =  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/outdoors-v11",
  accessToken: API_KEY
})

// Create a baseMaps object
var baseMaps = {
  "Satellite": Satellite,
  "GrayScale": GrayScale,
  "Outdoors": Outdoors
};



// Pass our map layers into our layer control
// Add the layer control to the map


// Use this link to get the geojson data.
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
let lat=0;
let lng=0;
let depth=0;
let Locations = [];
// Grabbing our GeoJSON data..
d3.json(link, function(data) {
  // Creating a GeoJSON layer with the retrieved data
 var Geometry = data.features
 var markers = L.markerClusterGroup();
  for (i=0;i<Geometry.length;i++){
    lng = (Geometry[i].geometry.coordinates[0])
    lat=(Geometry[i].geometry.coordinates[1])
    depth=(Geometry[i].geometry.coordinates[2])

    // Loop through the coorrdinates  and create one marker for each city object

      // Conditionals for countries points
      var color = "";
      if (depth > 90) {
        color = "red";
      }
      else if (depth > 70 && depth < 90) {
        color = "#E74C3C";
      }
      else if (depth > 50 && depth < 70) {
        color = "#DC7633";
      }
      else if (depth > 30 && depth < 50) {
        color = "#F1C40F";
      }
      else if (depth > 10 && depth < 30) {
        color = "#CCFF00";
      }
      else {
        color = "#66FF00";
      }
    Locations .push(
    L.circle([lat,lng],{
      stroke: false,
      fillOpacity:depth ,
      color: "white",
      fillColor: color,
      radius: Geometry[i].properties.mag*5000
    })
    
    )


        
    if ([lat,lng]) {
      // Add a new marker to the cluster group and bind a pop-up
      markers.addLayer(L.marker([lat, lng])
        .bindPopup("Place:"+Geometry[i].properties.place +"<hr>"+
        "Magnitude:"+Geometry[i].properties.mag+"<br>"+
        "Time:"+Geometry[i].properties.time));
    }
  }
  
  var earthquake = L.layerGroup(Locations);
    // Create an overlay object
  var overlayMaps = {
    "Earthquake": earthquake,
  };
   // Add our marker cluster layer to the map
   myMap.addLayer(markers);

  console.log(data)
  console.log(lat);
  console.log(lng)
 


L.control.layers(baseMaps,overlayMaps).addTo(myMap);
}
);

function getColor(d) {
  return d === '90+'  ? "red" :
         d === '70-90'  ? "#E74C3C" :
         d === '50-70' ? "#DC7633" :
         d === '30-50' ? "#F1C40F" :
         d === '10-30' ? "#CCFF00" :
                      "#66FF00";
}

var legend = L.control({position: 'bottomright'});
legend.onAdd = function (map) {

var div = L.DomUtil.create('div', 'info legend');
labels = ['<strong>Depths</strong>'],
categories = ['90+','70-90','50-70','30-50','10-30','-10-10'];

for (var i = 0; i < categories.length; i++) {

        div.innerHTML += 
        labels.push(
            '<i class="circle" style="background:' + getColor(categories[i]) + '"></i> ' +
        (categories[i] ? categories[i] : '+'));

    }
    div.innerHTML = labels.join('<br>');
return div;
};
legend.addTo(myMap);
