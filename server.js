require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(cors());

// Security headers
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; img-src 'self' data:;");
  res.setHeader('X-Content-Type-Options', 'nosniff');
  next();
});

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Database initialization
async function initializeDatabase() {
  try {
    console.log('Starting database initialization...');

    await pool.query(`CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`);
    console.log('✓ Users table created');

    await pool.query(`CREATE TABLE IF NOT EXISTS concepts (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      module VARCHAR(100),
      difficulty VARCHAR(50),
      level VARCHAR(50),
      content TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`);
    console.log('✓ Concepts table created');

    await pool.query(`CREATE TABLE IF NOT EXISTS assessments (
      id SERIAL PRIMARY KEY,
      user_id INT REFERENCES users(id) ON DELETE CASCADE,
      concept_id INT REFERENCES concepts(id),
      score INT,
      feedback TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`);
    console.log('✓ Assessments table created');

    await pool.query(`CREATE TABLE IF NOT EXISTS progress (
      id SERIAL PRIMARY KEY,
      user_id INT REFERENCES users(id) ON DELETE CASCADE,
      concept_id INT REFERENCES concepts(id),
      repetitions INT DEFAULT 0,
      ease_factor DECIMAL(3,2) DEFAULT 2.5,
      next_review TIMESTAMP,
      status VARCHAR(50),
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`);
    console.log('✓ Progress table created');

    await pool.query(`CREATE TABLE IF NOT EXISTS gamification (
      id SERIAL PRIMARY KEY,
      user_id INT REFERENCES users(id) ON DELETE CASCADE,
      points INT DEFAULT 0,
      badges TEXT,
      streak INT DEFAULT 0,
      last_activity TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`);
    console.log('✓ Gamification table created');

    await pool.query(`CREATE TABLE IF NOT EXISTS videos (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255),
      url VARCHAR(500),
      module VARCHAR(100),
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`);
    console.log('✓ Videos table created');

    await pool.query(`CREATE TABLE IF NOT EXISTS tutors (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255),
      expertise VARCHAR(255),
      rating DECIMAL(3,2),
      available BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`);
    console.log('✓ Tutors table created');

    await pool.query(`CREATE TABLE IF NOT EXISTS tutoring_sessions (
      id SERIAL PRIMARY KEY,
      user_id INT REFERENCES users(id) ON DELETE CASCADE,
      tutor_id INT REFERENCES tutors(id),
      session_date TIMESTAMP,
      duration INT,
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`);
    console.log('✓ Tutoring sessions table created');

    await pool.query(`CREATE TABLE IF NOT EXISTS audio_recordings (
      id SERIAL PRIMARY KEY,
      user_id INT REFERENCES users(id) ON DELETE CASCADE,
      module VARCHAR(100),
      audio_url TEXT,
      transcript TEXT,
      pronunciation_score INT,
      feedback TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`);
    console.log('✓ Audio recordings table created');

    await pool.query(`CREATE TABLE IF NOT EXISTS grammar_checks (
      id SERIAL PRIMARY KEY,
      user_id INT REFERENCES users(id) ON DELETE CASCADE,
      text_input TEXT,
      errors JSONB,
      corrections JSONB,
      score INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`);
    console.log('✓ Grammar checks table created');

    await pool.query(`CREATE TABLE IF NOT EXISTS plagiarism_checks (
      id SERIAL PRIMARY KEY,
      user_id INT REFERENCES users(id) ON DELETE CASCADE,
      text_input TEXT,
      plagiarism_score DECIMAL(5,2),
      matched_sources JSONB,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`);
    console.log('✓ Plagiarism checks table created');

    await pool.query(`CREATE TABLE IF NOT EXISTS analytics (
      id SERIAL PRIMARY KEY,
      user_id INT REFERENCES users(id) ON DELETE CASCADE,
      module VARCHAR(100),
      time_spent INT,
      concepts_learned INT,
      accuracy_score INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`);
    console.log('✓ Analytics table created');

    console.log('✓✓✓ ALL TABLES INITIALIZED ✓✓✓\n');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

// Insert sample data
async function insertSampleData() {
  try {
    const check = await pool.query('SELECT COUNT(*) FROM concepts');
    if (check.rows[0].count > 0) return;

    await pool.query(`INSERT INTO concepts (title, description, module, difficulty, level, content) VALUES
      ('Present Simple', 'Basic present tense', 'Grammar', 'Beginner', 'A1', 'Used for habits and facts'),
      ('Pronunciation: Vowels', 'Learn vowel sounds', 'Speaking', 'Beginner', 'A1', 'English has 12 vowel sounds'),
      ('Reading Comprehension', 'Understand written text', 'Reading', 'Beginner', 'A1', 'Read paragraphs and answer'),
      ('Present Continuous', 'Progressive tense', 'Grammar', 'Intermediate', 'A2', 'Actions happening now'),
      ('Advanced Idioms', 'Common English idioms', 'Grammar', 'Advanced', 'C1', 'Native speaker phrases')`);

    await pool.query(`INSERT INTO tutors (name, expertise, rating, available) VALUES
      ('John Smith', 'Speaking & Pronunciation', 4.9, true),
      ('Sarah Johnson', 'Grammar & Writing', 4.8, true),
      ('Michael Chen', 'Business English', 4.7, true),
      ('Emma Williams', 'IELTS Preparation', 4.9, true)`);

    console.log('✓ Sample data inserted\n');
  } catch (error) {
    console.error('Sample data error:', error);
  }
}

// Test connection
async function testConnection() {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('✓ Database connection successful\n');
    return true;
  } catch (error) {
    console.error('✗ Database connection failed:', error.message);
    throw error;
  }
}

// JWT middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token required' });

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
}

// ==================== SERVE FRONTEND ====================
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'app.html'));
});

app.get(/^\/(?!api\/)/, (req, res) => {
  res.sendFile(path.join(__dirname, 'app.html'));
});

// ==================== API ROUTES ====================

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) return res.status(400).json({ error: 'All fields required' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name',
      [email, hashedPassword, name]
    );

    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '7d' });

    await pool.query(
      'INSERT INTO gamification (user_id, points, badges, streak) VALUES ($1, 0, $2, 0)',
      [user.id, '[]']
    );

    res.status(201).json({ message: 'Registered successfully', user, token });
  } catch (error) {
    console.error('Registration error:', error);
    if (error.code === '23505') return res.status(409).json({ error: 'Email already exists' });
    res.status(500).json({ error: error.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '7d' });
    res.json({ message: 'Login successful', user: { id: user.id, email: user.email, name: user.name }, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get profile
app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const user = await pool.query('SELECT id, email, name, created_at FROM users WHERE id = $1', [req.user.id]);
    const gamification = await pool.query('SELECT * FROM gamification WHERE user_id = $1', [req.user.id]);
    res.json({ user: user.rows[0], gamification: gamification.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get concepts
app.get('/api/concepts', async (req, res) => {
  try {
    const level = req.query.level;
    let query = 'SELECT * FROM concepts';
    let params = [];
    if (level) {
      query += ' WHERE level = $1';
      params.push(level);
    }
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get concept by ID
app.get('/api/concepts/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM concepts WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create assessment
app.post('/api/assessments', authenticateToken, async (req, res) => {
  try {
    const { concept_id, score, feedback } = req.body;
    const result = await pool.query(
      'INSERT INTO assessments (user_id, concept_id, score, feedback) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.user.id, concept_id, score, feedback]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get assessments
app.get('/api/assessments', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM assessments WHERE user_id = $1', [req.user.id]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update progress
app.post('/api/progress', authenticateToken, async (req, res) => {
  try {
    const { concept_id, quality } = req.body;
    let progress = await pool.query(
      'SELECT * FROM progress WHERE user_id = $1 AND concept_id = $2',
      [req.user.id, concept_id]
    );

    if (progress.rows.length === 0) {
      const result = await pool.query(
        'INSERT INTO progress (user_id, concept_id, repetitions, ease_factor, next_review, status) VALUES ($1, $2, 1, 2.5, NOW() + INTERVAL \'1 day\', \'learning\') RETURNING *',
        [req.user.id, concept_id]
      );
      return res.status(201).json(result.rows[0]);
    }

    const p = progress.rows[0];
    let newEase = Math.max(1.3, p.ease_factor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    let interval = p.repetitions === 0 ? 1 : p.repetitions === 1 ? 3 : Math.round(p.repetitions * newEase);

    const result = await pool.query(
      'UPDATE progress SET repetitions = repetitions + 1, ease_factor = $1, next_review = NOW() + ($2 || \' days\')::INTERVAL WHERE user_id = $3 AND concept_id = $4 RETURNING *',
      [newEase, interval, req.user.id, concept_id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get progress
app.get('/api/progress', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM progress WHERE user_id = $1', [req.user.id]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get gamification
app.get('/api/gamification', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM gamification WHERE user_id = $1', [req.user.id]);
    res.json(result.rows[0] || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update points
app.post('/api/gamification/points', authenticateToken, async (req, res) => {
  try {
    const { points } = req.body;
    const result = await pool.query(
      'UPDATE gamification SET points = points + $1 WHERE user_id = $2 RETURNING *',
      [points, req.user.id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get leaderboard
app.get('/api/leaderboard', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT u.id, u.name, g.points, g.streak FROM users u JOIN gamification g ON u.id = g.user_id ORDER BY g.points DESC LIMIT 20'
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get videos
app.get('/api/videos', async (req, res) => {
  try {
    const module = req.query.module;
    let query = 'SELECT * FROM videos';
    let params = [];
    if (module) {
      query += ' WHERE module = $1';
      params.push(module);
    }
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get tutors
app.get('/api/tutors', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tutors WHERE available = true ORDER BY rating DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Book tutoring
app.post('/api/tutoring/book', authenticateToken, async (req, res) => {
  try {
    const { tutor_id, session_date, duration } = req.body;
    const result = await pool.query(
      'INSERT INTO tutoring_sessions (user_id, tutor_id, session_date, duration) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.user.id, tutor_id, session_date, duration]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get tutoring sessions
app.get('/api/tutoring/sessions', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tutoring_sessions WHERE user_id = $1', [req.user.id]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save audio
app.post('/api/audio/save', authenticateToken, async (req, res) => {
  try {
    const { module, audio_url, transcript, pronunciation_score } = req.body;
    const result = await pool.query(
      'INSERT INTO audio_recordings (user_id, module, audio_url, transcript, pronunciation_score) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [req.user.id, module, audio_url, transcript, pronunciation_score]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get audio recordings
app.get('/api/audio/recordings', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM audio_recordings WHERE user_id = $1 ORDER BY created_at DESC', [req.user.id]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Grammar check
app.post('/api/grammar/check', authenticateToken, async (req, res) => {
  try {
    const { text_input } = req.body;
    const result = await pool.query(
      'INSERT INTO grammar_checks (user_id, text_input, errors, corrections, score) VALUES ($1, $2, $3, $4, 80) RETURNING *',
      [req.user.id, text_input, '[]', '[]']
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Plagiarism check
app.post('/api/plagiarism/check', authenticateToken, async (req, res) => {
  try {
    const { text_input } = req.body;
    const result = await pool.query(
      'INSERT INTO plagiarism_checks (user_id, text_input, plagiarism_score, matched_sources) VALUES ($1, $2, 0.5, $3) RETURNING *',
      [req.user.id, text_input, '[]']
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get analytics
app.get('/api/analytics', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM analytics WHERE user_id = $1', [req.user.id]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save analytics
app.post('/api/analytics', authenticateToken, async (req, res) => {
  try {
    const { module, time_spent, concepts_learned, accuracy_score } = req.body;
    const result = await pool.query(
      'INSERT INTO analytics (user_id, module, time_spent, concepts_learned, accuracy_score) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [req.user.id, module, time_spent, concepts_learned, accuracy_score]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== START SERVER ====================
async function startServer() {
  try {
    console.log('\n===== ENGLISH LEARNING PLATFORM =====\n');
    await testConnection();
    await initializeDatabase();
    await insertSampleData();

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`✓ Server running on port ${PORT}`);
      console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log('\n✓✓✓ APPLICATION READY ✓✓✓\n`);
    });
  } catch (error) {
    console.error('\n✗✗✗ CRITICAL ERROR ✗✗✗');
    console.error('Failed to start:', error.message);
    process.exit(1);
  }
}

process.on('SIGINT', async () => {
  console.log('\nShutting down...');
  await pool.end();
  process.exit(0);
});

startServer();
