const express = require('express');
const router = express.Router();
const Admit = require('../Model/Admit');

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

// PUT update admit record
router.put('/:id', async (req, res) => {
  try {
    const admit = await Admit.findByIdAndUpdate(
      req.params.id,
      req.body,
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

// DELETE admit record
router.delete('/:id', async (req, res) => {
  try {
    const admit = await Admit.findByIdAndDelete(req.params.id);
    if (!admit) {
      return res.status(404).json({ success: false, error: 'Admit record not found' });
    }
    res.json({ success: true, message: 'Admit record deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;