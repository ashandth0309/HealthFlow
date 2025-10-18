const LabOrderModel = require("../Model/LabOrder");
const LabResultModel = require("../Model/LabResult");
const AdverseReactionModel = require("../Model/AdverseReaction");
const BillingRecordModel = require("../Model/BillingRecord");

// Lab Orders Functions
const getAllLabOrders = async (req, res) => {
  try {
    const labOrders = await LabOrderModel.find().populate('patientId doctorId');
    return res.status(200).json({ labOrders });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

const addLabOrder = async (req, res) => {
  try {
    const { patientId, doctorId, testName, orderDate, status, analyzer } = req.body;
    
    const newOrder = new LabOrderModel({
      patientId,
      doctorId,
      testName,
      orderDate,
      status: status || 'Pending',
      analyzer,
      progress: 0
    });
    
    await newOrder.save();
    return res.status(201).json({ labOrder: newOrder });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

const getLabOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const labOrder = await LabOrderModel.findById(id).populate('patientId doctorId');
    
    if (!labOrder) {
      return res.status(404).json({ message: "Lab order not found" });
    }
    
    return res.status(200).json({ labOrder });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

const updateLabResults = async (req, res) => {
  try {
    const { id } = req.params;
    const { results, status, criticalValues, progress } = req.body;
    
    const updatedOrder = await LabOrderModel.findByIdAndUpdate(
      id, 
      { 
        results, 
        status, 
        criticalValues,
        progress,
        completedDate: status === 'Completed' ? new Date() : undefined
      }, 
      { new: true }
    );
    
    if (!updatedOrder) {
      return res.status(404).json({ message: "Lab order not found" });
    }
    
    // Check for critical values and trigger alerts
    if (criticalValues && criticalValues.length > 0) {
      await triggerCriticalAlert(updatedOrder);
    }
    
    return res.status(200).json({ labOrder: updatedOrder });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

const deleteLabOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOrder = await LabOrderModel.findByIdAndDelete(id);
    
    if (!deletedOrder) {
      return res.status(404).json({ message: "Lab order not found" });
    }
    
    return res.status(200).json({ message: "Lab order deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

// Adverse Reactions Functions
const getAllAdverseReactions = async (req, res) => {
  try {
    const reactions = await AdverseReactionModel.find().populate('patientId');
    return res.status(200).json({ adverseReactions: reactions });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

const addAdverseReaction = async (req, res) => {
  try {
    const { 
      patientId, 
      patientName, 
      testName, 
      reactionType, 
      severity, 
      description, 
      reportedBy 
    } = req.body;
    
    const newReaction = new AdverseReactionModel({
      patientId,
      patientName,
      testName,
      reactionType,
      severity,
      description,
      reportedBy,
      dateReported: new Date(),
      status: 'Under Review'
    });
    
    await newReaction.save();
    return res.status(201).json({ adverseReaction: newReaction });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

const getAdverseReactionById = async (req, res) => {
  try {
    const { id } = req.params;
    const reaction = await AdverseReactionModel.findById(id).populate('patientId');
    
    if (!reaction) {
      return res.status(404).json({ message: "Adverse reaction not found" });
    }
    
    return res.status(200).json({ adverseReaction: reaction });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

const updateAdverseReaction = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const updatedReaction = await AdverseReactionModel.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true }
    );
    
    if (!updatedReaction) {
      return res.status(404).json({ message: "Adverse reaction not found" });
    }
    
    return res.status(200).json({ adverseReaction: updatedReaction });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

const deleteAdverseReaction = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedReaction = await AdverseReactionModel.findByIdAndDelete(id);
    
    if (!deletedReaction) {
      return res.status(404).json({ message: "Adverse reaction not found" });
    }
    
    return res.status(200).json({ message: "Adverse reaction deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

// Billing Functions
const getAllBillingRecords = async (req, res) => {
  try {
    const billingRecords = await BillingRecordModel.find().populate('patientId');
    return res.status(200).json({ billingRecords });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

const addBillingRecord = async (req, res) => {
  try {
    const { patientId, patientName, services, amount, status } = req.body;
    
    const newBilling = new BillingRecordModel({
      patientId,
      patientName,
      services,
      amount,
      status: status || 'Pending',
      date: new Date()
    });
    
    await newBilling.save();
    return res.status(201).json({ billingRecord: newBilling });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

const getBillingRecordById = async (req, res) => {
  try {
    const { id } = req.params;
    const billingRecord = await BillingRecordModel.findById(id).populate('patientId');
    
    if (!billingRecord) {
      return res.status(404).json({ message: "Billing record not found" });
    }
    
    return res.status(200).json({ billingRecord });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

const updateBillingRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const updatedBilling = await BillingRecordModel.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true }
    );
    
    if (!updatedBilling) {
      return res.status(404).json({ message: "Billing record not found" });
    }
    
    return res.status(200).json({ billingRecord: updatedBilling });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

// Helper function for critical alerts
const triggerCriticalAlert = async (labOrder) => {
  // Implementation for critical value alerts
  console.log(`Critical alert triggered for order ${labOrder._id}`);
  // You can add email notifications, database logging, etc.
};

// Lab Results Functions (additional)
const getAllLabResults = async (req, res) => {
  try {
    const labResults = await LabResultModel.find().populate('patientId orderId');
    return res.status(200).json({ labResults });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

const addLabResult = async (req, res) => {
  try {
    const { orderId, patientId, results, criticalValues } = req.body;
    
    const newResult = new LabResultModel({
      orderId,
      patientId,
      results,
      criticalValues,
      dateCompleted: new Date()
    });
    
    await newResult.save();
    return res.status(201).json({ labResult: newResult });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

const getLabResultById = async (req, res) => {
  try {
    const { id } = req.params;
    const labResult = await LabResultModel.findById(id).populate('patientId orderId');
    
    if (!labResult) {
      return res.status(404).json({ message: "Lab result not found" });
    }
    
    return res.status(200).json({ labResult });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

const updateLabResult = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const updatedResult = await LabResultModel.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true }
    );
    
    if (!updatedResult) {
      return res.status(404).json({ message: "Lab result not found" });
    }
    
    return res.status(200).json({ labResult: updatedResult });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  // Lab Orders
  getAllLabOrders,
  addLabOrder,
  getLabOrderById,
  updateLabResults,
  deleteLabOrder,
  
  // Lab Results  
  getAllLabResults,
  addLabResult,
  getLabResultById,
  updateLabResult,
  
  // Adverse Reactions
  getAllAdverseReactions,
  addAdverseReaction,
  getAdverseReactionById,
  updateAdverseReaction,
  deleteAdverseReaction,
  
  // Billing
  getAllBillingRecords,
  addBillingRecord,
  getBillingRecordById,
  updateBillingRecord,
  
  // Helper
  triggerCriticalAlert
};