const transcriptSchema = require("../models/transcript");
const { Storage } = require("@google-cloud/storage");
const speech = require("@google-cloud/speech");
const fs = require("fs");
const { convert } = require("sox-audio");
const keyFileName = require("../../key.json");
const multer = require("multer");
const client = new speech.SpeechClient({ credentials: keyFileName });
const ffmpeg = require("fluent-ffmpeg");
const { log } = require("console");
const ffprobePath = require("ffprobe-static").path;
const axios = require("axios");
const lambda = require("./transcript_api_lambda");
const { speechToText } = require("./transcript_api_lambda");
const speech_to_text = new speechToText();

const storage = new Storage({
  keyFileName,
  projectID: "aadhaar-card-parsing",
});

// const upload = multer({storage:multer.memoryStorage()});
// exports.uploadAudio = upload.single('file');
//app.post('/your-api-endpoint', uploadAudio, fetchDataFromTranscriptApi);

exports.fetchDataFromTranscriptApi = async (req, res) => {
  try {
    const { name, description, base, transcriptType } = req.body;
    console.log(name, transcriptType);

    if (!base) {
      return res.status(400).json({ error: "File data misssing" });
    }
    const fileBuffer = Buffer.from(base, "base64");

    const bucketName = "speech_to_text_api123"; // Replace with your bucket name
    const fileName = `uploaded-audio-${Date.now()}.wav`; // Generate a unique file name or use the original file name

    await storage
      .bucket(bucketName)
      .file(fileName)
      .save(fileBuffer, {
        metadata: {
          contentType: "audio/wav", // Adjust the content type as needed
        },
      });

    const audioUri = `gs://${bucketName}/${fileName}`;

    const audio = {
      uri: audioUri,
    };

    console.log(audioUri);

    const config = {
      //working only for WAV files
      model: "default",
      encoding: "LINEAR16",
      sampleRateHertz: 48000,
      useEnhanced: true,
      // model: 'phone_call',
      //enableSpeakerDiarization: true,
      audioChannelCount: 2,
      enableWordTimeOffsets: true,
      // languageCode: ["hi-IN"/"en-in"],
      languageCode: "en-in",
      //languageCode: "hi-IN",
    };

    const request = {
      audio: audio,
      config: config,
    };

    const [operation] = await client.longRunningRecognize(request);

    const [response] = await operation.promise();
    const transcription = response.results
      .map((result) => result.alternatives[0].transcript)
      .join("\n");
    console.log(transcription);

    const awsLambdaResponse = await speech_to_text.run({
      audioBase: base,
      transcriptType,
      audioUri: audioUri,
    });
    console.log(awsLambdaResponse);
    const { data } = awsLambdaResponse;
    try {
      await transcriptSchema.create({
        name,
        description,
        transcriptByGoogle_V1: transcription,
        transcriptByGoogle_V2:data.body.Transcript,
        transcriptByChirp: data.body1.ChirpTranscript,
        transcriptByWhisper: data.body2.whisperTranscript,
      });

      return res.json({
        name,
        description,
        transcriptByGoogle_V1: transcription,
        transcriptByGoogle_V2:data.body.Transcript,
        transcriptByChirp: data.body1.ChirpTranscript,
        transcriptByWhisper: data.body2.whisperTranscript,
      });
    } catch (err)
     {
      
      throw err
    }
  } catch (error) {
    console.error("Error saving the transcripted Data:", error);
    throw error;
  }
};
