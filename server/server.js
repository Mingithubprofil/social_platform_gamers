
// importerer express-bibliotek 
const express = require("express");

// importerer cors-biblioteket
const cors = require('cors');

// cookieparser

const cookieParser = require('cookie-parser');

// importerer bodyparser-biblioteket 
const bodyParser = require('body-parser');

// http
const http = require('http');

// socket io
const socketIo = require('socket.io');

// db 
const connectDB = require('./database/mongodb.js'); // Adjust the path as needed

// userRoutes 
const userRoutes = require('./routes/routes'); // Adjust the path as needed

// importerer path-biblioteket til at håndtere filstier og mappestrukturer
const path = require('path')

// opretter en express-app
const app = express();

const server = http.createServer(app); // Create an HTTP server
const io = socketIo(server); // Initialize Socket.IO with the HTTP server

// portnummeret som serveren skal lytte på
const port = 3000

// angiver host som serveren skal lytte på, her "localhost"
const host = 'localhost'; // const host = '127.0.0.1';

// cors er en middleware, der giver tilladelse til at håndtere anmodninger fra forskellige oprindelser
app.use(cors());

// cookie parser for app
app.use(cookieParser());

// body-parser er middleware til at (parse/analysere) indholdet af anmodninger og svar 
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// angiver filsti til statiske filer
app.use(express.static(path.join(__dirname, '../client')));

app.use('/api', userRoutes); 

// importerer http-server
//const http = require('http').Server(app);

// importerer socket io
//const io = require('socket.io')(http);

// her importeres userRoute (const userRoute = express.Router();) fra userRoutes.js
//const userRoute = require("./routes/userRoute");

// bruger userRoute for stier der starter "/"
//app.use("/", userRoute);

//home

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/html/home.html'));
});

//login

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/html/login.html'));
  
});

//register

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/html/sign_up.html'));
  
});

//profile

app.get('/profile', (req, res) => {
  //res.sendFile(path.join(__dirname, '../client/html/profile_page.html'));

  res.sendFile(path.join(__dirname, '../client/html/profile.html'));
  
  
});

//css

app.get('/global.css', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/css/styles.css'));
});

//socket io connection

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('chat message', (msg) => {
      // Assuming msg is an object {text: "Hello", user: "Username"}
      // Broadcast the message object to all connected clients
      io.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
      console.log('User disconnected');
  });
});


// db




// server

// Connect to MongoDB and start the server
connectDB().then(() => {
  server.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}/ and connected to MongoDB`);
  });
}).catch(err => {
  console.error("Database connection failed", err);
  process.exit(1);
});
  