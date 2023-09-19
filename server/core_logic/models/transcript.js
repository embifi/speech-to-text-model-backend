const mongoose = require('mongoose');
 

const transcriptAPI = new mongoose.Schema({
   name:String,
   description:String,
   filename:String,
    transcript:String,
});

module.exports = mongoose.model('transcript', transcriptAPI);