
var myMap = L.map("mapid", {
  center: [40.7128, -74.0059],
  zoom: 11,
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
  for (i=0;i<Geometry.length;i++){
    lng = (Geometry[i].geometry.coordinates[0])
    lat=(Geometry[i].geometry.coordinates[1])
    depth=(Geometry[i].geometry.coordinates[2])
   
    Locations .push(
    L.circle([lat,lng],{
      stroke: false,
      fillOpacity:depth ,
      color: "green",
      fillColor: "green",
      radius: Geometry[i].properties.mag*1000
    })
    )
  }
  var earthquake = L.layerGroup(Locations);
    // Create an overlay object
  var overlayMaps = {
    "Earthquake": earthquake,
  };

  console.log(data)
  console.log(lat);
  console.log(lng)


L.control.layers(baseMaps,overlayMaps).addTo(myMap);
}
);