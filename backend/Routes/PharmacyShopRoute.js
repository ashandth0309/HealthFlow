const express = require("express");
const router = express.Router();
const PharmacyShopController = require("../Controllers/PharmacyShopControllers");

router.get("/", PharmacyShopController.getAllDetails);
router.post("/", PharmacyShopController.addData);
router.get("/:id", PharmacyShopController.getById);
router.put("/:id", PharmacyShopController.updateData);
router.delete("/:id", PharmacyShopController.deleteData);

//export
module.exports = router;
