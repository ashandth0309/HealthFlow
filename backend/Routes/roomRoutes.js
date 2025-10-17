const express = require('express');
const router = express.Router();
const Room = require('../Model/Room');
const Admit = require('../Model/Admit');

// GET all rooms
router.get('/', async (req, res) => {
  try {
    const rooms = await Room.find().populate('patientId');
    res.json({ success: true, rooms });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET rooms by type
router.get('/type/:type', async (req, res) => {
  try {
    const rooms = await Room.find({ type: req.params.type }).populate('patientId');
    res.json({ success: true, rooms });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST create new room
router.post('/', async (req, res) => {
  try {
    const room = new Room(req.body);
    await room.save();
    res.status(201).json({ success: true, room });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// PUT update room status - FIXED: Find by roomId, not _id
router.put('/:roomId', async (req, res) => {
  try {
    const { roomId } = req.params;
    const { status, patientId } = req.body;

    const room = await Room.findOneAndUpdate(
      { roomId: roomId },
      { status, patientId },
      { new: true, runValidators: true }
    );

    if (!room) {
      return res.status(404).json({ success: false, error: 'Room not found' });
    }

    res.json({ success: true, room });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// POST assign room to patient
router.post('/assign', async (req, res) => {
  try {
    const { roomId, patientId } = req.body;

    // Check if room exists and is available
    const room = await Room.findOne({ roomId: roomId });
    if (!room) {
      return res.status(404).json({ success: false, error: 'Room not found' });
    }

    if (room.status !== 'available') {
      return res.status(400).json({ success: false, error: 'Room is not available' });
    }

    // Check if patient exists
    const patient = await Admit.findById(patientId);
    if (!patient) {
      return res.status(404).json({ success: false, error: 'Patient not found' });
    }

    // Update room status
    room.status = 'occupied';
    room.patientId = patientId;
    await room.save();

    // Update patient record
    patient.roomId = roomId;
    patient.status = 'Admitted';
    await patient.save();

    res.json({ 
      success: true, 
      message: `Room ${roomId} assigned to ${patient.fullname} successfully`,
      room,
      patient 
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Initialize sample rooms
router.post('/initialize', async (req, res) => {
  try {
    const sampleRooms = [
      // Ward Rooms
      { roomId: 'W-101', type: 'ward', status: 'available', floor: '1', capacity: 4, price: 1000 },
      { roomId: 'W-102', type: 'ward', status: 'occupied', floor: '1', capacity: 4, price: 1000 },
      { roomId: 'W-103', type: 'ward', status: 'available', floor: '1', capacity: 4, price: 1000 },
      { roomId: 'W-104', type: 'ward', status: 'cleaning', floor: '1', capacity: 4, price: 1000 },
      { roomId: 'W-105', type: 'ward', status: 'occupied', floor: '1', capacity: 4, price: 1000 },
      { roomId: 'W-106', type: 'ward', status: 'available', floor: '1', capacity: 4, price: 1000 },
      { roomId: 'W-107', type: 'ward', status: 'occupied', floor: '1', capacity: 4, price: 1000 },
      { roomId: 'W-108', type: 'ward', status: 'available', floor: '1', capacity: 4, price: 1000 },
      { roomId: 'W-109', type: 'ward', status: 'cleaning', floor: '1', capacity: 4, price: 1000 },
      { roomId: 'W-110', type: 'ward', status: 'occupied', floor: '1', capacity: 4, price: 1000 },
      
      // Private Rooms
      { roomId: 'P-201', type: 'private', status: 'available', floor: '2', capacity: 1, price: 5000 },
      { roomId: 'P-202', type: 'private', status: 'occupied', floor: '2', capacity: 1, price: 5000 },
      { roomId: 'P-203', type: 'private', status: 'available', floor: '2', capacity: 1, price: 5000 },
      { roomId: 'P-204', type: 'private', status: 'cleaning', floor: '2', capacity: 1, price: 5000 },
      { roomId: 'P-205', type: 'private', status: 'occupied', floor: '2', capacity: 1, price: 5000 },
      { roomId: 'P-206', type: 'private', status: 'available', floor: '2', capacity: 1, price: 5000 },
      { roomId: 'P-207', type: 'private', status: 'occupied', floor: '2', capacity: 1, price: 5000 },
      { roomId: 'P-208', type: 'private', status: 'available', floor: '2', capacity: 1, price: 5000 },
      
      // ICU Rooms
      { roomId: 'I-301', type: 'icu', status: 'available', floor: '3', capacity: 1, price: 10000 },
      { roomId: 'I-302', type: 'icu', status: 'cleaning', floor: '3', capacity: 1, price: 10000 },
      { roomId: 'I-303', type: 'icu', status: 'occupied', floor: '3', capacity: 1, price: 10000 },
      { roomId: 'I-304', type: 'icu', status: 'available', floor: '3', capacity: 1, price: 10000 },
      { roomId: 'I-305', type: 'icu', status: 'available', floor: '3', capacity: 1, price: 10000 }
    ];

    await Room.deleteMany({});
    await Room.insertMany(sampleRooms);

    res.json({ success: true, message: 'Sample rooms initialized successfully', rooms: sampleRooms });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;