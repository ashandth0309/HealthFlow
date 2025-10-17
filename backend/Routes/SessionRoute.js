const express = require("express");
const router = express.Router();
const SessionController = require("../Controllers/SessionController");

router.get("/", SessionController.getAllDetails);
router.post("/", SessionController.addData);
router.get("/:id", SessionController.getById);
router.put("/:id", SessionController.updateData);
router.delete("/:id", SessionController.deleteData);
router.post("/check-session", SessionController.checkSessionExists);

//export
module.exports = router;
