

mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 9 // starting zoom
});

// Create a default Marker, colored black, rotated 45 degrees.
const marker = new mapboxgl.Marker({ color: 'red' })
    .setLngLat(coordinates)
    .addTo(map);


