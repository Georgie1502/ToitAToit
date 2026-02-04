const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const messagesController = require("../controllers/messagesController");

router.use(authMiddleware);

router.get("/", messagesController.list);
router.post("/", messagesController.send);
router.get("/:id", messagesController.getById);

module.exports = router;

