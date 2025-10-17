const express = require('express');
const router = express.Router();
const Room = require('../Model/Room');

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

// PUT update room status
router.put('/:id', async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('patientId');

    if (!room) {
      return res.status(404).json({ success: false, error: 'Room not found' });
    }

    res.json({ success: true, room });
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
      
      // Private Rooms
      { roomId: 'P-201', type: 'private', status: 'available', floor: '2', capacity: 1, price: 5000 },
      { roomId: 'P-202', type: 'private', status: 'occupied', floor: '2', capacity: 1, price: 5000 },
      { roomId: 'P-203', type: 'private', status: 'available', floor: '2', capacity: 1, price: 5000 },
      
      // ICU Rooms
      { roomId: 'I-301', type: 'icu', status: 'available', floor: '3', capacity: 1, price: 10000 },
      { roomId: 'I-302', type: 'icu', status: 'cleaning', floor: '3', capacity: 1, price: 10000 },
      { roomId: 'I-303', type: 'icu', status: 'occupied', floor: '3', capacity: 1, price: 10000 }
    ];

    await Room.deleteMany({});
    await Room.insertMany(sampleRooms);

    res.json({ success: true, message: 'Sample rooms initialized successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;