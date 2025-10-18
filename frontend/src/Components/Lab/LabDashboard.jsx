import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  LinearProgress,
  Chip,
  Alert
} from "@mui/material";

const LabDashboard = () => {
  const [labOrders, setLabOrders] = useState([]);
  const [stats, setStats] = useState({
    pending: 0,
    processing: 0,
    completed: 0,
    alerts: 0
  });

  useEffect(() => {
    fetchLabOrders();
  }, []);

  const fetchLabOrders = async () => {
    try {
      const response = await axios.get("http://localhost:8081/lab/orders");
      setLabOrders(response.data.labOrders);
      calculateStats(response.data.labOrders);
    } catch (error) {
      console.error("Error fetching lab orders:", error);
    }
  };

  const calculateStats = (orders) => {
    const stats = {
      pending: orders.filter(order => order.status === 'Pending').length,
      processing: orders.filter(order => order.status === 'Processing').length,
      completed: orders.filter(order => order.status === 'Completed').length,
      alerts: orders.filter(order => order.criticalValues?.length > 0).length
    };
    setStats(stats);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'warning';
      case 'Processing': return 'info';
      case 'Completed': return 'success';
      case 'Rejected': return 'error';
      default: return 'default';
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Lab Order Dashboard
      </Typography>
      
      {/* Stats Cards */}
      <Grid container spacing={3} style={{ marginBottom: '20px' }}>
        <Grid item xs={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary">Pending Orders</Typography>
              <Typography variant="h4">{stats.pending}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary">Processing Orders</Typography>
              <Typography variant="h4">{stats.processing}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary">Completed Today</Typography>
              <Typography variant="h4">{stats.completed}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary">Priority Alerts</Typography>
              <Typography variant="h4" color="error">{stats.alerts}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Active Lab Orders */}
      <Typography variant="h5" gutterBottom>
        Active Lab Orders
      </Typography>
      
      {labOrders.map((order) => (
        <Card key={order._id} style={{ marginBottom: '10px' }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={2}>
                <Typography variant="body2">Patient ID</Typography>
                <Typography variant="h6">{order.patientId}</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography variant="body2">Test Name</Typography>
                <Typography>{order.testName}</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography variant="body2">Order Date</Typography>
                <Typography>{new Date(order.orderDate).toLocaleDateString()}</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography variant="body2">Status</Typography>
                <Chip 
                  label={order.status} 
                  color={getStatusColor(order.status)}
                  size="small"
                />
              </Grid>
              <Grid item xs={2}>
                <Typography variant="body2">Progress</Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={order.progress} 
                  style={{ marginTop: '5px' }}
                />
                <Typography variant="caption">{order.progress}%</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography variant="body2">Analyzer</Typography>
                <Typography>{order.analyzer}</Typography>
              </Grid>
            </Grid>
            
            {order.criticalValues?.length > 0 && (
              <Alert severity="error" style={{ marginTop: '10px' }}>
                Critical values detected: {order.criticalValues.join(', ')}
              </Alert>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default LabDashboard;