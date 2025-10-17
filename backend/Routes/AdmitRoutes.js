const express = require('express');
const router = express.Router();
const Admit = require('../Model/Admit');
const Room = require('../Model/Room');

// GET all admit records
router.get('/', async (req, res) => {
  try {
    const admits = await Admit.find().sort({ createdAt: -1 });
    res.json({ success: true, admit: admits });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET single admit record
router.get('/:id', async (req, res) => {
  try {
    const admit = await Admit.findById(req.params.id);
    if (!admit) {
      return res.status(404).json({ success: false, error: 'Admit record not found' });
    }
    res.json({ success: true, admit });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST new admit record with appointment data
router.post('/', async (req, res) => {
  try {
    const { 
      admitID, 
      fullname, 
      nic, 
      phone, 
      email, 
      assignedDoctor, 
      appointmentData,
      // Appointment fields
      patientName,
      patientAge,
      patientGender,
      contactNumber,
      appointmentDate,
      appointmentTime,
      reason,
      doctor,
      status
    } = req.body;
    
    const newAdmit = new Admit({
      admitID,
      fullname: fullname || patientName,
      nic,
      phone: phone || contactNumber,
      email,
      assignedDoctor: assignedDoctor || doctor,
      appointmentData: appointmentData || {
        patientName: fullname || patientName,
        patientAge,
        patientGender,
        contactNumber: phone || contactNumber,
        appointmentDate,
        appointmentTime,
        reason,
        doctor: assignedDoctor || doctor,
        status
      }
    });

    await newAdmit.save();
    res.status(201).json({ success: true, admit: newAdmit });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// GET admit records by patient email
router.get('/patient/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const admits = await Admit.find({ email }).sort({ createdAt: -1 });
    res.json({ success: true, admits });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT update admit record
router.put('/:id', async (req, res) => {
  try {
    const admit = await Admit.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!admit) {
      return res.status(404).json({ success: false, error: 'Admit record not found' });
    }

    res.json({ success: true, admit });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// PUT update discharge information
router.put('/:id/discharge', async (req, res) => {
  try {
    const { dischargePlanning, dischargeSummary, dischargeInstructions, dischargeDate } = req.body;
    
    const updateData = {
      status: 'Discharge Planning'
    };

    if (dischargePlanning) updateData.dischargePlanning = dischargePlanning;
    if (dischargeSummary) updateData.dischargeSummary = dischargeSummary;
    if (dischargeInstructions) updateData.dischargeInstructions = dischargeInstructions;
    if (dischargeDate) updateData.dischargeDate = dischargeDate;

    const admit = await Admit.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!admit) {
      return res.status(404).json({ success: false, error: 'Admit record not found' });
    }

    res.json({ success: true, admit });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// PUT finalize discharge
router.put('/:id/finalize-discharge', async (req, res) => {
  try {
    const { roomReleaseStatus } = req.body;
    
    const admit = await Admit.findById(req.params.id);
    if (!admit) {
      return res.status(404).json({ success: false, error: 'Admit record not found' });
    }

    // Update room status if patient has a room assigned
    if (admit.roomId) {
      const room = await Room.findOne({ roomId: admit.roomId });
      if (room) {
        room.status = 'available';
        room.patientId = null;
        await room.save();
      }
    }

    const updatedAdmit = await Admit.findByIdAndUpdate(
      req.params.id,
      { 
        roomReleaseStatus: roomReleaseStatus || 'Released',
        status: 'Discharged',
        dischargeDate: new Date()
      },
      { new: true, runValidators: true }
    );

    res.json({ 
      success: true, 
      admit: updatedAdmit,
      message: `Patient discharged successfully and room ${admit.roomId || ''} released`
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// GET admitted patients (for discharge list)
router.get('/status/admitted', async (req, res) => {
  try {
    const admittedPatients = await Admit.find({ 
      status: { $in: ['Admitted', 'Discharge Planning'] } 
    }).sort({ createdAt: -1 });
    
    res.json({ success: true, patients: admittedPatients });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE admit record
router.delete('/:id', async (req, res) => {
  try {
    const admit = await Admit.findById(req.params.id);
    if (!admit) {
      return res.status(404).json({ success: false, error: 'Admit record not found' });
    }

    // Release room if assigned
    if (admit.roomId) {
      const room = await Room.findOne({ roomId: admit.roomId });
      if (room) {
        room.status = 'available';
        room.patientId = null;
        await room.save();
      }
    }

    await Admit.findByIdAndDelete(req.params.id);

    res.json({ 
      success: true, 
      message: 'Patient record deleted and room released successfully' 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;