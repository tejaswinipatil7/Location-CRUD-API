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
    $locationName = $_POST['location'];

    // Geocode API to get latitude and longitude from the location name
    $apiKey = 'YOUR API KEY'; // Use your Google Maps API key here
    $geocodeUrl = "https://maps.googleapis.com/maps/api/geocode/json?address=" . urlencode($locationName) . "&key=" . $apiKey;

    $response = file_get_contents($geocodeUrl);
    $responseData = json_decode($response, true);

    if ($responseData['status'] === 'OK') {
        // Extract latitude and longitude from response
        $latitude = $responseData['results'][0]['geometry']['location']['lat'];
        $longitude = $responseData['results'][0]['geometry']['location']['lng'];

        // Prepare and execute SQL query to insert data
        $sql = "INSERT INTO locations (location_name, latitude, longitude)VALUES ('$locationName', $latitude, $longitude)";
        if ($conn->query($sql) === TRUE) {
            //echo "Location added successfully!";
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

        $conn->close();
    } else {
        echo "Failed to retrieve location data. Please try again.";
    }
}

//$conn->close();
?>
