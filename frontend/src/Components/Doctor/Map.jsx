import { useEffect, useState } from "react";
import Sidebar from "../Doctor/SideBar";
import { Box, TextField, Typography } from "@mui/material";

const Map = () => {
    const doctor = JSON.parse(sessionStorage.getItem("doctor"));
    const [fromLocation, setFromLocation] = useState(doctor.locations);
    const [toLocation, setToLocation] = useState("Mount Lavinia");
    const [distance, setDistance] = useState("");
    const [duration, setDuration] = useState("");

    useEffect(() => {
        const initMap = () => {
            const directionsService = new window.google.maps.DirectionsService();
            const directionsRenderer = new window.google.maps.DirectionsRenderer();
            const geocoder = new window.google.maps.Geocoder();


            const map = new window.google.maps.Map(document.getElementById("map"), {
                zoom: 12,
                center: { lat: 6.9271, lng: 79.8612 },
            });

            directionsRenderer.setMap(map);


            const getCoordinates = (locationName, callback) => {
                geocoder.geocode({ address: locationName }, (results, status) => {
                    if (status === 'OK') {
                        const location = results[0].geometry.location;
                        callback(location);
                    } else {
                        console.error('Geocode was not successful for the following reason: ' + status);
                    }
                });
            };


            getCoordinates(fromLocation, (startLocation) => {
                getCoordinates(toLocation, (endLocation) => {
                    const request = {
                        origin: startLocation,
                        destination: endLocation,
                        travelMode: 'DRIVING',
                    };


                    directionsService.route(request, (result, status) => {
                        if (status === 'OK') {
                            directionsRenderer.setDirections(result);


                            const route = result.routes[0];
                            const leg = route.legs[0];
                            const distanceText = leg.distance.text;
                            const durationText = leg.duration.text;

                            setDistance(distanceText);
                            setDuration(durationText);
                        } else {
                            console.error('Directions request failed due to ' + status);
                        }
                    });
                });
            });
        };

        initMap();
    }, [fromLocation, toLocation]);

    return (
        <Box
            sx={{
                display: "flex",
                height: "100vh",
                position: "relative",
                overflow: "hidden",
            }}
        >
            <Sidebar />
            <Box sx={{ flexGrow: 1, padding: "20px" }}>
                <Box id="map" sx={{ width: "100%", height: "80%" }}></Box>

                <Box sx={{ marginTop: "20px" }}>
                    <TextField
                        fullWidth
                        label="To Hospital"
                        variant="outlined"
                        value={toLocation}
                        onChange={(e) => setToLocation(e.target.value)}
                    />
                </Box>
                <Box sx={{ marginTop: "20px" }}>
                    <Typography variant="h6">Distance: {distance}</Typography>
                    <Typography variant="h6">Time to Destination: {duration}</Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default Map;
