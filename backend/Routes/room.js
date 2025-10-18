const express = require('express');
const router = express.Router();
const {
  getAllRooms,
  getRoomsByType,
  createRoom,
  updateRoom,
  assignRoom,
  initializeRooms,
  releaseRoomByPatient,
  releaseRoom
} = require('../Controllers/roomController');

// GET all rooms
router.get('/', getAllRooms);

// GET rooms by type
router.get('/type/:type', getRoomsByType);

// POST create new room
router.post('/', createRoom);

// PUT update room status
router.put('/:roomId', updateRoom);

// POST assign room to patient
router.post('/assign', assignRoom);

// Initialize sample rooms
router.post('/initialize', initializeRooms);

// PUT release room by patient ID
router.put('/release-by-patient/:patientId', releaseRoomByPatient);

// PUT release room by room ID
router.put('/release/:roomId', releaseRoom);

module.exports = router;