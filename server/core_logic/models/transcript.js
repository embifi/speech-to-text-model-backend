const mongoose = require('mongoose');
 

const transcriptAPI = new mongoose.Schema({
   name:String,
   description:String,
   filename:String,
    transcriptByGoogle_V1:String,
    transcriptByGoogle_V2:String,
    transcriptByChirp:String,
    transcriptByWhisper:String,
});

module.exports = mongoose.model('transcript', transcriptAPI);