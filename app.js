// 初始化地圖，並設置預設視圖到特定的經緯度和縮放級別
var map = L.map('map').setView([24.12529, 120.5804443], 15);

// 添加 OpenStreetMap 標準圖層
var streets = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
});









// 添加衛星影像圖層（例如來自 Maptiler 或其他提供商）
var satellite = L.tileLayer('https://api.maptiler.com/maps/hybrid/256/{z}/{x}/{y}.jpg?key=PWeLuquVKhaQ2pfv4rFj', {
    attribution: '&copy; <a href="https://www.maptiler.com/">MapTiler</a>, Imagery © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
});







var normal = L.tileLayer('https://api.maptiler.com/maps/backdrop/256/{z}/{x}/{y}.png?key=PWeLuquVKhaQ2pfv4rFj', {
    attribution: '&copy; <a href="https://www.maptiler.com/">MapTiler</a>, Imagery © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
});



// 從 MapTiler API 加載 GEOJSON 資料
fetch('https://api.maptiler.com/data/eb2cbf95-54ec-49fa-884b-3d01e5ef5684/features.json?key=PWeLuquVKhaQ2pfv4rFj')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // 使用 L.geoJSON 方法將 GEOJSON 資料添加到地圖
        L.geoJSON(data, {
            // 可選：自定義樣式
            style: function (feature) {
                return { color: "#ff7800", weight: 2 };
            },
            // 綁定彈出視窗顯示屬性資料（如果有）
            onEachFeature: function (feature, layer) {
                if (feature.properties) {
                    layer.bindPopup(JSON.stringify(feature.properties));
                }
            }
        }).addTo(map);
    })
    .catch(error => console.error('Error loading GEOJSON:', error));




   



streets.addTo(map);
// 預設加載 OpenStreetMap 標準圖層


// 定義可切換的圖層
var baseMaps = {
    "通用地圖": streets,
    "衛星影像": satellite,
    "底圖":normal
};



// 添加圖層切換控制到地圖
L.control.layers(baseMaps).addTo(map);




// 允許標點功能
function onMapClick(e) {
    var lat = e.latlng.lat;
    var lng = e.latlng.lng;
    
    // 創建標記並添加到地圖上
    var marker = L.marker([lat, lng]).addTo(map);
    
    // 彈出窗口顯示經緯度資訊
    marker.bindPopup("Marker placed at: <br> Latitude: " + lat + "<br> Longitude: " + lng).openPopup();
}

// 綁定地圖點擊事件，當點擊地圖時添加標點
map.on('click', onMapClick);




// 儲存標記點位的陣列
let markedPoints = [];

// DMS 轉換為 Decimal Degrees
function dmsToDecimal(degrees, minutes, seconds, direction) {
    let dd = degrees + minutes / 60 + seconds / 3600;
    if (direction === "S" || direction === "W") {
        dd = -dd;
    }
    return dd;
}

// 搜尋並標示點位
function searchAndMark(dmsLat, dmsLng) {
    const lat = dmsToDecimal(dmsLat.degrees, dmsLat.minutes, dmsLat.seconds, dmsLat.direction);
    const lng = dmsToDecimal(dmsLng.degrees, dmsLng.minutes, dmsLng.seconds, dmsLng.direction);

    // 添加標記到地圖
    const marker = L.marker([lat, lng]).addTo(map);
    marker.bindPopup(`
        Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}<br>
        <button onclick="removeMarker(${lat}, ${lng})">刪除點位</button>
    `).openPopup();
    map.setView([lat, lng], 15);

    // 暫存點位資訊
    markedPoints.push({
        latitude: lat,
        longitude: lng,
        marker: marker
    });

    console.log("已暫存點位資訊:", markedPoints);
}

// 解析 DMS 座標字串
function parseDMS(input) {
    const regex = /(\d+)°(\d+)'(\d+)"([NSEW])/;
    const matches = input.match(regex);

    if (!matches) {
        alert("DMS 格式無效！請使用類似 '25°3'50\"N' 的格式。");
        return null;
    }

    return {
        degrees: parseInt(matches[1], 10),
        minutes: parseInt(matches[2], 10),
        seconds: parseInt(matches[3], 10),
        direction: matches[4]
    };
}

// 處理搜尋動作
function handleSearch() {
    const latInput = document.getElementById("latDMS").value;
    const lngInput = document.getElementById("lngDMS").value;

    const latDMS = parseDMS(latInput);
    const lngDMS = parseDMS(lngInput);

    if (latDMS && lngDMS) {
        searchAndMark(latDMS, lngDMS);
    }
}

// 移除標記點位
function removeMarker(lat, lng) {
    const index = markedPoints.findIndex(point => point.latitude === lat && point.longitude === lng);

    if (index !== -1) {
        // 從地圖移除標記
        map.removeLayer(markedPoints[index].marker);

        // 從陣列中移除
        markedPoints.splice(index, 1);

        console.log("已移除點位:", { lat, lng });
    } else {
        alert("找不到指定的點位");
    }
}

// 導出點位資料為 GeoJSON
function exportToGeoJSON() {
    const geoJSON = {
        type: "FeatureCollection",
        features: markedPoints.map(point => ({
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [point.longitude, point.latitude]
            },
            properties: {}
        }))
    };

    const dataStr = JSON.stringify(geoJSON, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "marked_points.geojson";
    link.click();
}

