// Initialize the map and set its view to your chosen geographical coordinates and zoom level
var map = L.map('map').setView([51.505, -0.09], 13);

// Add OpenStreetMap satellite layer to the map
L.tileLayer('https://api.maptiler.com/maps/hybrid/256/{z}/{x}/{y}.jpg?key=PWeLuquVKhaQ2pfv4rFj', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.maptiler.com/">Maptiler</a>',
    maxZoom: 18
}).addTo(map);

// Example GeoJSON data to add to the map
var geojsonData = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [-0.09, 51.505]
            },
            "properties": {
                "name": "Marker 1"
            }
        }
    ]
};

// Add GeoJSON data to the map
L.geoJson(geojsonData).addTo(map);
