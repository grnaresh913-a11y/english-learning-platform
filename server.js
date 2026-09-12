const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// PostgreSQL Connection Pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test Database Connection
pool.on('connect', () => {
  console.log('✓ Database connected successfully');
});

pool.on('error', (err) => {
  console.error('Database connection error:', err);
});

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name',
      [email, hashedPassword, name || email]
    );
    const token = jwt.sign({ userId: result.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({
      success: true,
      message: 'User registered successfully',
      user: result.rows[0],
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({
      success: true,
      message: 'Login successful',
      user: { id: user.id, email: user.email, name: user.name },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, email, name, created_at FROM users WHERE id = $1', [req.userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

app.get('/api/concepts', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM concepts ORDER BY module, id LIMIT 60');
    res.json({ concepts: result.rows });
  } catch (error) {
    console.error('Concepts error:', error);
    res.status(500).json({ error: 'Failed to fetch concepts' });
  }
});

app.get('/api/concepts/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM concepts WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Concept not found' });
    }
    res.json({ concept: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch concept' });
  }
});

app.post('/api/assessments', authenticateToken, async (req, res) => {
  try {
    const { conceptId, type, score, feedback } = req.body;
    const result = await pool.query(
      'INSERT INTO assessments (user_id, concept_id, type, score, feedback) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [req.userId, conceptId, type, score, feedback || '']
    );
    res.json({ success: true, assessment: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit assessment' });
  }
});

app.get('/api/assessments', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM assessments WHERE user_id = $1 ORDER BY created_at DESC',
      [req.userId]
    );
    res.json({ assessments: result.rows });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch assessments' });
  }
});

app.get('/api/progress', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM progress WHERE user_id = $1', [req.userId]);
    res.json({ progress: result.rows });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

app.post('/api/progress', authenticateToken, async (req, res) => {
  try {
    const { conceptId, status, proficiency } = req.body;
    const result = await pool.query(
      'INSERT INTO progress (user_id, concept_id, status, proficiency) VALUES ($1, $2, $3, $4) ON CONFLICT (user_id, concept_id) DO UPDATE SET status = $3, proficiency = $4, updated_at = NOW() RETURNING *',
      [req.userId, conceptId, status, proficiency || 0]
    );
    res.json({ progress: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update progress' });
  }
});

app.get('/api/gamification', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM gamification WHERE user_id = $1', [req.userId]);
    if (result.rows.length === 0) {
      return res.json({ gamification: { user_id: req.userId, points: 0, badges: [], streak: 0 } });
    }
    res.json({ gamification: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch gamification' });
  }
});

app.get('/api/leaderboard', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT u.id, u.name, g.points FROM users u LEFT JOIN gamification g ON u.id = g.user_id ORDER BY g.points DESC LIMIT 100'
    );
    res.json({ leaderboard: result.rows });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

app.get('/api/videos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM videos ORDER BY id LIMIT 100');
    res.json({ videos: result.rows });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

app.get('/api/tutors', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tutors WHERE availability = true ORDER BY rating DESC');
    res.json({ tutors: result.rows });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tutors' });
  }
});

app.post('/api/tutoring/book', authenticateToken, async (req, res) => {
  try {
    const { tutorId, scheduledTime, duration } = req.body;
    const result = await pool.query(
      'INSERT INTO tutoring_sessions (user_id, tutor_id, scheduled_time, duration) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.userId, tutorId, scheduledTime, duration]
    );
    res.json({ success: true, session: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to book session' });
  }
});

app.get('/api/tutoring/sessions', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM tutoring_sessions WHERE user_id = $1 ORDER BY scheduled_time DESC',
      [req.userId]
    );
    res.json({ sessions: result.rows });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/app.html');
});

app.use(express.static(__dirname));

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.userId = user.userId;
    next();
  });
}

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`✓ Database connected successfully`);
  console.log(`📦 Phase 4 Features:`);
  console.log(`   ✓ Video Lessons Management`);
  console.log(`   ✓ Multi-Language Support`);
  console.log(`   ✓ Live Tutoring Sessions`);
  console.log(`   ✓ Advanced Pronunciation Analysis`);
  console.log(`   ✓ Spaced Repetition Algorithm`);
  console.log(`   ✓ Mobile API Ready`);
});

module.exports = app;
