require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const { body, validationResult } = require('express-validator');

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: ['https://sreenish-hub.github.io', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Mock data - Replace with MongoDB when needed
let PRESETS = [
  {
    id: 1,
    name: 'Golden Hour',
    desc: 'Warm, cinematic color grading for portrait & outdoor storytelling',
    price: '$29',
    link: 'https://gumroad.com/throughglasss',
    order: 0
  },
  {
    id: 2,
    name: 'Midnight Blue',
    desc: 'Deep, moody tones perfect for dramatic cinematic looks',
    price: '$29',
    link: 'https://gumroad.com/throughglasss',
    order: 1
  },
  {
    id: 3,
    name: 'Vintage Film',
    desc: 'Classic analog film stock emulation for nostalgic aesthetics',
    price: '$29',
    link: 'https://gumroad.com/throughglasss',
    order: 2
  }
];

// Auth Routes
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  // Check credentials
  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    const token = jwt.sign({ username }, process.env.JWT_SECRET || 'secret-key', { expiresIn: '24h' });
    return res.json({ token });
  }
  
  return res.status(401).json({ error: 'Invalid credentials' });
});

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'Token missing' });
  
  jwt.verify(token, process.env.JWT_SECRET || 'secret-key', (err) => {
    if (err) return res.status(403).json({ error: 'Token invalid' });
    next();
  });
};

// GET all presets (public)
app.get('/api/presets', (req, res) => {
  res.json(PRESETS.sort((a, b) => a.order - b.order));
});

// POST new preset (admin only)
app.post('/api/presets', authenticateToken, [
  body('name').notEmpty(),
  body('desc').notEmpty(),
  body('price').notEmpty(),
  body('link').notEmpty()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  
  const newPreset = {
    id: Date.now(),
    ...req.body,
    order: PRESETS.length
  };
  
  PRESETS.push(newPreset);
  res.json(newPreset);
});

// UPDATE preset
app.put('/api/presets/:id', authenticateToken, (req, res) => {
  const preset = PRESETS.find(p => p.id == req.params.id);
  if (!preset) return res.status(404).json({ error: 'Preset not found' });
  
  Object.assign(preset, req.body);
  res.json(preset);
});

// DELETE preset
app.delete('/api/presets/:id', authenticateToken, (req, res) => {
  PRESETS = PRESETS.filter(p => p.id != req.params.id);
  res.json({ message: 'Deleted' });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

const PORT = process.env.PORT || 3000;

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
  });
}

// Export for Vercel
module.exports = app;
