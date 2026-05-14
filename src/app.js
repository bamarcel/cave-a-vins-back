const express = require('express');
const app = express();

const authRoutes = require('./modules/auth/auth.routes')
const bouteillesRoutes = require('./modules/bouteilles/bouteilles.routes')

const authMiddleware = require('./middlewares/auth.middleware')
const loggerMiddleware = require('./middlewares/logger.middleware')

const cors = require('cors')
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://cave-a-vins-back-production.up.railway.app'
  ],
  credentials: true
}))

app.use(express.json());
app.use(loggerMiddleware)

app.use('/auth', authRoutes)
app.use('/bouteilles', authMiddleware, bouteillesRoutes)

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Serveur en ligne'});
});

module.exports = app;