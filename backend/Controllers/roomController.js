const Room = require('../Model/Room');
const Admit = require('../Model/Admit');

// Single Responsibility Principle - Each class/function has one responsibility

// Room Repository - handles all data operations
class RoomRepository {
  async findAll() {
    return await Room.find().populate('patientId');
  }

  async findByType(type) {
    return await Room.find({ type }).populate('patientId');
  }

  async findByRoomId(roomId) {
    return await Room.findOne({ roomId });
  }

  async create(roomData) {
    const room = new Room(roomData);
    return await room.save();
  }

  async update(roomId, updateData) {
    return await Room.findOneAndUpdate(
      { roomId },
      updateData,
      { new: true, runValidators: true }
    );
  }

  async deleteAll() {
    return await Room.deleteMany({});
  }

  async insertMany(rooms) {
    return await Room.insertMany(rooms);
  }
}

// Patient Repository - handles patient data operations
class PatientRepository {
  async findById(patientId) {
    return await Admit.findById(patientId);
  }

  async update(patientId, updateData) {
    return await Admit.findByIdAndUpdate(patientId, updateData);
  }
}

// Open/Closed Principle - Open for extension, closed for modification

// Room Service - Business logic that can be extended without modifying existing code
class RoomService {
  constructor(roomRepository, patientRepository) {
    this.roomRepository = roomRepository;
    this.patientRepository = patientRepository;
  }

  async getAllRooms() {
    return await this.roomRepository.findAll();
  }

  async getRoomsByType(type) {
    return await this.roomRepository.findByType(type);
  }

  async createRoom(roomData) {
    return await this.roomRepository.create(roomData);
  }

  async updateRoomStatus(roomId, status, patientId) {
    return await this.roomRepository.update(roomId, { status, patientId });
  }

  async assignRoomToPatient(roomId, patientId) {
    const room = await this.roomRepository.findByRoomId(roomId);
    if (!room) throw new Error('Room not found');
    if (room.status !== 'available') throw new Error('Room is not available');

    const patient = await this.patientRepository.findById(patientId);
    if (!patient) throw new Error('Patient not found');

    // Update room
    await this.roomRepository.update(roomId, {
      status: 'occupied',
      patientId
    });

    // Update patient
    await this.patientRepository.update(patientId, {
      roomId,
      status: 'Admitted'
    });

    return { room, patient };
  }

  async releaseRoomByPatientId(patientId) {
    const patient = await this.patientRepository.findById(patientId);
    if (!patient) throw new Error('Patient not found');

    if (!patient.roomId) {
      return { message: 'Patient has no room assigned' };
    }

    const room = await this.roomRepository.findByRoomId(patient.roomId);
    if (!room) throw new Error('Room not found');

    await this.roomRepository.update(patient.roomId, {
      status: 'available',
      patientId: null
    });

    return { room };
  }

  async releaseRoomByRoomId(roomId) {
    const room = await this.roomRepository.findByRoomId(roomId);
    if (!room) throw new Error('Room not found');

    if (room.patientId) {
      await this.patientRepository.update(room.patientId, {
        roomId: '',
        status: 'Discharged'
      });
    }

    await this.roomRepository.update(roomId, {
      status: 'available',
      patientId: null
    });

    return { room };
  }

  async initializeSampleRooms() {
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

    await this.roomRepository.deleteAll();
    await this.roomRepository.insertMany(sampleRooms);

    return sampleRooms;
  }
}

// Liskov Substitution Principle - Subtypes should be substitutable for their base types

// Response Handler - Consistent response format
class ResponseHandler {
  static success(data, message = '') {
    return { success: true, ...data, message };
  }

  static error(message, statusCode = 500) {
    return { success: false, error: message };
  }
}

// Interface Segregation Principle - Client-specific interfaces

// Room Controller Interface
class RoomController {
  constructor(roomService) {
    this.roomService = roomService;
  }

  async getAllRooms(req, res) {
    try {
      const rooms = await this.roomService.getAllRooms();
      res.json(ResponseHandler.success({ rooms }));
    } catch (error) {
      res.status(500).json(ResponseHandler.error(error.message));
    }
  }

  async getRoomsByType(req, res) {
    try {
      const rooms = await this.roomService.getRoomsByType(req.params.type);
      res.json(ResponseHandler.success({ rooms }));
    } catch (error) {
      res.status(500).json(ResponseHandler.error(error.message));
    }
  }

  async createRoom(req, res) {
    try {
      const room = await this.roomService.createRoom(req.body);
      res.status(201).json(ResponseHandler.success({ room }));
    } catch (error) {
      res.status(400).json(ResponseHandler.error(error.message));
    }
  }

  async updateRoom(req, res) {
    try {
      const { roomId } = req.params;
      const { status, patientId } = req.body;

      const room = await this.roomService.updateRoomStatus(roomId, status, patientId);
      if (!room) {
        return res.status(404).json(ResponseHandler.error('Room not found'));
      }

      res.json(ResponseHandler.success({ room }));
    } catch (error) {
      res.status(400).json(ResponseHandler.error(error.message));
    }
  }

  async assignRoom(req, res) {
    try {
      const { roomId, patientId } = req.body;
      const { room, patient } = await this.roomService.assignRoomToPatient(roomId, patientId);

      res.json(ResponseHandler.success(
        { room, patient },
        `Room ${roomId} assigned to ${patient.fullname} successfully`
      ));
    } catch (error) {
      res.status(400).json(ResponseHandler.error(error.message));
    }
  }

  async initializeRooms(req, res) {
    try {
      const rooms = await this.roomService.initializeSampleRooms();
      res.json(ResponseHandler.success(
        { rooms },
        'Sample rooms initialized successfully'
      ));
    } catch (error) {
      res.status(500).json(ResponseHandler.error(error.message));
    }
  }

  async releaseRoomByPatient(req, res) {
    try {
      const { patientId } = req.params;
      const result = await this.roomService.releaseRoomByPatientId(patientId);

      if (result.message) {
        res.json(ResponseHandler.success({}, result.message));
      } else {
        res.json(ResponseHandler.success(
          { room: result.room },
          `Room ${result.room.roomId} released successfully`
        ));
      }
    } catch (error) {
      res.status(400).json(ResponseHandler.error(error.message));
    }
  }

  async releaseRoom(req, res) {
    try {
      const { roomId } = req.params;
      const { room } = await this.roomService.releaseRoomByRoomId(roomId);

      res.json(ResponseHandler.success(
        { room },
        `Room ${roomId} released successfully`
      ));
    } catch (error) {
      res.status(400).json(ResponseHandler.error(error.message));
    }
  }
}

// Dependency Inversion Principle - Depend on abstractions, not concretions

// Dependency Injection Setup
const roomRepository = new RoomRepository();
const patientRepository = new PatientRepository();
const roomService = new RoomService(roomRepository, patientRepository);
const roomController = new RoomController(roomService);

// Export the controller instance
module.exports = {
  getAllRooms: (req, res) => roomController.getAllRooms(req, res),
  getRoomsByType: (req, res) => roomController.getRoomsByType(req, res),
  createRoom: (req, res) => roomController.createRoom(req, res),
  updateRoom: (req, res) => roomController.updateRoom(req, res),
  assignRoom: (req, res) => roomController.assignRoom(req, res),
  initializeRooms: (req, res) => roomController.initializeRooms(req, res),
  releaseRoomByPatient: (req, res) => roomController.releaseRoomByPatient(req, res),
  releaseRoom: (req, res) => roomController.releaseRoom(req, res)
};