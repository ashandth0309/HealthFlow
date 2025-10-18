import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from "@mui/material";
import LabStafNav from "../Staff/LabStafNav";

const DoctorReview = () => {
  const [activeTab, setActiveTab] = useState('medicines');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Sample prescribed medicines data
  const [prescribedMedicines] = useState([
    {
      id: 'PM001',
      patientName: 'John Doe',
      doctorName: 'Dr. Smith',
      medicationName: 'Amoxicillin',
      dosage: '500mg',
      frequency: '3 times daily',
      duration: '7 days',
      prescriptionDate: '2024-01-15',
      status: 'Active',
      labVerified: true
    },
    {
      id: 'PM002',
      patientName: 'Jane Wilson',
      doctorName: 'Dr. Johnson',
      medicationName: 'Metformin',
      dosage: '850mg',
      frequency: '2 times daily',
      duration: '30 days',
      prescriptionDate: '2024-01-14',
      status: 'Completed',
      labVerified: true
    },
    {
      id: 'PM003',
      patientName: 'Mike Brown',
      doctorName: 'Dr. Davis',
      medicationName: 'Lisinopril',
      dosage: '10mg',
      frequency: 'Once daily',
      duration: '30 days',
      prescriptionDate: '2024-01-13',
      status: 'Pending Review',
      labVerified: false
    },
    {
      id: 'PM004',
      patientName: 'Sarah Connor',
      doctorName: 'Dr. Wilson',
      medicationName: 'Atorvastatin',
      dosage: '20mg',
      frequency: 'Once daily',
      duration: '90 days',
      prescriptionDate: '2024-01-12',
      status: 'Active',
      labVerified: true
    }
  ]);

  // Sample lab tests data
  const [labTests] = useState([
    {
      id: 'LT001',
      patientName: 'John Doe',
      doctorName: 'Dr. Smith',
      testName: 'Complete Blood Count (CBC)',
      testType: 'Blood Test',
      orderDate: '2024-01-15',
      expectedResults: '2024-01-16',
      status: 'In Progress',
      priority: 'Normal',
      notes: 'Check for infection markers'
    },
    {
      id: 'LT002',
      patientName: 'Jane Wilson',
      doctorName: 'Dr. Johnson',
      testName: 'Lipid Panel',
      testType: 'Blood Test',
      orderDate: '2024-01-14',
      expectedResults: '2024-01-15',
      status: 'Completed',
      priority: 'Normal',
      notes: 'Routine cholesterol check'
    },
    {
      id: 'LT003',
      patientName: 'Mike Brown',
      doctorName: 'Dr. Davis',
      testName: 'Urine Analysis',
      testType: 'Urine Test',
      orderDate: '2024-01-13',
      expectedResults: '2024-01-14',
      status: 'Completed',
      priority: 'High',
      notes: 'Check for kidney function'
    },
    {
      id: 'LT004',
      patientName: 'Sarah Connor',
      doctorName: 'Dr. Wilson',
      testName: 'Thyroid Function Test',
      testType: 'Blood Test',
      orderDate: '2024-01-12',
      expectedResults: '2024-01-13',
      status: 'Pending',
      priority: 'Normal',
      notes: 'Annual thyroid check'
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': case 'Completed': return 'success';
      case 'In Progress': return 'info';
      case 'Pending': case 'Pending Review': return 'warning';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'error';
      case 'Normal': return 'success';
      case 'Low': return 'info';
      default: return 'default';
    }
  };

  const filteredMedicines = prescribedMedicines.filter(medicine => {
    const matchesSearch = 
      medicine.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      medicine.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      medicine.medicationName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || medicine.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const filteredLabTests = labTests.filter(test => {
    const matchesSearch = 
      test.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.testName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || test.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="lab_page_container">
      <LabStafNav />
      <div className="lab_main_content">
        <Typography variant="h4" gutterBottom style={{ fontWeight: 'bold', color: '#333' }}>
          Doctor Reviews - Admin Dashboard
        </Typography>

        {/* Tab Navigation */}
        <Card style={{ marginBottom: '20px' }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <Button
                  variant={activeTab === 'medicines' ? 'contained' : 'outlined'}
                  onClick={() => setActiveTab('medicines')}
                  style={{ marginRight: '10px' }}
                >
                  💊 Prescribed Medicines
                </Button>
                <Button
                  variant={activeTab === 'tests' ? 'contained' : 'outlined'}
                  onClick={() => setActiveTab('tests')}
                >
                  🧪 Lab Tests Ordered
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card style={{ marginBottom: '20px' }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label="Search"
                  variant="outlined"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by patient, doctor, or medication/test name"
                />
              </Grid>
              <Grid item xs={3}>
                <FormControl fullWidth>
                  <InputLabel>Status Filter</InputLabel>
                  <Select
                    value={statusFilter}
                    label="Status Filter"
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <MenuItem value="all">All Statuses</MenuItem>
                    {activeTab === 'medicines' ? (
                      <>
                        <MenuItem value="Active">Active</MenuItem>
                        <MenuItem value="Completed">Completed</MenuItem>
                        <MenuItem value="Pending Review">Pending Review</MenuItem>
                      </>
                    ) : (
                      <>
                        <MenuItem value="In Progress">In Progress</MenuItem>
                        <MenuItem value="Completed">Completed</MenuItem>
                        <MenuItem value="Pending">Pending</MenuItem>
                      </>
                    )}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={2}>
                <Typography variant="h6" style={{ color: '#1976d2' }}>
                  Total: {activeTab === 'medicines' ? filteredMedicines.length : filteredLabTests.length}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Prescribed Medicines Table */}
        {activeTab === 'medicines' && (
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom style={{ fontWeight: 'bold' }}>
                Prescribed Medicines Review
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead style={{ backgroundColor: '#f0f0f0' }}>
                    <TableRow>
                      <TableCell><strong>Prescription ID</strong></TableCell>
                      <TableCell><strong>Patient Name</strong></TableCell>
                      <TableCell><strong>Doctor</strong></TableCell>
                      <TableCell><strong>Medication</strong></TableCell>
                      <TableCell><strong>Dosage & Frequency</strong></TableCell>
                      <TableCell><strong>Duration</strong></TableCell>
                      <TableCell><strong>Date</strong></TableCell>
                      <TableCell><strong>Status</strong></TableCell>
                      <TableCell><strong>Lab Verified</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredMedicines.map((medicine, index) => (
                      <TableRow key={index}>
                        <TableCell>{medicine.id}</TableCell>
                        <TableCell>{medicine.patientName}</TableCell>
                        <TableCell>{medicine.doctorName}</TableCell>
                        <TableCell style={{ fontWeight: 'bold' }}>{medicine.medicationName}</TableCell>
                        <TableCell>
                          {medicine.dosage}<br />
                          <small>{medicine.frequency}</small>
                        </TableCell>
                        <TableCell>{medicine.duration}</TableCell>
                        <TableCell>{medicine.prescriptionDate}</TableCell>
                        <TableCell>
                          <Chip 
                            label={medicine.status} 
                            color={getStatusColor(medicine.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={medicine.labVerified ? 'Verified' : 'Pending'} 
                            color={medicine.labVerified ? 'success' : 'warning'}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}

        {/* Lab Tests Table */}
        {activeTab === 'tests' && (
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom style={{ fontWeight: 'bold' }}>
                Lab Tests Ordered by Doctors
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead style={{ backgroundColor: '#f0f0f0' }}>
                    <TableRow>
                      <TableCell><strong>Test ID</strong></TableCell>
                      <TableCell><strong>Patient Name</strong></TableCell>
                      <TableCell><strong>Doctor</strong></TableCell>
                      <TableCell><strong>Test Name</strong></TableCell>
                      <TableCell><strong>Test Type</strong></TableCell>
                      <TableCell><strong>Order Date</strong></TableCell>
                      <TableCell><strong>Expected Results</strong></TableCell>
                      <TableCell><strong>Status</strong></TableCell>
                      <TableCell><strong>Priority</strong></TableCell>
                      <TableCell><strong>Notes</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredLabTests.map((test, index) => (
                      <TableRow key={index}>
                        <TableCell>{test.id}</TableCell>
                        <TableCell>{test.patientName}</TableCell>
                        <TableCell>{test.doctorName}</TableCell>
                        <TableCell style={{ fontWeight: 'bold' }}>{test.testName}</TableCell>
                        <TableCell>{test.testType}</TableCell>
                        <TableCell>{test.orderDate}</TableCell>
                        <TableCell>{test.expectedResults}</TableCell>
                        <TableCell>
                          <Chip 
                            label={test.status} 
                            color={getStatusColor(test.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={test.priority} 
                            color={getPriorityColor(test.priority)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <small>{test.notes}</small>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DoctorReview;