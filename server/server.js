require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const socketIo = require('socket.io');
const http = require('http');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const data = require('express');
const router = data.Router();

const  app = express();
app.use(express.json());

const allowedOrigins = ['https://e-banking-tech-61d82.web.app', 'http://localhost:3000'];
const corsOptions = {
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = 'The CORS policy for this site does not allow access from the specified origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'], 
    credentials: true,  
  };

//helmet for securing header
app.use(helmet({
  contentSecurityPolicy: false,  // Disable this if you're using inline scripts or styles
  crossOriginEmbedderPolicy: true,
  crossOriginResourcePolicy: { policy: "same-origin" },
  dnsPrefetchControl: true,
  expectCt: true,
  frameguard: { action: 'deny' },  // Prevent clickjacking
  hidePoweredBy: true,  // Hides 'X-Powered-By' header
  hsts: { maxAge: 31536000, includeSubDomains: true },  // Enforce HTTPS
  noSniff: true,  // Prevent MIME-type sniffing
  xssFilter: true, 
})); 
app.use(cors(corsOptions));
app.use(morgan('dev')); //log http request

//configure to prevent brute force attacks
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10000,
    message: 'Too many requests from this IP, please try again after 15 minutes',
});
app.use(limiter);

// Connect to MongoDB
const connectDB = async (retries = 5) => {
  while (retries) {
      try {
          await mongoose.connect(process.env.MONGO_URI );
          console.log('MongoDB connected!');
          break;
      } catch (err) {
          console.error('Failed to connect to MongoDB:', err);
          retries -= 1;
          console.log(`Retries left: ${retries}`);
          await new Promise(res => setTimeout(res, 5000)); // Wait 5 seconds before retrying
      }
  }
  if (!retries) {
      console.error('Could not connect to MongoDB, exiting...');
      process.exit(1);
  }
};
connectDB();

app.use(cookieParser());
app.use(session({
  secret: process.env.SECRET_KEY, // Change this to a more secure secret
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: true,
    sameSite: 'Lax'
   } 
}));

const server = http.createServer(app);
const io = socketIo(server,{
    cors: {
        origin: allowedOrigins,
        methods: ['GET', 'POST', 'DELETE', 'PUT'],
        allowedHeaders: ['Authorization'],
        credentials: true,
    },
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
});

io.on('connection', (socket) => {
    console.log(`new client connected: ${socket.id}`);

    socket.emit('message', 'Welcome to E-Banking Tech!');
    socket.on('transaction', (data) => {
        console.log(`New Transaction from ${socket.id}:`, data);
        io.emit('transactionUpdate', data);

        socket.emit('notification', {
          message: 'Your transaction is being processed!',
          timestamp: new Date(),
      });
      });
      socket.on('disconnect', (reason) => {
        console.log(`Client ${socket.id} disconnected: ${reason}`);
        if (reason === 'ping timeout') {
          console.log('Network issue or client took too long to respond.');
        } else if (reason === 'transport close') {
          console.log('Client manually closed the connection.');
        }
      });
});

// router.post('/refresh', (req, res) => {
//   const token = req.cookies.refreshToken;

//   if (!token) return res.sendStatus(401);

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const newAccessToken = jwt.sign(
//       { userId: decoded.userId },
//       process.env.JWT_SECRET,
//       { expiresIn: '15m' }
//     );

//     res.status(200).json({ accessToken: newAccessToken });
//   } catch (err) {
//     return res.sendStatus(403); // Invalid refresh token
//   }
// });

const shutdown = () => {
  server.close(() => {
      console.log('Server is shutting down gracefully.');
      mongoose.connection.close(false, () => {
          console.log('MongoDB connection closed.');
          process.exit(0);
      });
  });

  // Force shutdown if the above doesn't work within 10 seconds
  setTimeout(() => {
      console.error('Forcing server shutdown...');
      process.exit(1);
  }, 10000);
};

process.on('SIGTERM', shutdown);  // Handle SIGTERM for graceful shutdown
process.on('SIGINT', shutdown);   // Handle Ctrl+C shutdown

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
    activeWebSockets: io.engine.clientsCount,  // Number of active WebSocket clients
});
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/transaction', require('./routes/transaction'));
app.use('api/admin', require('./routes/adminRoutes'));
app.use('api/authadmin', require('./routes/adminAuth'));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
