// Initialize the map and set its view to a central point in the U.S.
var map = L.map('map').setView([37.0902, -95.7129], 4);

// Add a tile layer to the map (using OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

// Function to generate random coordinates within a specified range
function getRandomInRange(from, to, fixed) {
    return (Math.random() * (to - from) + from).toFixed(fixed) * 1;
    // .toFixed() returns a string, so ' * 1' converts it to a number
}

// Generate 3 sets of random coordinates
const coordinates = [];
for (let i = 0; i < 3; i++) {
    const randomLat = getRandomInRange(30, 35, 3); // Latitude range
    const randomLng = getRandomInRange(-100, -90, 3); // Longitude range
    coordinates.push({ lat: randomLat, lng: randomLng });
}

// Display the marker information below the map
document.getElementById('marker1').textContent = `Marker 1: Latitude ${coordinates[0].lat}, Longitude ${coordinates[0].lng}`;
document.getElementById('marker2').textContent = `Marker 2: Latitude ${coordinates[1].lat}, Longitude ${coordinates[1].lng}`;
document.getElementById('marker3').textContent = `Marker 3: Latitude ${coordinates[2].lat}, Longitude ${coordinates[2].lng}`;

// Function to fetch locality using reverse geocoding API
async function fetchLocality(lat, lng, index) {
    const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`);
    const data = await response.json();

    // Extract locality from the response
    const locality = data.locality || "Unknown Locality";

    // Update the corresponding marker information with the locality
    document.getElementById(`marker${index + 1}`).textContent += `, Locality: ${locality}`;
}

// Add markers to the map and fetch locality for each coordinate
coordinates.forEach((coord, index) => {
    // Create a marker for the coordinate
    const marker = L.marker([coord.lat, coord.lng]).addTo(map);
    
    // Optional: Bind a popup to the marker that shows the locality (initially unknown)
    marker.bindPopup(`Latitude: ${coord.lat}<br>Longitude: ${coord.lng}<br>Locality: Loading...`).openPopup();

    // Fetch the locality and update the marker's popup
    fetchLocality(coord.lat, coord.lng, index).then((locality) => {
        marker.setPopupContent(`Latitude: ${coord.lat}<br>Longitude: ${coord.lng}<br>Locality: ${locality}`);
    });
});

// Log the generated coordinates to the console for verification
console.log('Random Coordinates:', coordinates);
