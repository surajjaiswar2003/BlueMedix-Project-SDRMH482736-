const express = require("express");
const router = express.Router();
const mlController = require("../controllers/mlController");
const fileUpload = require("express-fileupload");

router.use(fileUpload()); // Middleware for handling file uploads

router.post("/upload_csv", mlController.uploadCsv);
router.post("/retrain", mlController.retrainModel);
router.get("/metrics", mlController.getLatestMetrics);

module.exports = router;
