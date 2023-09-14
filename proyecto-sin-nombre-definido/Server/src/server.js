require('dotenv').config()
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
require('./helpers/Middlewares/passport-config')
const router = require('./routes/index');


const server = express();

const corsOptions = {
  origin: 'http://localhost:5173', // Cambia esto según la URL de tu frontend
  credentials: true, // Habilita el envío de cookies y encabezados de autenticación
};

server.use(morgan('dev'));
server.use(express.json());
server.use(cors(corsOptions));

server.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

// Configura passport
server.use(passport.initialize());
server.use(passport.session());

// Serialización y deserialización de usuarios
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

server.use(router);

module.exports = server;

