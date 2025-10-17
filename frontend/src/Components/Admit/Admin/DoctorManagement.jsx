import React from "react";
import { Box, Typography, Card, CardContent } from "@mui/material";

const DoctorManagement = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Doctor Management
      </Typography>
      <Card>
        <CardContent>
          <Typography>Doctor management content goes here...</Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DoctorManagement;