const express = require('express');
const cors = require('cors');
const app = express();
const socket = require('socket.io');
const path = require('path');
const mongoose = require('mongoose');
const helmet = require('helmet');
const testimonialsRoutes = require('./routes/testimonials.routes');
const concertsRoutes = require('./routes/concerts.routes');
const seatsRoutes = require('./routes/seats.routes');

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api', testimonialsRoutes);
app.use('/api', concertsRoutes);
app.use('/api', seatsRoutes);
app.use(express.static(path.join(__dirname, '/client/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/build/index.html'));
});
app.use((req, res) => {
  res.status(404).json({ message: '404 not found...' });
});
app.use(helmet());

mongoose.connect(
  'mongodb+srv://AtlasAdmin:9876543210@cluster0.nzkum.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const db = mongoose.connection;

db.once('open', () => {
  console.log('Connected to the database');
});
db.on('error', (err) => console.log('Error' + err));

const server = app.listen(process.env.PORT || 8001, () => {
  console.log('Server is running');
});

const io = socket(server);
io.on('connection', (socket) => {
  console.log('New socket ', socket.id);
});

module.exports = server;