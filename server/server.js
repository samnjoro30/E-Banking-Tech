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

const healthCheck = require('./utils/health.check');
const Logger = require('./config/logger');
const os = require('os');
const { client, httpRequestDuration } = require('./config/metric');



const app = express();
app.use(express.json().urlencoded({ extended: true }));

app.set('io', socketIo);

const allowedOrigins = [
  'https://e-banking-tech-61d82.web.app',
  'https://e-payment-platform.web.app',
  'http://localhost:3000',
];
const corsOptions = {
  origin(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg =
        'The CORS policy for this site does not allow access from the specified origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

//helmet for securing header
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: true,
    crossOriginResourcePolicy: { policy: 'same-origin' },
    dnsPrefetchControl: true,
    expectCt: true,
    frameguard: { action: 'deny' },
    hidePoweredBy: true,
    hsts: { maxAge: 31536000, includeSubDomains: true },
    noSniff: true,
    xssFilter: true,
  })
);
app.use(cors(corsOptions));
app.use(morgan('dev'));

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
      await mongoose.connect(process.env.MONGO_URI);
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
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

const server = http.createServer(app);
const io = socketIo(server, {
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

io.on('connection', socket => {
  console.log(`new client connected: ${socket.id}`);

  socket.emit('message', 'Welcome to E-Banking Tech!');
  socket.on('transaction', data => {
    console.log(`New Transaction from ${socket.id}:`, data);
    io.emit('transactionUpdate', data);

    socket.emit('notification', {
      message: 'Your transaction is being processed!',
      timestamp: new Date(),
    });
  });
  socket.on('disconnect', reason => {
    console.log(`Client ${socket.id} disconnected: ${reason}`);
    if (reason === 'ping timeout') {
      console.log('Network issue or client took too long to respond.');
    } else if (reason === 'transport close') {
      console.log('Client manually closed the connection.');
    }
  });
});

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

process.on('SIGTERM', shutdown); // Handle SIGTERM for graceful shutdown
process.on('SIGINT', shutdown); // Handle Ctrl+C shutdown

app.use((req, res, next) => {
  const end = httpRequestDuration.startTimer();
  res.on('finish', () => {
    end({ method: req.method, route: req.route?.path, status: res.statusCode });
  });
  next();
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

app.get('/health', async (req, res) => {
  const mongoStatus = healthCheck.checkMongo()
    ? 'MongoDB connected'
    : 'MongoDB disconnected';

  const posgresStatus = (await healthCheck.checkPostgres())
    ? 'PostgreSQL connected'
    : 'PostgreSQL disconnected';
  const isHealthy =
    mongoStatus === 'MongoDB connected' &&
    posgresStatus === 'PostgreSQL connected';

  const response = {
    status: isHealthy ? 'ok' : 'unhealthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
    cpu: os.loadavg(),
    services: {
      api: true,
      mongo: mongoStatus,
      postgres: posgresStatus,
    },
    activeWebSockets: io.engine.clientsCount, // Number of active WebSocket clients
  };
  Logger.info('Health check accessed', response);
  res.status(isHealthy ? 200 : 503).json(response);
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/trans', require('./routes/transaction'));
app.use('/api/dash', require('./routes/dash'));
app.use('/api/account', require('./routes/account'));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
