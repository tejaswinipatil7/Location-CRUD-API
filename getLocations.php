<?php
// Database connection parameters
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

// Fetch all locations
$sql = "SELECT id,CONCAT(UPPER(SUBSTRING(location_name, 1, 1)), LOWER(SUBSTRING(location_name, 2))) AS location_name, latitude, longitude FROM locations";
$result = $conn->query($sql);

$locations = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $locations[] = $row;
    }

    echo json_encode(['status' => 'success', 'locations' => $locations]);
} else {
    // Return an empty locations array
    echo json_encode(["status" => "success", "locations" => []]);
}

?>
