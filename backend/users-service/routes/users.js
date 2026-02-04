const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const userController = require("../controllers/userController");

router.get("/profile", authMiddleware, userController.getMyProfile);
router.put("/profile", authMiddleware, userController.upsertMyProfile);
router.post("/batch", authMiddleware, userController.batchUsers);

router.get("/", authMiddleware, userController.listUsers);
router.get("/:id", authMiddleware, userController.getUserById);
router.put("/:id", authMiddleware, userController.updateUser);
router.delete("/:id", authMiddleware, userController.deleteUser);

module.exports = router;

