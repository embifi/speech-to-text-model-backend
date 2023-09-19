const express = require("express");
const router = express.Router();
const { Storage } = require("@google-cloud/storage");

const keyFileName = require("../../key.json");
const multer = require("multer");
const transcriptApiController = require("../controllers/transcriptApi_controller");

router.use(express.json());


 router.post('/transcript',transcriptApiController.fetchDataFromTranscriptApi);

module.exports = router;
