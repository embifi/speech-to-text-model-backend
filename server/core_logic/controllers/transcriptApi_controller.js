const transcript = require("../models/transcript");
const {Storage} = require('@google-cloud/storage')
const speech = require("@google-cloud/speech");
const fs = require('fs');
const { convert } = require('sox-audio'); 
const keyFileName = require("../../key.json");
const multer = require('multer');
const client = new speech.SpeechClient({ credentials: keyFileName });
const ffmpeg = require('fluent-ffmpeg');
const { log } = require("console"); 
const ffprobePath = require('ffprobe-static').path;

const storage = new Storage({
  keyFileName,
  projectID:'aadhaar-card-parsing',
});

// const upload = multer({storage:multer.memoryStorage()});
// exports.uploadAudio = upload.single('file');
//app.post('/your-api-endpoint', uploadAudio, fetchDataFromTranscriptApi);

exports.fetchDataFromTranscriptApi = async (req, res) => {
try {

const { name, description,base} = req.body;

 const fileBuffer = Buffer.from(base, "base64");

 if(!base){
  return res.status(400).json({error :"File data misssing"});
 }

const bucketName = 'speech_to_text_api123'; // Replace with your bucket name
const fileName = `uploaded-audio-${Date.now()}.wav`; // Generate a unique file name or use the original file name


await storage.bucket(bucketName).file(fileName).save(fileBuffer, {
  metadata: {
    contentType: 'audio/wav', // Adjust the content type as needed
  },
});


const audioUri=`gs://${bucketName}/${fileName}`;

  const audio = {
    uri: audioUri,
  };

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
    // languageCode: "hi-IN",  
    languageCode: "en-in",  
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


    const saveData = await transcript.create({
      name,
      description,
      transcript: transcription,
    });

    res.json(saveData);

  } catch (error) {
    console.error("Error saving the transcripted Data:", error);
    throw error;
  }
};



