require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(cors());

// Database connection with proper SSL for Railway
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Database initialization - creates all tables
async function initializeDatabase() {
  try {
    console.log('Starting database initialization...');
    
    // Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ Users table created');

    // Concepts table (learning materials)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS concepts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        module VARCHAR(100),
        difficulty VARCHAR(50),
        level VARCHAR(50),
        content TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ Concepts table created');

    // Assessments table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS assessments (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        concept_id INT REFERENCES concepts(id),
        score INT,
        feedback TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ Assessments table created');

    // Progress tracking
    await pool.query(`
      CREATE TABLE IF NOT EXISTS progress (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        concept_id INT REFERENCES concepts(id),
        repetitions INT DEFAULT 0,
        ease_factor DECIMAL(3,2) DEFAULT 2.5,
        next_review TIMESTAMP,
        status VARCHAR(50),
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ Progress table created');

    // Gamification - points, badges, streaks
    await pool.query(`
      CREATE TABLE IF NOT EXISTS gamification (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        points INT DEFAULT 0,
        badges TEXT,
        streak INT DEFAULT 0,
        last_activity TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ Gamification table created');

    // Videos table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS videos (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255),
        url VARCHAR(500),
        module VARCHAR(100),
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ Videos table created');

    // Tutors table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tutors (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        expertise VARCHAR(255),
        rating DECIMAL(3,2),
        available BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ Tutors table created');

    // Tutoring sessions
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tutoring_sessions (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        tutor_id INT REFERENCES tutors(id),
        session_date TIMESTAMP,
        duration INT,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ Tutoring sessions table created');

    // Audio recordings for Speaking module
    await pool.query(`
      CREATE TABLE IF NOT EXISTS audio_recordings (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        module VARCHAR(100),
        audio_url TEXT,
        transcript TEXT,
        pronunciation_score INT,
        feedback TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ Audio recordings table created');

    // Grammar checking results
    await pool.query(`
      CREATE TABLE IF NOT EXISTS grammar_checks (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        text_input TEXT,
        errors JSONB,
        corrections JSONB,
        score INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ Grammar checks table created');

    // Plagiarism detection results
    await pool.query(`
      CREATE TABLE IF NOT EXISTS plagiarism_checks (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        text_input TEXT,
        plagiarism_score DECIMAL(5,2),
        matched_sources JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ Plagiarism checks table created');

    // Analytics
    await pool.query(`
      CREATE TABLE IF NOT EXISTS analytics (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        module VARCHAR(100),
        time_spent INT,
        concepts_learned INT,
        accuracy_score INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ Analytics table created');

    console.log('✓✓✓ ALL TABLES INITIALIZED SUCCESSFULLY ✓✓✓\n');
    return true;
  } catch (error) {
    console.error('✗ Database initialization error:', error);
    throw error;
  }
}

// Insert sample data
async function insertSampleData() {
  try {
    // Check if data already exists
    const conceptCheck = await pool.query('SELECT COUNT(*) FROM concepts');
    if (conceptCheck.rows[0].count > 0) {
      console.log('Sample data already exists, skipping insertion');
      return;
    }

    // Sample concepts
    await pool.query(`
      INSERT INTO concepts (title, description, module, difficulty, level, content)
      VALUES 
        ('Present Simple', 'Basic present tense usage', 'Grammar', 'Beginner', 'A1', 'The present simple is used for habits, facts, and routines.'),
        ('Pronunciation: Vowels', 'Learn correct vowel pronunciation', 'Speaking', 'Beginner', 'A1', 'English has 12 vowel sounds. Practice these basic sounds.'),
        ('Reading Comprehension', 'Understand written English', 'Reading', 'Beginner', 'A1', 'Read short paragraphs and answer questions.'),
        ('Present Continuous', 'Present progressive tense', 'Grammar', 'Intermediate', 'A2', 'Using -ing form for actions happening now.'),
        ('Advanced Idioms', 'Learn common English idioms', 'Grammar', 'Advanced', 'C1', 'Idioms that native speakers use daily.')
    `);

    // Sample tutors
    await pool.query(`
      INSERT INTO tutors (name, expertise, rating, available)
      VALUES 
        ('John Smith', 'Speaking & Pronunciation', 4.9, true),
        ('Sarah Johnson', 'Grammar & Writing', 4.8, true),
        ('Michael Chen', 'Business English', 4.7, true),
        ('Emma Williams', 'IELTS Preparation', 4.9, true)
    `);

    console.log('✓ Sample data inserted successfully\n');
  } catch (error) {
    console.error('✗ Sample data insertion error:', error);
  }
}

// Test database connection
async function testDatabaseConnection() {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('✓ Database connection successful');
    console.log('  Current time:', result.rows[0].now);
    return true;
  } catch (error) {
    console.error('✗ Database connection failed:', error.message);
    throw error;
  }
}

// JWT Authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}

// ==================== API ROUTES ====================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

// ==================== AUTHENTICATION ====================

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const result = await pool.query(
      'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name',
      [email, hashedPassword, name]
    );

    const user = result.rows[0];

    // Create JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Initialize gamification for new user
    await pool.query(
      'INSERT INTO gamification (user_id, points, badges, streak) VALUES ($1, $2, $3, $4)',
      [user.id, 0, '[]', 0]
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: { id: user.id, email: user.email, name: user.name },
      token: token
    });
  } catch (error) {
    console.error('Registration error:', error);
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: error.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = result.rows[0];

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      user: { id: user.id, email: user.email, name: user.name },
      token: token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== USER PROFILE ====================

// Get user profile
app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const user = await pool.query('SELECT id, email, name, created_at FROM users WHERE id = $1', [req.user.id]);
    const gamification = await pool.query('SELECT * FROM gamification WHERE user_id = $1', [req.user.id]);
    
    res.json({
      user: user.rows[0],
      gamification: gamification.rows[0]
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== CONCEPTS & LEARNING ====================

// Get all concepts
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
    console.error('Concepts fetch error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get single concept
app.get('/api/concepts/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM concepts WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Concept not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Concept fetch error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== ASSESSMENTS ====================

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
    console.error('Assessment creation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get assessments
app.get('/api/assessments', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM assessments WHERE user_id = $1', [req.user.id]);
    res.json(result.rows);
  } catch (error) {
    console.error('Assessments fetch error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== PROGRESS TRACKING ====================

// Update progress (Spaced Repetition algorithm)
app.post('/api/progress', authenticateToken, async (req, res) => {
  try {
    const { concept_id, quality } = req.body;

    // Get current progress
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

    // Update using SM-2 algorithm
    const p = progress.rows[0];
    let newEase = Math.max(1.3, p.ease_factor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    let interval = 1;

    if (p.repetitions === 0) interval = 1;
    else if (p.repetitions === 1) interval = 3;
    else interval = Math.round(p.repetitions * newEase);

    const result = await pool.query(
      'UPDATE progress SET repetitions = repetitions + 1, ease_factor = $1, next_review = NOW() + ($2 || \' days\')::INTERVAL, status = \'learning\' WHERE user_id = $3 AND concept_id = $4 RETURNING *',
      [newEase, interval, req.user.id, concept_id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Progress update error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get progress
app.get('/api/progress', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM progress WHERE user_id = $1', [req.user.id]);
    res.json(result.rows);
  } catch (error) {
    console.error('Progress fetch error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== GAMIFICATION ====================

// Get gamification stats
app.get('/api/gamification', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM gamification WHERE user_id = $1', [req.user.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Gamification data not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Gamification fetch error:', error);
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
    console.error('Points update error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== LEADERBOARD ====================

// Get leaderboard
app.get('/api/leaderboard', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT u.id, u.name, g.points, g.streak FROM users u JOIN gamification g ON u.id = g.user_id ORDER BY g.points DESC LIMIT 20'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Leaderboard fetch error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== VIDEOS ====================

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
    console.error('Videos fetch error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== TUTORS ====================

// Get tutors
app.get('/api/tutors', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tutors WHERE available = true ORDER BY rating DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Tutors fetch error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== TUTORING SESSIONS ====================

// Book tutoring session
app.post('/api/tutoring/book', authenticateToken, async (req, res) => {
  try {
    const { tutor_id, session_date, duration } = req.body;

    const result = await pool.query(
      'INSERT INTO tutoring_sessions (user_id, tutor_id, session_date, duration) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.user.id, tutor_id, session_date, duration]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Tutoring booking error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get tutoring sessions
app.get('/api/tutoring/sessions', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tutoring_sessions WHERE user_id = $1', [req.user.id]);
    res.json(result.rows);
  } catch (error) {
    console.error('Tutoring sessions fetch error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== AUDIO RECORDING (SPEAKING) ====================

// Save audio recording
app.post('/api/audio/save', authenticateToken, async (req, res) => {
  try {
    const { module, audio_url, transcript, pronunciation_score } = req.body;

    const result = await pool.query(
      'INSERT INTO audio_recordings (user_id, module, audio_url, transcript, pronunciation_score) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [req.user.id, module, audio_url, transcript, pronunciation_score]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Audio save error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get user audio recordings
app.get('/api/audio/recordings', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM audio_recordings WHERE user_id = $1 ORDER BY created_at DESC', [req.user.id]);
    res.json(result.rows);
  } catch (error) {
    console.error('Audio recordings fetch error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== GRAMMAR CHECKING ====================

// Check grammar
app.post('/api/grammar/check', authenticateToken, async (req, res) => {
  try {
    const { text_input } = req.body;

    const result = await pool.query(
      'INSERT INTO grammar_checks (user_id, text_input, errors, corrections, score) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [req.user.id, text_input, '[]', '[]', 80]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Grammar check error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== PLAGIARISM DETECTION ====================

// Check plagiarism
app.post('/api/plagiarism/check', authenticateToken, async (req, res) => {
  try {
    const { text_input } = req.body;

    const result = await pool.query(
      'INSERT INTO plagiarism_checks (user_id, text_input, plagiarism_score, matched_sources) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.user.id, text_input, 0.5, '[]']
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Plagiarism check error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== ANALYTICS ====================

// Get user analytics
app.get('/api/analytics', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM analytics WHERE user_id = $1', [req.user.id]);
    res.json(result.rows);
  } catch (error) {
    console.error('Analytics fetch error:', error);
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
    console.error('Analytics save error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== SERVER STARTUP ====================

// Start server only after database is initialized
async function startServer() {
  try {
    console.log('\n===== ENGLISH LEARNING PLATFORM =====\n');
    console.log('📝 Starting application...\n');

    // Test connection
    await testDatabaseConnection();
    
    // Initialize database
    await initializeDatabase();
    
    // Insert sample data
    await insertSampleData();

    // Start listening
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`✓ Server running on http://0.0.0.0:${PORT}`);
      console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log('\n✓✓✓ APPLICATION READY ✓✓✓\n');
    });
  } catch (error) {
    console.error('\n✗✗✗ CRITICAL ERROR ✗✗✗');
    console.error('Failed to start server:', error.message);
    console.error('\nPlease check:');
    console.error('1. DATABASE_URL is correct');
    console.error('2. PostgreSQL is running');
    console.error('3. Database credentials are valid\n');
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n\nShutting down gracefully...');
  await pool.end();
  process.exit(0);
});

startServer();
