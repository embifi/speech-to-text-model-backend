require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const routes = require('./core_logic/routers/router');
const bodyParser = require('body-parser');
const path = require('path');
// const http = requir('http'); 
// const SocketIO =require('socket.io');

 
const cors = require('cors'); // Import the cors package
// app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '200mb' }));
// MongoDB connection
mongoose
.connect(process.env.MONGO_URL)
.then((e)=> console.log("MoongoDB Connected"));
// mongoose.connect('mongodb://localhost/Googlle-Api-Database', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }); 

const db = mongoose.connection;

// Check for database connection errors
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  // console.log('Connected to MongoDB');
});
// app.use(express.static(path.join(__dirname, 'server.js')));
// app.get('*' , function(req,res){
//   res.sendFile(path.join(__dirname, "server.js"));
// });

app.use(cors({
  origin:'*' 
}));
app.use(express.json({  
  limit:'200mb'
}));
routes.use(express.urlencoded({extended:false}));
app.use(express.urlencoded({extended:false}));

routes.use(express.json());

app.use('/api', routes);
// const server = http.createServer(app);
// const io = SocketIO(server);
 
// Start the server
const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
  // console.log(`Server is running on port ${PORT}`);
});
