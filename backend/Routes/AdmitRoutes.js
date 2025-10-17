const express = require('express');
const router = express.Router();
const AdmitController = require('../Controllers/AdmitController');
const upload = AdmitController.upload.single('prescription');
// Define routes
router.get('/admitCount', AdmitController.admitCount);
router.get('/', AdmitController.getAllAdmitDetails);
router.post('/', upload, AdmitController.addData);
router.get('/:id', AdmitController.getById);
router.put('/:id', upload, AdmitController.updateAdmitData);
router.delete('/:id', AdmitController.deleteAdmitData);
router.get('/byNIC/:nic', AdmitController.getByNIC);
router.get('/byAdmitID/:admitID', AdmitController.getByAdmitID);


module.exports = router;
