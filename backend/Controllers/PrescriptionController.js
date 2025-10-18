const Prescription = require('../Model/prescription');

// Single Responsibility Principle: Each class/function has one reason to change

// Repository Pattern for data access
class PrescriptionRepository {
  async findAll(sort = { createdAt: -1 }) {
    return await Prescription.find().sort(sort);
  }

  async findByDoctor(doctorId, sort = { createdAt: -1 }) {
    return await Prescription.find({ doctorId }).sort(sort);
  }

  async findById(id) {
    return await Prescription.findById(id);
  }

  async create(prescriptionData) {
    const prescription = new Prescription(prescriptionData);
    return await prescription.save();
  }

  async update(id, updateData) {
    return await Prescription.findByIdAndUpdate(id, updateData, { new: true });
  }

  async delete(id) {
    return await Prescription.findByIdAndDelete(id);
  }

  async insertMany(prescriptions) {
    return await Prescription.insertMany(prescriptions);
  }
}

// Service Layer for business logic
class PrescriptionService {
  constructor(repository) {
    this.repository = repository;
  }

  async getAllPrescriptions() {
    return await this.repository.findAll();
  }

  async getPrescriptionsByDoctor(doctorId) {
    return await this.repository.findByDoctor(doctorId);
  }

  async getPrescriptionById(id) {
    const prescription = await this.repository.findById(id);
    if (!prescription) {
      throw new Error('Prescription not found');
    }
    return prescription;
  }

  async createPrescription(prescriptionData) {
    const processedData = {
      ...prescriptionData,
      date: new Date(prescriptionData.date),
      dob: new Date(prescriptionData.dob)
    };
    return await this.repository.create(processedData);
  }

  async updatePrescription(id, updateData) {
    const updatedData = { ...updateData, updatedAt: Date.now() };
    const prescription = await this.repository.update(id, updatedData);
    if (!prescription) {
      throw new Error('Prescription not found');
    }
    return prescription;
  }

  async deletePrescription(id) {
    const prescription = await this.repository.delete(id);
    if (!prescription) {
      throw new Error('Prescription not found');
    }
    return prescription;
  }

  async seedDummyData(dummyPrescriptions) {
    return await this.repository.insertMany(dummyPrescriptions);
  }
}

// Open/Closed Principle: Email service can be extended without modifying existing code
class EmailService {
  async sendPrescription(email, prescriptionDetails) {
    // Base implementation - can be extended for different email providers
    console.log(`Sending email to: ${email}`);
    console.log(`Prescription details: ${prescriptionDetails}`);
    // Integration with email service would go here
    return { success: true, message: 'Email sent successfully' };
  }
}

// Liskov Substitution Principle: Different email services can be substituted
class SendGridEmailService extends EmailService {
  async sendPrescription(email, prescriptionDetails) {
    console.log(`Sending email via SendGrid to: ${email}`);
    // SendGrid specific implementation
    return { success: true, message: 'Email sent via SendGrid successfully' };
  }
}

class NodemailerEmailService extends EmailService {
  async sendPrescription(email, prescriptionDetails) {
    console.log(`Sending email via Nodemailer to: ${email}`);
    // Nodemailer specific implementation
    return { success: true, message: 'Email sent via Nodemailer successfully' };
  }
}

// Interface Segregation: Small, specific interfaces
class IPrescriptionController {
  async handleRequest(req, res) {}
}

class IEmailController {
  async handleEmailRequest(req, res) {}
}

// Dependency Inversion: Controllers depend on abstractions (services), not concretions
class PrescriptionController extends IPrescriptionController {
  constructor(prescriptionService) {
    super();
    this.prescriptionService = prescriptionService;
  }

  async getAllPrescriptions(req, res) {
    try {
      const prescriptions = await this.prescriptionService.getAllPrescriptions();
      res.json(prescriptions);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getPrescriptionsByDoctor(req, res) {
    try {
      const prescriptions = await this.prescriptionService.getPrescriptionsByDoctor(req.params.doctorId);
      res.json(prescriptions);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getPrescriptionById(req, res) {
    try {
      const prescription = await this.prescriptionService.getPrescriptionById(req.params.id);
      res.json(prescription);
    } catch (error) {
      if (error.message === 'Prescription not found') {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({ message: error.message });
      }
    }
  }

  async createPrescription(req, res) {
    try {
      const savedPrescription = await this.prescriptionService.createPrescription(req.body);
      res.status(201).json(savedPrescription);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async updatePrescription(req, res) {
    try {
      const updatedPrescription = await this.prescriptionService.updatePrescription(req.params.id, req.body);
      res.json(updatedPrescription);
    } catch (error) {
      if (error.message === 'Prescription not found') {
        res.status(404).json({ message: error.message });
      } else {
        res.status(400).json({ message: error.message });
      }
    }
  }

  async deletePrescription(req, res) {
    try {
      await this.prescriptionService.deletePrescription(req.params.id);
      res.json({ message: 'Prescription deleted successfully' });
    } catch (error) {
      if (error.message === 'Prescription not found') {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({ message: error.message });
      }
    }
  }

  async seedDummyData(req, res) {
    try {
      const dummyPrescriptions = [
        {
          firstName: "John",
          lastName: "Doe",
          age: 45,
          dob: new Date("1978-05-15"),
          gender: "Male",
          email: "doctor@hospital.com",
          patientEmail: "john.doe@example.com",
          rx: "Take medication as prescribed. Follow up in 2 weeks.",
          date: new Date(),
          medications: [
            {
              medication: "Lisinopril",
              dosage: "10mg",
              frequency: "Once Daily",
              duration: "30 Days",
              notes: "For blood pressure"
            }
          ],
          doctorId: "doc-123"
        },
        {
          firstName: "Jane",
          lastName: "Smith",
          age: 32,
          dob: new Date("1991-08-22"),
          gender: "Female",
          email: "doctor@hospital.com",
          patientEmail: "jane.smith@example.com",
          rx: "Complete the full course of antibiotics.",
          date: new Date(),
          medications: [
            {
              medication: "Amoxicillin",
              dosage: "500mg",
              frequency: "Three times daily",
              duration: "7 Days",
              notes: "Take with food"
            }
          ],
          doctorId: "doc-123"
        }
      ];

      await this.prescriptionService.seedDummyData(dummyPrescriptions);
      res.json({ message: "Dummy data added successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

class EmailController extends IEmailController {
  constructor(emailService) {
    super();
    this.emailService = emailService;
  }

  async sendEmail(req, res) {
    try {
      const { email, rx } = req.body;
      const result = await this.emailService.sendPrescription(email, rx);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

// Factory function to create instances (optional but demonstrates DI)
function createPrescriptionController() {
  const repository = new PrescriptionRepository();
  const service = new PrescriptionService(repository);
  return new PrescriptionController(service);
}

function createEmailController(emailServiceType = 'default') {
  let emailService;
  switch (emailServiceType) {
    case 'sendgrid':
      emailService = new SendGridEmailService();
      break;
    case 'nodemailer':
      emailService = new NodemailerEmailService();
      break;
    default:
      emailService = new EmailService();
  }
  return new EmailController(emailService);
}

// Create instances for export (maintaining original API)
const prescriptionRepository = new PrescriptionRepository();
const prescriptionService = new PrescriptionService(prescriptionRepository);
const prescriptionController = new PrescriptionController(prescriptionService);
const emailController = new EmailController(new EmailService());

// Export the same functions as original code
module.exports = {
  getAllPrescriptions: (req, res) => prescriptionController.getAllPrescriptions(req, res),
  getPrescriptionsByDoctor: (req, res) => prescriptionController.getPrescriptionsByDoctor(req, res),
  getPrescriptionById: (req, res) => prescriptionController.getPrescriptionById(req, res),
  createPrescription: (req, res) => prescriptionController.createPrescription(req, res),
  updatePrescription: (req, res) => prescriptionController.updatePrescription(req, res),
  deletePrescription: (req, res) => prescriptionController.deletePrescription(req, res),
  seedDummyData: (req, res) => prescriptionController.seedDummyData(req, res),
  sendEmail: (req, res) => emailController.sendEmail(req, res)
};