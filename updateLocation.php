<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "map";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = $_POST['id'];
    $newLocationName = $_POST['location'];

    // Geocode API to get latitude and longitude from the location name
    $apiKey = 'YOUR API KEY'; // Use your Google Maps API key here
    $geocodeUrl = "https://maps.googleapis.com/maps/api/geocode/json?address=" . urlencode($newLocationName) . "&key=" . $apiKey;

    $response = file_get_contents($geocodeUrl);
    $responseData = json_decode($response, true);

    if ($responseData['status'] === 'OK') {
        // Extract latitude and longitude from response
        $latitude = $responseData['results'][0]['geometry']['location']['lat'];
        $longitude = $responseData['results'][0]['geometry']['location']['lng'];

        $sql = "UPDATE locations SET location_name='$newLocationName', latitude=$latitude, longitude=$longitude WHERE id=$id";


        if ($conn->query($sql) === TRUE) {
            echo json_encode([
                'status' => 'success',
                'latitude' => $latitude,
                'longitude' => $longitude
            ]);
        } else {
            echo json_encode([
                'status' => 'error',
                'message' => $conn->error
            ]);
        }
    }

}

?>
