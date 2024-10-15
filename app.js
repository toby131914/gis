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

// 預設加載 OpenStreetMap 標準圖層
streets.addTo(map);

// 定義可切換的圖層
var baseMaps = {
    "通用地圖": streets,
    "衛星影像": satellite
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
    
