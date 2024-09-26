var map = L.map('map').setView([51.505, -0.09], 6);

var mapMarkers = [];


L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

    getCurrentLocation();

    function getCurrentLocation() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(showPosition);
        } else { 
          alert("Geolocation is not supported by this browser.");
        }
      }
      
      function showPosition(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;           
        L.marker([latitude, longitude]).addTo(map)
                        .bindPopup('Current Location')
                        .openPopup(); 
                        map.setView([latitude, longitude], 6)

      }

    function showLocations(result){
            if(result){
                mapMarkers.forEach(o=>o.remove());
                mapMarkers = [];
                //L.markerClusterGroup.clearLayers();
                result.forEach(location=>{
                    let marker = L.marker([location.latitude, location.longitude]).addTo(map)
                        .bindPopup(location.location_name)
                        .openPopup();
                        mapMarkers.push(marker);
                })
            }
    }

    


$(document).ready(function() {
    fetchLocations();
    $('#locationForm').on('submit', function(e) {
        e.preventDefault();
        const locationName = $('#location').val();
        
        $.ajax({
            url: 'api.php',  // Path to your PHP file
            type: 'POST',
            data: { location: locationName },
            success: function(response) {
                const data = JSON.parse(response);
                if (data.status === 'success') {
                    $('#location').val('');
                    myMsgFunc('Location added successfully!');
                    fetchLocations(); 
                } else {
                    myMsgFunc('Failed to add location. ' + data.message);
                }
            },
            error: function() {
                myMsgFunc('An error occurred. Please try again.');
            }
        });

    });
    

    

    // Update location via AJAX
    $('#updateLocationForm').on('submit', function(e) {
        e.preventDefault();
        const id = $('#updateLocationId').val();
        const newLocationName = $('#newLocationName').val();

        $.ajax({
            url: 'updateLocation.php',
            type: 'POST',
            data: { id: id, location: newLocationName },
            success: function(response) {
                const data = JSON.parse(response);
                if (data.status === 'success') {
                    myMsgFunc('Location updated successfully!');
                    fetchLocations();
                    $('#updateModal').hide();
                } else {
                    myMsgFunc('Failed to update location: ' + data.message);
                }
            },
            error: function() {
                myMsgFunc('Failed to update location. Please try again.');
            }
        });
    });

    // Cancel update action
    $('#cancelUpdate').on('click', function() {
        $('#updateModal').hide();
    });
});

function fetchLocations() {
    $.ajax({
        url: 'getLocations.php',  // Path to PHP file that fetches locations
        type: 'GET',
        success: function(response) {
                const data = JSON.parse(response);
                if (data.status === 'success') {
                    const locations = data.locations;
                    const tableBody = $('#locationsTable tbody');
                    tableBody.empty();  // Clear existing data
                    console.log(locations.length);
                    if (locations.length > 0) {
                        locations.forEach(function(location) {
                            const row = `<tr>
                                <td>${location.location_name}</td>
                                <td>${location.latitude}</td>
                                <td>${location.longitude}</td>
                                <td class="action-btns" style="text-align:center;">
                                    <button onClick="editLocation(${location.id}, '${location.location_name}')">Update</button>
                                    <button onClick="deleteLocation(${location.id})">Delete</button>
                                </td></tr>`;
                            tableBody.append(row);
                        });
                        showLocations(locations);
                    } else {
                        showLocations([]);
                        tableBody.append('<tr><td colspan="4" style="text-align:center;">No Locations Found.</td></tr>');
                    }
                } else {
                    myMsgFunc('Failed to fetch locations. ' + data.message);
                }
            
        },
        error: function() {
            myMsgFunc('Failed to fetch locations. Please try again.');
        }
    });
}

// Show update modal with location details
function editLocation(id, locationName) {
    $('#updateLocationId').val(id);
    $('#newLocationName').val(locationName);
    $('#updateModal').show();
}

// Function to delete location
function deleteLocation (id) {
    if (confirm('Are you sure you want to delete this location?')) {
        $.ajax({
            url: 'deleteLocation.php',
            type: 'POST',
            data: { id: id },
            success: function(response) {
                console.log(response)
                const data = JSON.parse(response);
                if (data.status === 'success') {
                    myMsgFunc('Location deleted successfully!');
                    fetchLocations();
                } else {
                    myMsgFunc('Failed to delete location: ' + data.message);
                }
            },
            error: function() {
                myMsgFunc('Failed to delete location. Please try again.');
            }
        });
    }
}

function myMsgFunc(msg) {
    $('#message').html('<p>'+ msg +'</p>');
    $('#message').show();
    setTimeout(function () {
        $('#message').hide();
    }, 2000);
}

