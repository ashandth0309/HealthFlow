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
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import LabStafNav from "../Staff/LabStafNav";

const AdverseReactionReport = () => {
  const [openReportDialog, setOpenReportDialog] = useState(false);
  const [reactionType, setReactionType] = useState('');
  const [severity, setSeverity] = useState('');
  const [description, setDescription] = useState('');
  const [patientId, setPatientId] = useState('');
  const [testName, setTestName] = useState('');

  // Sample adverse reactions data
  const [adverseReactions] = useState([
    {
      id: 'AR001',
      patientId: 'P-1001',
      patientName: 'John Doe',
      testName: 'Blood Draw - CBC',
      reactionType: 'Allergic Reaction to Antiseptic',
      severity: 'Mild',
      description: 'Patient developed mild skin rash at injection site after iodine antiseptic application',
      reportedBy: 'Lab Tech - Sarah Wilson',
      dateReported: '2024-01-15',
      status: 'Investigated',
      actionTaken: 'Switched to alcohol-based antiseptic, reaction resolved'
    },
    {
      id: 'AR002',
      patientId: 'P-1002',
      patientName: 'Jane Smith',
      testName: 'Contrast CT Scan',
      reactionType: 'Contrast Media Reaction',
      severity: 'Moderate',
      description: 'Patient experienced nausea and mild difficulty breathing 5 minutes after contrast injection',
      reportedBy: 'Radiologist - Dr. Brown',
      dateReported: '2024-01-14',
      status: 'Under Review',
      actionTaken: 'Patient treated with antihistamine, monitored for 2 hours, recovered fully'
    },
    {
      id: 'AR003',
      patientId: 'P-1003',
      patientName: 'Mike Johnson',
      testName: 'Glucose Tolerance Test',
      reactionType: 'Hypoglycemic Episode',
      severity: 'Moderate',
      description: 'Patient experienced dizziness, sweating, and tremors during the 2-hour glucose test',
      reportedBy: 'Lab Supervisor - Mary Johnson',
      dateReported: '2024-01-13',
      status: 'Resolved',
      actionTaken: 'Test discontinued, patient given glucose tablets, vital signs monitored'
    },
    {
      id: 'AR004',
      patientId: 'P-1004',
      patientName: 'Sarah Davis',
      testName: 'Biopsy Procedure',
      reactionType: 'Local Anesthetic Reaction',
      severity: 'Mild',
      description: 'Patient reported prolonged numbness and tingling beyond expected duration',
      reportedBy: 'Dr. Anderson',
      dateReported: '2024-01-12',
      status: 'Monitored',
      actionTaken: 'Patient advised to return if symptoms persist beyond 24 hours'
    }
  ]);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Mild': return 'success';
      case 'Moderate': return 'warning';
      case 'Severe': return 'error';
      default: return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Resolved': return 'success';
      case 'Under Review': return 'warning';
      case 'Investigated': return 'info';
      case 'Monitored': return 'default';
      default: return 'default';
    }
  };

  const handleSubmitReport = () => {
    // Here you would normally submit to your backend
    console.log('New adverse reaction report:', {
      reactionType,
      severity,
      description,
      patientId,
      testName
    });
    
    // Reset form
    setReactionType('');
    setSeverity('');
    setDescription('');
    setPatientId('');
    setTestName('');
    setOpenReportDialog(false);
    
    alert('Adverse reaction report submitted successfully!');
  };

  return (
    <div className="lab_page_container">
      <LabStafNav />
      <div className="lab_main_content">
        <Typography variant="h4" gutterBottom style={{ fontWeight: 'bold', color: '#333' }}>
          Adverse Reaction Reports - Lab Safety Dashboard
        </Typography>
        
        <Typography variant="body1" color="textSecondary" style={{ marginBottom: '30px' }}>
          Monitor and report adverse reactions to lab procedures, contrast media, medications being tested, or equipment issues.
        </Typography>

        {/* Action Buttons */}
        <Card style={{ marginBottom: '20px' }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => setOpenReportDialog(true)}
                  style={{ fontWeight: 'bold' }}
                >
                  🚨 Report New Adverse Reaction
                </Button>
              </Grid>
              <Grid item>
                <Button variant="outlined" color="primary">
                  📊 Generate Safety Report
                </Button>
              </Grid>
              <Grid item>
                <Button variant="outlined" color="secondary">
                  📋 Safety Guidelines
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Statistics Cards */}
        <Grid container spacing={3} style={{ marginBottom: '30px' }}>
          <Grid item xs={3}>
            <Card style={{ backgroundColor: '#ffebee' }}>
              <CardContent style={{ textAlign: 'center' }}>
                <Typography variant="h6" style={{ color: '#d32f2f' }}>Total Reports</Typography>
                <Typography variant="h3" style={{ color: '#d32f2f', fontWeight: 'bold' }}>
                  {adverseReactions.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={3}>
            <Card style={{ backgroundColor: '#fff3e0' }}>
              <CardContent style={{ textAlign: 'center' }}>
                <Typography variant="h6" style={{ color: '#f57c00' }}>Under Review</Typography>
                <Typography variant="h3" style={{ color: '#f57c00', fontWeight: 'bold' }}>
                  {adverseReactions.filter(r => r.status === 'Under Review').length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={3}>
            <Card style={{ backgroundColor: '#e8f5e8' }}>
              <CardContent style={{ textAlign: 'center' }}>
                <Typography variant="h6" style={{ color: '#2e7d32' }}>Resolved</Typography>
                <Typography variant="h3" style={{ color: '#2e7d32', fontWeight: 'bold' }}>
                  {adverseReactions.filter(r => r.status === 'Resolved').length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={3}>
            <Card style={{ backgroundColor: '#fce4ec' }}>
              <CardContent style={{ textAlign: 'center' }}>
                <Typography variant="h6" style={{ color: '#c2185b' }}>This Month</Typography>
                <Typography variant="h3" style={{ color: '#c2185b', fontWeight: 'bold' }}>
                  {adverseReactions.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Adverse Reactions Table */}
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom style={{ fontWeight: 'bold' }}>
              Recent Adverse Reaction Reports
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead style={{ backgroundColor: '#f0f0f0' }}>
                  <TableRow>
                    <TableCell><strong>Report ID</strong></TableCell>
                    <TableCell><strong>Patient ID</strong></TableCell>
                    <TableCell><strong>Patient Name</strong></TableCell>
                    <TableCell><strong>Test/Procedure</strong></TableCell>
                    <TableCell><strong>Reaction Type</strong></TableCell>
                    <TableCell><strong>Severity</strong></TableCell>
                    <TableCell><strong>Date Reported</strong></TableCell>
                    <TableCell><strong>Reported By</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                    <TableCell><strong>Action Taken</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {adverseReactions.map((reaction, index) => (
                    <TableRow key={index}>
                      <TableCell>{reaction.id}</TableCell>
                      <TableCell>{reaction.patientId}</TableCell>
                      <TableCell>{reaction.patientName}</TableCell>
                      <TableCell style={{ fontWeight: 'bold' }}>{reaction.testName}</TableCell>
                      <TableCell>{reaction.reactionType}</TableCell>
                      <TableCell>
                        <Chip 
                          label={reaction.severity} 
                          color={getSeverityColor(reaction.severity)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{reaction.dateReported}</TableCell>
                      <TableCell>{reaction.reportedBy}</TableCell>
                      <TableCell>
                        <Chip 
                          label={reaction.status} 
                          color={getStatusColor(reaction.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <small>{reaction.actionTaken}</small>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Report New Adverse Reaction Dialog */}
        <Dialog open={openReportDialog} onClose={() => setOpenReportDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle style={{ backgroundColor: '#f44336', color: 'white' }}>
            🚨 Report New Adverse Reaction
          </DialogTitle>
          <DialogContent style={{ padding: '20px' }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Patient ID"
                  variant="outlined"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  style={{ marginTop: '10px' }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Test/Procedure Name"
                  variant="outlined"
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                  style={{ marginTop: '10px' }}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth style={{ marginTop: '10px' }}>
                  <InputLabel>Reaction Type</InputLabel>
                  <Select
                    value={reactionType}
                    label="Reaction Type"
                    onChange={(e) => setReactionType(e.target.value)}
                  >
                    <MenuItem value="Allergic Reaction to Antiseptic">Allergic Reaction to Antiseptic</MenuItem>
                    <MenuItem value="Contrast Media Reaction">Contrast Media Reaction</MenuItem>
                    <MenuItem value="Local Anesthetic Reaction">Local Anesthetic Reaction</MenuItem>
                    <MenuItem value="Hypoglycemic Episode">Hypoglycemic Episode</MenuItem>
                    <MenuItem value="Equipment Malfunction Injury">Equipment Malfunction Injury</MenuItem>
                    <MenuItem value="Specimen Collection Complication">Specimen Collection Complication</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth style={{ marginTop: '10px' }}>
                  <InputLabel>Severity</InputLabel>
                  <Select
                    value={severity}
                    label="Severity"
                    onChange={(e) => setSeverity(e.target.value)}
                  >
                    <MenuItem value="Mild">Mild</MenuItem>
                    <MenuItem value="Moderate">Moderate</MenuItem>
                    <MenuItem value="Severe">Severe</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Detailed Description"
                  variant="outlined"
                  multiline
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ marginTop: '10px' }}
                  placeholder="Describe the adverse reaction, timeline, symptoms, and immediate actions taken..."
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions style={{ padding: '20px' }}>
            <Button onClick={() => setOpenReportDialog(false)} color="secondary">
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitReport} 
              color="error" 
              variant="contained"
              disabled={!reactionType || !severity || !description || !patientId || !testName}
            >
              Submit Report
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default AdverseReactionReport;