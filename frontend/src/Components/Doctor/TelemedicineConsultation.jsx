import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Paper,
  Chip,
  Divider,
  Stepper,
  Step,
  StepLabel,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from "@mui/material";
import {
  VideoCall,
  Person,
  Warning,
  Description,
  Send,
  CallEnd,
  Mic,
  MicOff,
  Videocam,
  VideocamOff,
  ScreenShare,
  StopScreenShare,
} from "@mui/icons-material";
import Sidebar from "./SideBar";
import { useLocation } from "react-router-dom";
import axios from 'axios';

const TelemedicineConsultation = () => {
  const location = useLocation();
  const [patient, setPatient] = useState(null);
  const [soapNotes, setSoapNotes] = useState({
    subjective: "",
    objective: "",
    assessment: "",
    plan: ""
  });
  const [activeStep, setActiveStep] = useState(0);
  
  // Video call states
  const [callState, setCallState] = useState('idle'); // 'idle', 'connecting', 'connected', 'error'
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [consultationId, setConsultationId] = useState(null);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const screenStreamRef = useRef(null);

  const API_BASE_URL = 'http://localhost:8081/api';

  useEffect(() => {
    if (location.state?.patient) {
      setPatient(location.state.patient);
    } else {
      setPatient({
        name: "Aisha Khan",
        age: 45,
        gender: "Female",
        id: "A812345C",
        allergies: ["Penicillin"],
        conditions: ["Hypertension (controlled)"]
      });
    }

    // Cleanup on unmount
    return () => {
      stopVideoCall();
    };
  }, [location]);

  // Initialize WebRTC
  const initializeWebRTC = async () => {
    try {
      setCallState('connecting');
      
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      localStreamRef.current = stream;
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Create peer connection (simplified - in real app you'd use signaling server)
      const configuration = {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ]
      };

      peerConnectionRef.current = new RTCPeerConnection(configuration);

      // Add local stream to peer connection
      stream.getTracks().forEach(track => {
        peerConnectionRef.current.addTrack(track, stream);
      });

      // Handle remote stream
      peerConnectionRef.current.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      setCallState('connected');
      
      // Create consultation record in backend
      await createConsultation();
      
    } catch (error) {
      console.error('Error initializing WebRTC:', error);
      setCallState('error');
    }
  };

  // Create consultation record
  const createConsultation = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/consultations`, {
        patientId: patient?.id,
        doctorId: "doctor123", // In real app, get from auth context
        status: 'in-progress'
      });
      
      setConsultationId(response.data._id);
    } catch (error) {
      console.error('Error creating consultation:', error);
    }
  };

  // Start video call
  const startVideoCall = async () => {
    try {
      setShowVideoModal(true);
      await initializeWebRTC();
    } catch (error) {
      console.error('Error starting video call:', error);
      setCallState('error');
    }
  };

  // Stop video call
  const stopVideoCall = async () => {
    try {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
      
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach(track => track.stop());
      }
      
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }

      // Update consultation status
      if (consultationId) {
        await axios.post(`${API_BASE_URL}/daily/end-meeting`, {
          consultationId,
          duration: 0 // Calculate actual duration in real app
        });
      }

      setCallState('idle');
      setShowVideoModal(false);
      setIsScreenSharing(false);
    } catch (error) {
      console.error('Error stopping video call:', error);
    }
  };

  // Toggle microphone
  const toggleMic = () => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMicOn(!isMicOn);
    }
  };

  // Toggle camera
  const toggleCamera = () => {
    if (localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsCameraOn(!isCameraOn);
    }
  };

  // Toggle screen share
  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        });
        
        screenStreamRef.current = screenStream;
        
        // Replace video track with screen share
        const videoTrack = screenStream.getVideoTracks()[0];
        const sender = peerConnectionRef.current.getSenders().find(
          s => s.track && s.track.kind === 'video'
        );
        
        if (sender) {
          await sender.replaceTrack(videoTrack);
        }
        
        videoTrack.onended = () => {
          toggleScreenShare();
        };
        
        setIsScreenSharing(true);
      } else {
        // Switch back to camera
        const cameraStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        
        const videoTrack = cameraStream.getVideoTracks()[0];
        const sender = peerConnectionRef.current.getSenders().find(
          s => s.track && s.track.kind === 'video'
        );
        
        if (sender) {
          await sender.replaceTrack(videoTrack);
        }
        
        if (screenStreamRef.current) {
          screenStreamRef.current.getTracks().forEach(track => track.stop());
        }
        
        setIsScreenSharing(false);
      }
    } catch (error) {
      console.error('Error toggling screen share:', error);
    }
  };

  // Save SOAP notes to backend
  const saveSoapNotes = async () => {
    try {
      if (consultationId) {
        await axios.patch(`${API_BASE_URL}/consultations/${consultationId}/soap-notes`, soapNotes);
      }
    } catch (error) {
      console.error('Error saving SOAP notes:', error);
    }
  };

  const handleSoapChange = (section, value) => {
    setSoapNotes(prev => ({
      ...prev,
      [section]: value
    }));
  };

  const handleNextStep = () => {
    setActiveStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSaveNotes = async () => {
    await saveSoapNotes();
    console.log("SOAP Notes saved:", soapNotes);
    alert("Consultation notes saved successfully!");
  };

  const steps = ['Patient Info', 'SOAP Notes', 'Prescription', 'Summary'];

  if (!patient) {
    return <div>Loading...</div>;
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      
      <Box sx={{ flexGrow: 1, p: 3, backgroundColor: "#f5f5f5" }}>
        <Typography variant="h4" gutterBottom>
          Telemedicine Consultation
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Grid container spacing={3}>
          {/* Patient Details */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <VideoCall sx={{ mr: 1 }} />
                  Live Session
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body1" gutterBottom>
                    <strong>Patient:</strong> {patient.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Age: {patient.age} years • Gender: {patient.gender}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Patient ID: {patient.id}
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Critical Alerts */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <Warning sx={{ mr: 1, color: 'error.main' }} />
                    Critical Alerts
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Chip 
                      label={`Allergy: ${patient.allergies?.join(', ')}`} 
                      color="error" 
                      size="small" 
                      variant="outlined" 
                    />
                    <Chip 
                      label={`Condition: ${patient.conditions?.join(', ')}`} 
                      color="warning" 
                      size="small" 
                      variant="outlined" 
                    />
                  </Box>
                </Box>

                {/* Video Call Interface */}
                <Box sx={{ mt: 3, p: 2, backgroundColor: '#e3f2fd', borderRadius: 1 }}>
                  <Typography variant="body2" gutterBottom align="center">
                    Video Call Interface
                  </Typography>
                  
                  {/* Video Call Status */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="textSecondary">
                      Status: {callState === 'idle' && 'Ready to start'}
                      {callState === 'connecting' && 'Connecting...'}
                      {callState === 'connected' && 'Call in progress'}
                      {callState === 'error' && 'Error - Please try again'}
                    </Typography>
                  </Box>

                  {/* Video Call Controls */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {callState === 'idle' ? (
                      <Button 
                        fullWidth 
                        variant="contained" 
                        startIcon={<VideoCall />}
                        onClick={startVideoCall}
                        disabled={callState === 'connecting'}
                      >
                        {callState === 'connecting' ? 'Connecting...' : 'Start Video Call'}
                      </Button>
                    ) : (
                      <Button 
                        fullWidth 
                        variant="outlined" 
                        startIcon={<VideoCall />}
                        onClick={() => setShowVideoModal(true)}
                      >
                        Join Video Call
                      </Button>
                    )}
                    
                    {callState !== 'idle' && (
                      <Button 
                        fullWidth 
                        variant="contained" 
                        color="error"
                        startIcon={<CallEnd />}
                        onClick={stopVideoCall}
                      >
                        End Call
                      </Button>
                    )}
                  </Box>
                </Box>

                {/* Connection Info */}
                {callState === 'connected' && (
                  <Alert severity="success" sx={{ mt: 2 }}>
                    Connected to patient successfully
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Consultation Notes */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <Description sx={{ mr: 1 }} />
                  Consultation Notes (SOAP)
                </Typography>

                {activeStep === 1 && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <TextField
                      label="Subjective"
                      multiline
                      rows={3}
                      fullWidth
                      value={soapNotes.subjective}
                      onChange={(e) => handleSoapChange('subjective', e.target.value)}
                      placeholder="Patient reports general fatigue and intermittent headaches over the past week."
                    />
                    
                    <TextField
                      label="Objective"
                      multiline
                      rows={3}
                      fullWidth
                      value={soapNotes.objective}
                      onChange={(e) => handleSoapChange('objective', e.target.value)}
                      placeholder="Vital signs normal. No visible signs of acute distress."
                    />
                    
                    <TextField
                      label="Assessment"
                      multiline
                      rows={3}
                      fullWidth
                      value={soapNotes.assessment}
                      onChange={(e) => handleSoapChange('assessment', e.target.value)}
                      placeholder="Likely viral syndrome. Consider differential for tension headaches."
                    />
                    
                    <TextField
                      label="Plan"
                      multiline
                      rows={3}
                      fullWidth
                      value={soapNotes.plan}
                      onChange={(e) => handleSoapChange('plan', e.target.value)}
                      placeholder="Recommend rest, hydration, and over-the-counter pain relief."
                    />
                  </Box>
                )}

                {/* Navigation Buttons */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                  <Button
                    disabled={activeStep === 0}
                    onClick={handlePrevStep}
                  >
                    Back
                  </Button>
                  
                  {activeStep === steps.length - 1 ? (
                    <Button 
                      variant="contained" 
                      onClick={handleSaveNotes}
                      startIcon={<Send />}
                    >
                      Complete Consultation
                    </Button>
                  ) : (
                    <Button variant="contained" onClick={handleNextStep}>
                      Next
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Video Call Modal */}
        <Dialog
          open={showVideoModal}
          onClose={() => setShowVideoModal(false)}
          maxWidth="lg"
          fullWidth
          sx={{ '& .MuiDialog-paper': { height: '80vh' } }}
        >
          <DialogTitle>
            Video Consultation - {patient.name}
            <Typography variant="caption" display="block" color="textSecondary">
              {callState === 'connected' ? 'Live' : 'Connecting...'}
            </Typography>
          </DialogTitle>
          <DialogContent sx={{ position: 'relative', p: 0, backgroundColor: '#000' }}>
            {/* Remote Video (Patient) */}
            <Box
              sx={{
                width: '100%',
                height: '70%',
                backgroundColor: '#000',
              }}
            >
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </Box>

            {/* Local Video (Doctor) - Picture in Picture */}
            <Box
              sx={{
                position: 'absolute',
                bottom: 80,
                right: 16,
                width: 200,
                height: 150,
                border: '2px solid white',
                borderRadius: 2,
                overflow: 'hidden',
              }}
            >
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </Box>

            {/* Call Controls */}
            {callState === 'connected' && (
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 16,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  gap: 1,
                  backgroundColor: 'rgba(0,0,0,0.7)',
                  borderRadius: 2,
                  p: 1,
                }}
              >
                <IconButton 
                  onClick={toggleMic}
                  sx={{ 
                    backgroundColor: isMicOn ? 'primary.main' : 'error.main',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: isMicOn ? 'primary.dark' : 'error.dark',
                    }
                  }}
                >
                  {isMicOn ? <Mic /> : <MicOff />}
                </IconButton>
                
                <IconButton 
                  onClick={toggleCamera}
                  sx={{ 
                    backgroundColor: isCameraOn ? 'primary.main' : 'error.main',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: isCameraOn ? 'primary.dark' : 'error.dark',
                    }
                  }}
                >
                  {isCameraOn ? <Videocam /> : <VideocamOff />}
                </IconButton>

                <IconButton 
                  onClick={toggleScreenShare}
                  sx={{ 
                    backgroundColor: isScreenSharing ? 'secondary.main' : 'primary.main',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: isScreenSharing ? 'secondary.dark' : 'primary.dark',
                    }
                  }}
                >
                  {isScreenSharing ? <StopScreenShare /> : <ScreenShare />}
                </IconButton>
                
                <IconButton 
                  onClick={stopVideoCall}
                  sx={{ 
                    backgroundColor: 'error.main',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'error.dark',
                    }
                  }}
                >
                  <CallEnd />
                </IconButton>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowVideoModal(false)}>
              Minimize
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default TelemedicineConsultation;