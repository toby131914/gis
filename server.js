const express = require('express');
const app = express();
const port = 3000;

// Serve static files from the parent directory
app.use(express.static('../'));

// Sample GeoJSON data
const geojsonData = {
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

// API endpoint to get GeoJSON data
app.get('/data', (req, res) => {
    res.json(geojsonData);
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
