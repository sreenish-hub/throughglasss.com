require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const { body, validationResult } = require('express-validator');

const app = express();

// Middleware
app.use(helmet());
if (process.env.NODE_ENV !== 'production') {
  // In development allow any origin (convenient for local testing)
  app.use(cors({ origin: true, credentials: true }));
} else {
  app.use(cors({
    origin: ['https://sreenish-hub.github.io', 'https://throughglasss.vercel.app'],
    credentials: true
  }));
}
app.use(express.json({ limit: '10mb' }));

// Simple request logger in dev
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} -> ${req.method} ${req.originalUrl}`);
    next();
  });
}
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
  try {
    const { username, password } = req.body || {};
    if (!username || !password) return res.status(400).json({ error: 'username and password required' });

    const adminUser = process.env.ADMIN_USERNAME || 'admin';
    const adminPass = process.env.ADMIN_PASSWORD || 'admin';

    // Basic plain-text check (suitable for small projects). In future store hashed passwords.
    if (username === adminUser && password === adminPass) {
      const token = jwt.sign({ username }, process.env.JWT_SECRET || 'secret-key', { expiresIn: '24h' });
      return res.json({ token });
    }

    return res.status(401).json({ error: 'Invalid credentials' });
  } catch (err) {
    console.error('Login error', err);
    return res.status(500).json({ error: 'Server error' });
  }
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
  try {
    return res.json(PRESETS.sort((a, b) => a.order - b.order));
  } catch (err) {
    console.error('Error fetching presets', err);
    return res.status(500).json({ error: 'Could not fetch presets' });
  }
});

// Contact endpoint - accepts name, email, message
app.post('/api/contact', (req, res) => {
  try {
    const { name, email, message } = req.body || {};
    if (!name || !email || !message) return res.status(400).json({ error: 'name, email and message are required' });

    // If SMTP settings are provided, send email. Otherwise, just log and acknowledge.
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      const nodemailer = require('nodemailer');
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });

      const mailOptions = {
        from: `${name} <${email}>`,
        to: process.env.CONTACT_TO || process.env.SMTP_USER,
        subject: `Website contact from ${name}`,
        text: message
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Contact email error', error);
          return res.status(500).json({ error: 'Failed to send email' });
        }
        console.log('Contact email sent', info.response);
        return res.json({ ok: true });
      });
    } else {
      console.log('Contact form submission:', { name, email, message });
      return res.json({ ok: true, note: 'No SMTP configured; message logged on server.' });
    }
  } catch (err) {
    console.error('Contact error', err);
    return res.status(500).json({ error: 'Server error' });
  }
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

// Generic error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;

// Serve static frontend files while developing so admin and frontend load from same origin
if (process.env.NODE_ENV !== 'production') {
  // Serve the `public` folder at the server root so `/script.js` and `/styles.css` work locally
  app.use(express.static(path.join(__dirname, '..', 'public')));

  app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
  });
}

// Export for Vercel
module.exports = app;
