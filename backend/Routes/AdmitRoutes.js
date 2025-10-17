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

// GET single admit record - FIXED THIS ENDPOINT
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

// POST new admit record
router.post('/', async (req, res) => {
  try {
    const { admitID, fullname, nic, phone, email, assignedDoctor, appointmentData } = req.body;
    
    const newAdmit = new Admit({
      admitID,
      fullname,
      nic,
      phone,
      email,
      assignedDoctor,
      appointmentData
    });

    await newAdmit.save();
    res.status(201).json({ success: true, admit: newAdmit });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// PUT update admit record - FIXED
router.put('/:id', async (req, res) => {
  try {
    const admit = await Admit.findByIdAndUpdate(
      req.params.id,
      { $set: req.body }, // Use $set to properly update fields
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

    // Only update fields that are provided
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
    
    const admit = await Admit.findByIdAndUpdate(
      req.params.id,
      { 
        $set: {
          roomReleaseStatus,
          status: 'Discharged',
          dischargeDate: new Date()
        }
      },
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

// PUT finalize discharge - UPDATED TO HANDLE ROOM RELEASE
router.put('/:id/finalize-discharge', async (req, res) => {
  try {
    const { roomReleaseStatus } = req.body;
    
    // Find the admit record first
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

    // Update admit record
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

// DELETE admit record - UPDATED
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

    // Delete the admit record
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