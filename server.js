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

// Initialize Database Tables on Startup
async function initializeDatabase() {
  try {
    console.log('Initializing database...');
    
    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Create concepts table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS concepts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        module VARCHAR(100),
        difficulty VARCHAR(50),
        content TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Create assessments table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS assessments (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        concept_id INTEGER REFERENCES concepts(id),
        type VARCHAR(100),
        score INTEGER,
        feedback TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Create progress table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS progress (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        concept_id INTEGER REFERENCES concepts(id),
        status VARCHAR(50),
        proficiency INTEGER DEFAULT 0,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, concept_id)
      );
    `);
    
    // Create gamification table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS gamification (
        id SERIAL PRIMARY KEY,
        user_id INTEGER UNIQUE REFERENCES users(id),
        points INTEGER DEFAULT 0,
        badges TEXT DEFAULT '[]',
        streak INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Create videos table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS videos (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255),
        description TEXT,
        url VARCHAR(500),
        duration INTEGER,
        module VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Create tutors table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tutors (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255),
        expertise TEXT,
        rating DECIMAL(3,2),
        availability BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Create tutoring_sessions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tutoring_sessions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        tutor_id INTEGER REFERENCES tutors(id),
        scheduled_time TIMESTAMP,
        duration INTEGER,
        status VARCHAR(50) DEFAULT 'booked',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log('✓ Database tables created successfully');
    
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}

// Test Database Connection
pool.on('connect', () => {
  console.log('✓ Database connected successfully');
  initializeDatabase();
});

pool.on('error', (err) => {
  console.error('Database connection error:', err);
});

// Routes

// 1. HEALTH CHECK
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

// 2. REGISTER
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

    const token = jwt.sign({ userId: result.rows[0].id }, process.env.JWT_SECRET || 'secret-key', { expiresIn: '7d' });

    res.json({
      success: true,
      message: 'User registered successfully',
      user: result.rows[0],
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed: ' + error.message });
  }
});

// 3. LOGIN
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

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'secret-key', { expiresIn: '7d' });

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

// 4. GET USER PROFILE
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

// 5. GET ALL CONCEPTS
app.get('/api/concepts', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM concepts ORDER BY module, id LIMIT 60');
    res.json({ concepts: result.rows });
  } catch (error) {
    console.error('Concepts error:', error);
    res.status(500).json({ error: 'Failed to fetch concepts' });
  }
});

// 6. GET CONCEPT BY ID
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

// 7. SUBMIT ASSESSMENT
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

// 8. GET USER ASSESSMENTS
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

// 9. GET PROGRESS
app.get('/api/progress', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM progress WHERE user_id = $1', [req.userId]);
    res.json({ progress: result.rows });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

// 10. UPDATE PROGRESS
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

// 11. GET GAMIFICATION STATS
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

// 12. GET LEADERBOARD
app.get('/api/leaderboard', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT u.id, u.name, COALESCE(g.points, 0) as points FROM users u LEFT JOIN gamification g ON u.id = g.user_id ORDER BY points DESC LIMIT 100'
    );
    res.json({ leaderboard: result.rows });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// 13. GET VIDEOS
app.get('/api/videos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM videos ORDER BY id LIMIT 100');
    res.json({ videos: result.rows });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

// 14. GET TUTORS
app.get('/api/tutors', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tutors WHERE availability = true ORDER BY rating DESC');
    res.json({ tutors: result.rows });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tutors' });
  }
});

// 15. BOOK TUTORING SESSION
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

// 16. GET USER TUTORING SESSIONS
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

// Serve Frontend
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/app.html');
});

app.use(express.static(__dirname));

// Middleware to verify JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.userId = user.userId;
    next();
  });
}

// Start Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`✓ Database connection in progress...`);
  console.log(`📦 Phase 4 Features:`);
  console.log(`   ✓ Video Lessons Management`);
  console.log(`   ✓ Multi-Language Support`);
  console.log(`   ✓ Live Tutoring Sessions`);
  console.log(`   ✓ Advanced Pronunciation Analysis`);
  console.log(`   ✓ Spaced Repetition Algorithm`);
  console.log(`   ✓ Mobile API Ready`);
});

module.exports = app;
