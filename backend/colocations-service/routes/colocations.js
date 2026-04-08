const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const authMiddleware = require("../middleware/authMiddleware");
const colocationsController = require("../controllers/colocationsController");
const favoritesController = require("../controllers/favoritesController");
const applicationsController = require("../controllers/applicationsController");
const matchesController = require("../controllers/matchesController");

const uploadDir = path.join(__dirname, "..", "uploads");
fs.mkdirSync(uploadDir, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
      const safeExtension = path.extname(file.originalname || "").toLowerCase().replace(/[^.a-z0-9]/g, "");
      cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${safeExtension}`);
    },
  }),
  limits: { fileSize: 8 * 1024 * 1024, files: 10 },
});

router.get("/", colocationsController.listListings);
router.get("/search/location", colocationsController.searchByLocation);

// Favorites
router.get("/favorites", authMiddleware, favoritesController.listMyFavorites);
router.post("/:id/favorites", authMiddleware, favoritesController.addFavorite);
router.delete("/:id/favorites", authMiddleware, favoritesController.removeFavorite);

// Applications
router.get("/applications", authMiddleware, applicationsController.listMyApplications);
router.post("/:id/applications", authMiddleware, applicationsController.applyToListing);
router.get("/:id/applications", authMiddleware, applicationsController.listApplicationsForListing);
router.patch(
  "/applications/:applicationId",
  authMiddleware,
  applicationsController.updateApplicationStatus,
);

// Matches
router.get("/matches", authMiddleware, matchesController.listMyMatches);
router.get("/:id/matches", authMiddleware, matchesController.getMyMatchForListing);
router.post("/:id/matches", authMiddleware, matchesController.upsertMyMatchForListing);
router.delete("/:id/matches", authMiddleware, matchesController.deleteMyMatchForListing);

router.get("/:id", colocationsController.getListingById);

router.post("/", authMiddleware, upload.array("photos", 10), colocationsController.createListing);
router.put("/:id", authMiddleware, upload.array("photos", 10), colocationsController.updateListing);
router.delete("/:id", authMiddleware, colocationsController.deleteListing);

module.exports = router;
