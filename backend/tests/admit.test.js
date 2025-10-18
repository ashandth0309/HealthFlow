const request = require('supertest');
const express = require('express');
const admitRoutes = require('../Routes/AdmitRoutes');
const Admit = require('../Model/Admit');
const Room = require('../Model/Room');

// Mock the models
jest.mock('../Model/Admit');
jest.mock('../Model/Room');

const app = express();
app.use(express.json());
app.use('/api/admit', admitRoutes);

// Mock multer file upload
jest.mock('../controllers/admitController', () => {
  const originalModule = jest.requireActual('../controllers/admitController');
  return {
    ...originalModule,
    upload: {
      single: jest.fn(() => (req, res, next) => next())
    }
  };
});

describe('Admit Controller Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/admit', () => {
    it('should get all admit records', async () => {
      const mockAdmits = [
        { _id: '1', fullname: 'John Doe', status: 'Admitted' },
        { _id: '2', fullname: 'Jane Smith', status: 'Discharged' }
      ];

      Admit.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockAdmits)
      });

      const response = await request(app)
        .get('/api/admit')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.admit).toEqual(mockAdmits);
    });
  });

  describe('GET /api/admit/details', () => {
    it('should get all admit details', async () => {
      const mockAdmits = [
        { _id: '1', fullname: 'John Doe', nic: '123456789V' },
        { _id: '2', fullname: 'Jane Smith', nic: '987654321V' }
      ];

      Admit.find.mockResolvedValue(mockAdmits);

      const response = await request(app)
        .get('/api/admit/details')
        .expect(200);

      expect(response.body.admit).toEqual(mockAdmits);
    });
  });

  describe('POST /api/admit', () => {
    it('should create new admit record with appointment data', async () => {
      const newAdmit = {
        admitID: 'ADM001',
        fullname: 'John Doe',
        nic: '123456789V',
        phone: '0771234567',
        email: 'john@example.com',
        assignedDoctor: 'Dr. Smith'
      };

      Admit.prototype.save.mockResolvedValue(newAdmit);

      const response = await request(app)
        .post('/api/admit')
        .send(newAdmit)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.admit).toEqual(newAdmit);
    });

    it('should handle creation errors', async () => {
      Admit.prototype.save.mockRejectedValue(new Error('Validation failed'));

      const response = await request(app)
        .post('/api/admit')
        .send({ fullname: 'John Doe' }) // Incomplete data
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/admit/add', () => {
    it('should create admit record with file upload', async () => {
      const admitData = {
        hospital: 'General Hospital',
        date: '2024-01-15',
        fullname: 'John Doe',
        nic: '123456789V',
        phone: '0771234567',
        address: '123 Main St'
      };

      const mockAdmit = { ...admitData, _id: '123' };
      Admit.prototype.save.mockResolvedValue(mockAdmit);

      const response = await request(app)
        .post('/api/admit/add')
        .send(admitData)
        .expect(200);

      expect(response.body.admit).toEqual(mockAdmit);
    });
  });

  describe('GET /api/admit/patient/:email', () => {
    it('should get admit records by patient email', async () => {
      const mockAdmits = [
        { _id: '1', fullname: 'John Doe', email: 'john@example.com' },
        { _id: '2', fullname: 'John Doe', email: 'john@example.com' }
      ];

      Admit.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockAdmits)
      });

      const response = await request(app)
        .get('/api/admit/patient/john@example.com')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Admit.find).toHaveBeenCalledWith({ email: 'john@example.com' });
    });
  });

  describe('GET /api/admit/nic/:nic', () => {
    it('should get admit record by NIC', async () => {
      const mockAdmit = {
        _id: '1',
        fullname: 'John Doe',
        nic: '123456789V'
      };

      Admit.findOne.mockResolvedValue(mockAdmit);

      const response = await request(app)
        .get('/api/admit/nic/123456789V')
        .expect(200);

      expect(response.body.admit).toEqual(mockAdmit);
    });

    it('should return 404 for non-existent NIC', async () => {
      Admit.findOne.mockResolvedValue(null);

      const response = await request(app)
        .get('/api/admit/nic/nonexistent')
        .expect(404);

      expect(response.body.message).toContain('Data not found');
    });
  });

  describe('GET /api/admit/admitid/:admitID', () => {
    it('should get admit record by admit ID', async () => {
      const mockAdmit = {
        _id: '1',
        fullname: 'John Doe',
        admitID: 'ADM001'
      };

      Admit.findOne.mockResolvedValue(mockAdmit);

      const response = await request(app)
        .get('/api/admit/admitid/ADM001')
        .expect(200);

      expect(response.body.admit).toEqual(mockAdmit);
    });
  });

  describe('PUT /api/admit/:id/discharge', () => {
    it('should update discharge information', async () => {
      const mockAdmit = {
        _id: '123',
        fullname: 'John Doe',
        status: 'Discharge Planning'
      };

      const dischargeData = {
        dischargePlanning: 'Patient ready for discharge',
        dischargeSummary: 'Recovered well',
        dischargeInstructions: 'Follow up in 2 weeks'
      };

      Admit.findByIdAndUpdate.mockResolvedValue(mockAdmit);

      const response = await request(app)
        .put('/api/admit/123/discharge')
        .send(dischargeData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Admit.findByIdAndUpdate).toHaveBeenCalledWith(
        '123',
        { $set: expect.objectContaining({ status: 'Discharge Planning' }) },
        { new: true, runValidators: true }
      );
    });
  });

  describe('PUT /api/admit/:id/finalize-discharge', () => {
    it('should finalize discharge and release room', async () => {
      const mockAdmit = {
        _id: '123',
        fullname: 'John Doe',
        roomId: 'W-101'
      };

      const mockRoom = {
        roomId: 'W-101',
        status: 'occupied',
        patientId: '123',
        save: jest.fn().mockResolvedValue(true)
      };

      Admit.findById.mockResolvedValue(mockAdmit);
      Room.findOne.mockResolvedValue(mockRoom);
      Admit.findByIdAndUpdate.mockResolvedValue({
        ...mockAdmit,
        status: 'Discharged',
        dischargeDate: expect.any(Date)
      });

      const response = await request(app)
        .put('/api/admit/123/finalize-discharge')
        .send({ roomReleaseStatus: 'Released' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(mockRoom.status).toBe('available');
      expect(mockRoom.patientId).toBe(null);
    });

    it('should handle discharge without room assignment', async () => {
      const mockAdmit = {
        _id: '123',
        fullname: 'John Doe',
        roomId: null // No room assigned
      };

      Admit.findById.mockResolvedValue(mockAdmit);
      Admit.findByIdAndUpdate.mockResolvedValue(mockAdmit);

      const response = await request(app)
        .put('/api/admit/123/finalize-discharge')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Room.findOne).not.toHaveBeenCalled();
    });
  });

  describe('GET /api/admit/status/admitted', () => {
    it('should get admitted patients', async () => {
      const mockPatients = [
        { _id: '1', fullname: 'John Doe', status: 'Admitted' },
        { _id: '2', fullname: 'Jane Smith', status: 'Discharge Planning' }
      ];

      Admit.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockPatients)
      });

      const response = await request(app)
        .get('/api/admit/status/admitted')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Admit.find).toHaveBeenCalledWith({
        status: { $in: ['Admitted', 'Discharge Planning'] }
      });
    });
  });

  describe('DELETE /api/admit/:id', () => {
    it('should delete admit record and release room', async () => {
      const mockAdmit = {
        _id: '123',
        fullname: 'John Doe',
        roomId: 'W-101'
      };

      const mockRoom = {
        roomId: 'W-101',
        status: 'occupied',
        patientId: '123',
        save: jest.fn().mockResolvedValue(true)
      };

      Admit.findById.mockResolvedValue(mockAdmit);
      Room.findOne.mockResolvedValue(mockRoom);
      Admit.findByIdAndDelete.mockResolvedValue(mockAdmit);

      const response = await request(app)
        .delete('/api/admit/123')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(mockRoom.status).toBe('available');
      expect(mockRoom.patientId).toBe(null);
    });

    it('should handle delete without room assignment', async () => {
      const mockAdmit = {
        _id: '123',
        fullname: 'John Doe',
        roomId: null
      };

      Admit.findById.mockResolvedValue(mockAdmit);
      Admit.findByIdAndDelete.mockResolvedValue(mockAdmit);

      const response = await request(app)
        .delete('/api/admit/123')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Room.findOne).not.toHaveBeenCalled();
    });
  });

  describe('GET /api/admit/count/admit', () => {
    it('should count admits by hospital and date', async () => {
      Admit.countDocuments.mockResolvedValue(5);

      const response = await request(app)
        .get('/api/admit/count/admit?hospital=General&date=2024-01-15')
        .expect(200);

      expect(response.body.count).toBe(5);
      expect(Admit.countDocuments).toHaveBeenCalledWith({
        hospital: 'General',
        date: '2024-01-15'
      });
    });
  });
});