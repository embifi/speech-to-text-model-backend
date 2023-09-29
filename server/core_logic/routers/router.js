const express = require("express");
const router = express.Router();
const { Storage } = require("@google-cloud/storage");

const keyFileName = require("../../key.json");
const multer = require("multer");
const transcriptApiController = require("../controllers/transcriptApi_controller");

router.use(express.json());


 router.post('/transcript',transcriptApiController.fetchDataFromTranscriptApi); 
// router.post('/https://4ndwqi8x1m.execute-api.ap-south-1.amazonaws.com//default/googleSpeechToTextApi',transcriptApiController.fetchDataFromLambda);

module.exports = router;
