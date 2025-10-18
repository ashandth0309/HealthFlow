const request = require("supertest");
const express = require("express");

// Mock the controller module before requiring the router
jest.mock("../../Controllers/LabController", () => ({
  getAllLabOrders: jest.fn((req, res) => res.json([{ id: "mock-order-1" }])),
  addLabOrder: jest.fn((req, res) => res.status(201).json({ id: "mock-order-created" })),
  getLabOrderById: jest.fn((req, res) => res.json({ id: req.params.id })),
  updateLabResults: jest.fn((req, res) => res.json({ updated: true })),
  deleteLabOrder: jest.fn((req, res) => res.status(204).end()),

  getAllLabResults: jest.fn((req, res) => res.json([])),
  addLabResult: jest.fn((req, res) => res.status(201).json({ id: "mock-result" })),
  getLabResultById: jest.fn((req, res) => res.json({ id: req.params.id })),
  updateLabResult: jest.fn((req, res) => res.json({ updated: true })),

  getAllAdverseReactions: jest.fn((req, res) => res.json([])),
  addAdverseReaction: jest.fn((req, res) => res.status(201).json({ id: "mock-adverse" })),
  getAdverseReactionById: jest.fn((req, res) => res.json({ id: req.params.id })),
  updateAdverseReaction: jest.fn((req, res) => res.json({ updated: true })),
  deleteAdverseReaction: jest.fn((req, res) => res.status(204).end()),

  getAllBillingRecords: jest.fn((req, res) => res.json([])),
  addBillingRecord: jest.fn((req, res) => res.status(201).json({ id: "mock-bill" })),
  getBillingRecordById: jest.fn((req, res) => res.json({ id: req.params.id })),
  updateBillingRecord: jest.fn((req, res) => res.json({ updated: true })),
}));

const LabRoutes = require("../LabRoutes"); // will use the mocked controller

describe("LabRoutes", () => {
  let app;
  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use("/lab", LabRoutes);
  });

  test("GET /lab/orders calls getAllLabOrders", async () => {
    const res = await request(app).get("/lab/orders").expect(200);
    const { getAllLabOrders } = require("../../Controllers/LabController");
    expect(getAllLabOrders).toHaveBeenCalled();
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("POST /lab/orders calls addLabOrder", async () => {
    const payload = { patientId: "p1", tests: ["cbc"] };
    const res = await request(app).post("/lab/orders").send(payload).expect(201);
    const { addLabOrder } = require("../../Controllers/LabController");
    expect(addLabOrder).toHaveBeenCalled();
    expect(res.body).toHaveProperty("id", "mock-order-created");
  });
});