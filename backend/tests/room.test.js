const request = require('supertest');
const express = require('express');
const roomRoutes = require('../Routes/room');
const Room = require('../Model/Room');
const Admit = require('../Model/Admit');

// Mock the models
jest.mock('../Model/Room');
jest.mock('../Model/Admit');

const app = express();
app.use(express.json());
app.use('/api/rooms', roomRoutes);

describe('Room Controller Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/rooms', () => {
    it('should get all rooms', async () => {
      const mockRooms = [
        { roomId: 'W-101', type: 'ward', status: 'available' },
        { roomId: 'P-201', type: 'private', status: 'occupied' }
      ];

      Room.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockRooms)
      });

      const response = await request(app)
        .get('/api/rooms')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.rooms).toEqual(mockRooms);
    });

    it('should handle errors when getting rooms', async () => {
      Room.find.mockReturnValue({
        populate: jest.fn().mockRejectedValue(new Error('Database error'))
      });

      const response = await request(app)
        .get('/api/rooms')
        .expect(500);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/rooms/type/:type', () => {
    it('should get rooms by type', async () => {
      const mockRooms = [
        { roomId: 'W-101', type: 'ward', status: 'available' },
        { roomId: 'W-102', type: 'ward', status: 'occupied' }
      ];

      Room.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockRooms)
      });

      const response = await request(app)
        .get('/api/rooms/type/ward')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Room.find).toHaveBeenCalledWith({ type: 'ward' });
    });
  });

  describe('POST /api/rooms', () => {
    it('should create a new room', async () => {
      const newRoom = {
        roomId: 'W-111',
        type: 'ward',
        status: 'available',
        floor: '1',
        capacity: 4,
        price: 1000
      };

      Room.prototype.save.mockResolvedValue(newRoom);

      const response = await request(app)
        .post('/api/rooms')
        .send(newRoom)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.room).toEqual(newRoom);
    });

    it('should handle validation errors when creating room', async () => {
      const invalidRoom = { roomId: 'W-111' }; // Missing required fields

      Room.prototype.save.mockRejectedValue(new Error('Validation failed'));

      const response = await request(app)
        .post('/api/rooms')
        .send(invalidRoom)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/rooms/assign', () => {
    it('should assign room to patient', async () => {
      const mockRoom = {
        roomId: 'W-101',
        status: 'available',
        patientId: null,
        save: jest.fn().mockResolvedValue(true)
      };

      const mockPatient = {
        _id: 'patient123',
        fullname: 'John Doe',
        roomId: null,
        status: 'Admitted',
        save: jest.fn().mockResolvedValue(true)
      };

      Room.findOne.mockResolvedValue(mockRoom);
      Admit.findById.mockResolvedValue(mockPatient);

      const assignmentData = {
        roomId: 'W-101',
        patientId: 'patient123'
      };

      const response = await request(app)
        .post('/api/rooms/assign')
        .send(assignmentData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(mockRoom.status).toBe('occupied');
      expect(mockRoom.patientId).toBe('patient123');
      expect(mockPatient.roomId).toBe('W-101');
    });

    it('should not assign unavailable room', async () => {
      const mockRoom = {
        roomId: 'W-101',
        status: 'occupied', // Already occupied
        patientId: 'existingPatient'
      };

      Room.findOne.mockResolvedValue(mockRoom);

      const response = await request(app)
        .post('/api/rooms/assign')
        .send({
          roomId: 'W-101',
          patientId: 'patient123'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('not available');
    });

    it('should not assign to non-existent patient', async () => {
      const mockRoom = {
        roomId: 'W-101',
        status: 'available',
        patientId: null
      };

      Room.findOne.mockResolvedValue(mockRoom);
      Admit.findById.mockResolvedValue(null); // Patient not found

      const response = await request(app)
        .post('/api/rooms/assign')
        .send({
          roomId: 'W-101',
          patientId: 'nonExistentPatient'
        })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Patient not found');
    });
  });

  describe('PUT /api/rooms/:roomId', () => {
    it('should update room status', async () => {
      const mockRoom = {
        roomId: 'W-101',
        status: 'available',
        patientId: null
      };

      Room.findOneAndUpdate.mockResolvedValue(mockRoom);

      const response = await request(app)
        .put('/api/rooms/W-101')
        .send({ status: 'cleaning' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Room.findOneAndUpdate).toHaveBeenCalledWith(
        { roomId: 'W-101' },
        { status: 'cleaning', patientId: undefined },
        { new: true, runValidators: true }
      );
    });

    it('should return 404 for non-existent room', async () => {
      Room.findOneAndUpdate.mockResolvedValue(null);

      const response = await request(app)
        .put('/api/rooms/non-existent')
        .send({ status: 'cleaning' })
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/rooms/release/:roomId', () => {
    it('should release room by room ID', async () => {
      const mockRoom = {
        roomId: 'W-101',
        status: 'occupied',
        patientId: 'patient123',
        save: jest.fn().mockResolvedValue(true)
      };

      const mockPatient = {
        _id: 'patient123',
        roomId: 'W-101',
        status: 'Admitted'
      };

      Room.findOne.mockResolvedValue(mockRoom);
      Admit.findByIdAndUpdate.mockResolvedValue(mockPatient);

      const response = await request(app)
        .put('/api/rooms/release/W-101')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(mockRoom.status).toBe('available');
      expect(mockRoom.patientId).toBe(null);
      expect(Admit.findByIdAndUpdate).toHaveBeenCalledWith(
        'patient123',
        { roomId: '', status: 'Discharged' }
      );
    });
  });

  describe('PUT /api/rooms/release-by-patient/:patientId', () => {
    it('should release room by patient ID', async () => {
      const mockPatient = {
        _id: 'patient123',
        roomId: 'W-101'
      };

      const mockRoom = {
        roomId: 'W-101',
        status: 'occupied',
        patientId: 'patient123',
        save: jest.fn().mockResolvedValue(true)
      };

      Admit.findById.mockResolvedValue(mockPatient);
      Room.findOne.mockResolvedValue(mockRoom);

      const response = await request(app)
        .put('/api/rooms/release-by-patient/patient123')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(mockRoom.status).toBe('available');
      expect(mockRoom.patientId).toBe(null);
    });

    it('should handle patient with no room assigned', async () => {
      const mockPatient = {
        _id: 'patient123',
        roomId: null // No room assigned
      };

      Admit.findById.mockResolvedValue(mockPatient);

      const response = await request(app)
        .put('/api/rooms/release-by-patient/patient123')
        .expect(200);

      expect(response.body.message).toContain('no room assigned');
    });
  });

  describe('POST /api/rooms/initialize', () => {
    it('should initialize sample rooms', async () => {
      const sampleRooms = [
        { roomId: 'W-101', type: 'ward', status: 'available' },
        { roomId: 'P-201', type: 'private', status: 'available' }
      ];

      Room.deleteMany.mockResolvedValue({});
      Room.insertMany.mockResolvedValue(sampleRooms);

      const response = await request(app)
        .post('/api/rooms/initialize')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Room.deleteMany).toHaveBeenCalledWith({});
      expect(Room.insertMany).toHaveBeenCalledWith(expect.any(Array));
    });
  });
});