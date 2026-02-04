const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const preferencesController = require("../controllers/preferencesController");

router.get("/", authMiddleware, preferencesController.getMyPreferences);
router.post("/", authMiddleware, preferencesController.upsertMyPreferences);
router.delete("/", authMiddleware, preferencesController.deleteMyPreferences);

module.exports = router;

