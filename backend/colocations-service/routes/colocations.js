const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const colocationsController = require("../controllers/colocationsController");
const favoritesController = require("../controllers/favoritesController");
const applicationsController = require("../controllers/applicationsController");
const matchesController = require("../controllers/matchesController");

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

router.post("/", authMiddleware, colocationsController.createListing);
router.put("/:id", authMiddleware, colocationsController.updateListing);
router.delete("/:id", authMiddleware, colocationsController.deleteListing);

module.exports = router;
