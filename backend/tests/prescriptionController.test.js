const request = require('supertest');
const express = require('express');
const {
  getAllPrescriptions,
  getPrescriptionsByDoctor,
  getPrescriptionById,
  createPrescription,
  updatePrescription,
  deletePrescription,
  seedDummyData,
  sendEmail
} = require('../Controllers/prescriptionController'); // Go up one level, then into Controllers

// Mock the Prescription model
jest.mock('../Model/prescription', () => {
  const mockPrescription = {
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    insertMany: jest.fn()
  };
  
  function MockPrescription(data) {
    this.data = data;
    this.save = jest.fn().mockResolvedValue(this);
  }
  
  MockPrescription.find = mockPrescription.find;
  MockPrescription.findById = mockPrescription.findById;
  MockPrescription.findByIdAndUpdate = mockPrescription.findByIdAndUpdate;
  MockPrescription.findByIdAndDelete = mockPrescription.findByIdAndDelete;
  MockPrescription.insertMany = mockPrescription.insertMany;
  
  return MockPrescription;
});

const Prescription = require('../Model/prescription');

describe('Prescription Controller', () => {
  let app;
  let mockPrescriptions;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    
    // Setup routes
    app.get('/prescription', getAllPrescriptions);
    app.get('/prescription/doctor/:doctorId', getPrescriptionsByDoctor);
    app.get('/prescription/:id', getPrescriptionById);
    app.post('/prescription', createPrescription);
    app.put('/prescription/:id', updatePrescription);
    app.delete('/prescription/:id', deletePrescription);
    app.post('/prescription/seed', seedDummyData);
    app.post('/email/send', sendEmail);
  });

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockPrescriptions = [
      {
        _id: '64d8a5b7f1a2c3e4f5g6h7i8',
        firstName: 'John',
        lastName: 'Doe',
        age: 45,
        dob: new Date('1978-05-15'),
        gender: 'Male',
        email: 'doctor@hospital.com',
        patientEmail: 'john.doe@example.com',
        rx: 'Take medication as prescribed. Follow up in 2 weeks.',
        date: new Date(),
        medications: [
          {
            medication: 'Lisinopril',
            dosage: '10mg',
            frequency: 'Once Daily',
            duration: '30 Days',
            notes: 'For blood pressure'
          }
        ],
        doctorId: 'doc-123',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: '64d8a5b7f1a2c3e4f5g6h7i9',
        firstName: 'Jane',
        lastName: 'Smith',
        age: 32,
        dob: new Date('1991-08-22'),
        gender: 'Female',
        email: 'doctor@hospital.com',
        patientEmail: 'jane.smith@example.com',
        rx: 'Complete the full course of antibiotics.',
        date: new Date(),
        medications: [
          {
            medication: 'Amoxicillin',
            dosage: '500mg',
            frequency: 'Three times daily',
            duration: '7 Days',
            notes: 'Take with food'
          }
        ],
        doctorId: 'doc-123',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  });

  describe('GET /prescription', () => {
    it('should return all prescriptions', async () => {
      const mockQuery = {
        sort: jest.fn().mockResolvedValue(mockPrescriptions)
      };
      Prescription.find.mockReturnValue(mockQuery);

      const response = await request(app)
        .get('/prescription')
        .expect(200);

      expect(response.body).toEqual(mockPrescriptions);
      expect(Prescription.find).toHaveBeenCalled();
    });

    it('should handle errors when fetching prescriptions', async () => {
      Prescription.find.mockReturnValue({
        sort: jest.fn().mockRejectedValue(new Error('Database error'))
      });

      const response = await request(app)
        .get('/prescription')
        .expect(500);

      expect(response.body).toHaveProperty('message', 'Database error');
    });
  });

  describe('GET /prescription/doctor/:doctorId', () => {
    it('should return prescriptions by doctor ID', async () => {
      const mockQuery = {
        sort: jest.fn().mockResolvedValue([mockPrescriptions[0]])
      };
      Prescription.find.mockReturnValue(mockQuery);

      const response = await request(app)
        .get('/prescription/doctor/doc-123')
        .expect(200);

      expect(response.body).toEqual([mockPrescriptions[0]]);
      expect(Prescription.find).toHaveBeenCalledWith({ doctorId: 'doc-123' });
    });

    it('should handle errors when fetching prescriptions by doctor', async () => {
      Prescription.find.mockReturnValue({
        sort: jest.fn().mockRejectedValue(new Error('Database error'))
      });

      const response = await request(app)
        .get('/prescription/doctor/doc-123')
        .expect(500);

      expect(response.body).toHaveProperty('message', 'Database error');
    });
  });

  describe('GET /prescription/:id', () => {
    it('should return a prescription by ID', async () => {
      Prescription.findById.mockResolvedValue(mockPrescriptions[0]);

      const response = await request(app)
        .get('/prescription/64d8a5b7f1a2c3e4f5g6h7i8')
        .expect(200);

      expect(response.body).toEqual(mockPrescriptions[0]);
      expect(Prescription.findById).toHaveBeenCalledWith('64d8a5b7f1a2c3e4f5g6h7i8');
    });

    it('should return 404 when prescription not found', async () => {
      Prescription.findById.mockResolvedValue(null);

      const response = await request(app)
        .get('/prescription/nonexistent-id')
        .expect(404);

      expect(response.body).toHaveProperty('message', 'Prescription not found');
    });

    it('should handle errors when fetching prescription by ID', async () => {
      Prescription.findById.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/prescription/64d8a5b7f1a2c3e4f5g6h7i8')
        .expect(500);

      expect(response.body).toHaveProperty('message', 'Database error');
    });
  });

  describe('POST /prescription', () => {
    it('should create a new prescription', async () => {
      const newPrescriptionData = {
        firstName: 'Bob',
        lastName: 'Johnson',
        age: 50,
        dob: '1973-03-20',
        gender: 'Male',
        email: 'doctor@hospital.com',
        patientEmail: 'bob.johnson@example.com',
        rx: 'Take with meals twice daily',
        date: '2024-01-15',
        medications: [
          {
            medication: 'Metformin',
            dosage: '500mg',
            frequency: 'Twice daily',
            duration: '90 Days',
            notes: 'For diabetes management'
          }
        ],
        doctorId: 'doc-456'
      };

      const mockSavedPrescription = {
        ...newPrescriptionData,
        _id: '64d8a5b7f1a2c3e4f5g6h7j0',
        date: new Date('2024-01-15'),
        dob: new Date('1973-03-20'),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Mock the save method
      const mockSave = jest.fn().mockResolvedValue(mockSavedPrescription);
      Prescription.mockImplementation(function(data) {
        this.data = data;
        this.save = mockSave;
        return this;
      });

      const response = await request(app)
        .post('/prescription')
        .send(newPrescriptionData)
        .expect(201);

      expect(mockSave).toHaveBeenCalled();
      expect(response.body).toEqual(mockSavedPrescription);
    });

    it('should handle validation errors when creating prescription', async () => {
      const invalidPrescriptionData = {
        // Missing required fields
        firstName: 'Bob'
      };

      Prescription.mockImplementation(function(data) {
        this.data = data;
        this.save = jest.fn().mockRejectedValue(new Error('Validation failed'));
        return this;
      });

      const response = await request(app)
        .post('/prescription')
        .send(invalidPrescriptionData)
        .expect(400);

      expect(response.body).toHaveProperty('message', 'Validation failed');
    });
  });

  describe('PUT /prescription/:id', () => {
    it('should update an existing prescription', async () => {
      const updateData = {
        rx: 'Updated prescription instructions',
        medications: [
          {
            medication: 'Updated Medication',
            dosage: '100mg',
            frequency: 'Once daily',
            duration: '30 Days',
            notes: 'Updated notes'
          }
        ]
      };

      const updatedPrescription = {
        ...mockPrescriptions[0],
        ...updateData,
        updatedAt: new Date()
      };

      Prescription.findByIdAndUpdate.mockResolvedValue(updatedPrescription);

      const response = await request(app)
        .put('/prescription/64d8a5b7f1a2c3e4f5g6h7i8')
        .send(updateData)
        .expect(200);

      expect(Prescription.findByIdAndUpdate).toHaveBeenCalledWith(
        '64d8a5b7f1a2c3e4f5g6h7i8',
        { ...updateData, updatedAt: expect.any(Number) },
        { new: true }
      );
      expect(response.body).toEqual(updatedPrescription);
    });

    it('should return 404 when updating non-existent prescription', async () => {
      Prescription.findByIdAndUpdate.mockResolvedValue(null);

      const response = await request(app)
        .put('/prescription/nonexistent-id')
        .send({ rx: 'Updated' })
        .expect(404);

      expect(response.body).toHaveProperty('message', 'Prescription not found');
    });

    it('should handle errors when updating prescription', async () => {
      Prescription.findByIdAndUpdate.mockRejectedValue(new Error('Update failed'));

      const response = await request(app)
        .put('/prescription/64d8a5b7f1a2c3e4f5g6h7i8')
        .send({ rx: 'Updated' })
        .expect(400);

      expect(response.body).toHaveProperty('message', 'Update failed');
    });
  });

  describe('DELETE /prescription/:id', () => {
    it('should delete a prescription', async () => {
      Prescription.findByIdAndDelete.mockResolvedValue(mockPrescriptions[0]);

      const response = await request(app)
        .delete('/prescription/64d8a5b7f1a2c3e4f5g6h7i8')
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Prescription deleted successfully');
      expect(Prescription.findByIdAndDelete).toHaveBeenCalledWith('64d8a5b7f1a2c3e4f5g6h7i8');
    });

    it('should return 404 when deleting non-existent prescription', async () => {
      Prescription.findByIdAndDelete.mockResolvedValue(null);

      const response = await request(app)
        .delete('/prescription/nonexistent-id')
        .expect(404);

      expect(response.body).toHaveProperty('message', 'Prescription not found');
    });

    it('should handle errors when deleting prescription', async () => {
      Prescription.findByIdAndDelete.mockRejectedValue(new Error('Delete failed'));

      const response = await request(app)
        .delete('/prescription/64d8a5b7f1a2c3e4f5g6h7i8')
        .expect(500);

      expect(response.body).toHaveProperty('message', 'Delete failed');
    });
  });

  describe('POST /prescription/seed', () => {
    it('should seed dummy data successfully', async () => {
      Prescription.insertMany.mockResolvedValue(mockPrescriptions);

      const response = await request(app)
        .post('/prescription/seed')
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Dummy data added successfully');
      expect(Prescription.insertMany).toHaveBeenCalled();
    });

    it('should handle errors when seeding data', async () => {
      Prescription.insertMany.mockRejectedValue(new Error('Insert failed'));

      const response = await request(app)
        .post('/prescription/seed')
        .expect(500);

      expect(response.body).toHaveProperty('message', 'Insert failed');
    });
  });

  describe('POST /email/send', () => {
    it('should send email successfully', async () => {
      const emailData = {
        email: 'patient@example.com',
        rx: 'Take medication as prescribed'
      };

      const response = await request(app)
        .post('/email/send')
        .send(emailData)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Email sent successfully');
    });
  });
});