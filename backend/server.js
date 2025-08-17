
const express = require('express');
const http = require('http'); 
const { Server } = require('socket.io'); 
const dotenv = require('dotenv');
const cors = require('cors');
const fileupload = require('express-fileupload');

const { connectToDb } = require('./config/db');
const { cloudinaryConnect } = require('./config/cloudinary');

const ticketRoutesPlatform1 = require('./routes/ticketRoutesPlatform1');
const ticketRoutesPlatform2 = require('./routes/ticketRoutesPlatform2');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000; 

connectToDb();
cloudinaryConnect();

app.use(express.json());
app.use(cors({
  // origin: ['http://localhost:3002', 'http://localhost:3001'], 
  origin: "*",
  credentials: true,
}));
app.use(fileupload({
  useTempFiles: true,
  tempFileDir: '/tmp/',
}));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    // origin: ['http://localhost:3002', 'http://localhost:3001'],
  },
});

app.use('/api/v1', ticketRoutesPlatform1(io));
app.use('/api/tickets', ticketRoutesPlatform2(io));

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Unified API is running...',
  });
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));