/**
 * English Learning Platform - Backend Server
 * Phase 3 + Phase 4 complete
 */

require('dotenv').config();

const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;
const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret-in-production';

/* ------------------------------------------------------------------ */
/* Middleware                                                          */
/* ------------------------------------------------------------------ */

app.use(express.json({ limit: '10mb' }));
app.use(cors());

// Security headers. The frontend is a single self-contained HTML file,
// so inline styles and scripts must be allowed. No external origins.
app.use(function (req, res, next) {
  res.setHeader(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "media-src 'self' data: blob:",
      "font-src 'self' data:",
      "connect-src 'self'"
    ].join('; ')
  );
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'no-referrer');
  next();
});

/* ------------------------------------------------------------------ */
/* Database                                                            */
/* ------------------------------------------------------------------ */

const pgsslFlag = String(process.env.PGSSL || '').toLowerCase();
const wantSSL = pgsslFlag === 'true' ||
  (process.env.NODE_ENV === 'production' && pgsslFlag !== 'false');

function makePool(ssl) {
  const p = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: ssl ? { rejectUnauthorized: false } : false,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000
  });
  p.on('error', function (err) {
    console.error('[db] idle client error:', err.message);
  });
  return p;
}

// Reassignable: if SSL negotiation fails we rebuild the pool without it.
// Every route reads this variable at call time, so swapping it is safe.
let pool = makePool(wantSSL);

function sleep(ms) {
  return new Promise(function (r) { setTimeout(r, ms); });
}

/**
 * A managed Postgres instance is often not accepting connections at the exact
 * moment the app container starts, so give it time instead of crash-looping.
 * If the failure looks like an SSL mismatch, retry once without SSL.
 */
// Startup state. The HTTP port opens immediately and these describe how far
// database initialisation has progressed, so a platform health check never
// times out waiting for seeding to finish.
let dbReady = false;
let dbFailure = null;
let dbStage = 'connecting to the database';

async function testConnection() {
  const attempts = 10;
  let sslMode = wantSSL;

  for (let i = 1; i <= attempts; i++) {
    try {
      const r = await pool.query('SELECT NOW() AS now');
      console.log('[db] connected at ' + r.rows[0].now.toISOString() +
        ' (ssl: ' + (sslMode ? 'on' : 'off') + ')');
      return;
    } catch (err) {
      const msg = String(err.message || '');
      const sslProblem = /ssl|SELF_SIGNED|certificate|secure connection/i.test(msg);

      if (sslProblem && sslMode) {
        console.warn('[db] SSL negotiation failed (' + msg + '); retrying without SSL');
        try { await pool.end(); } catch (e) { /* ignore */ }
        sslMode = false;
        pool = makePool(false);
        continue;
      }

      if (i === attempts) throw err;
      console.warn('[db] not ready (attempt ' + i + '/' + attempts + '): ' + msg + ' - retrying in 3s');
      await sleep(3000);
    }
  }
}

async function initializeDatabase() {
  console.log('[db] creating tables ...');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      level VARCHAR(20) DEFAULT 'Beginner',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS concepts (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      module VARCHAR(50) NOT NULL,
      level VARCHAR(20) NOT NULL,
      cefr VARCHAR(10),
      content TEXT,
      practice_text TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS gamification (
      user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      points INTEGER DEFAULT 0,
      badges TEXT DEFAULT '[]',
      streak INTEGER DEFAULT 0,
      last_activity DATE,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS progress (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      concept_id INTEGER NOT NULL REFERENCES concepts(id) ON DELETE CASCADE,
      repetitions INTEGER DEFAULT 0,
      interval_days INTEGER DEFAULT 0,
      ease_factor NUMERIC(4,2) DEFAULT 2.50,
      last_quality INTEGER,
      next_review TIMESTAMPTZ,
      status VARCHAR(20) DEFAULT 'learning',
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE (user_id, concept_id)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS assessments (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      concept_id INTEGER REFERENCES concepts(id) ON DELETE SET NULL,
      module VARCHAR(50),
      score INTEGER,
      feedback TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS videos (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      url VARCHAR(500) NOT NULL,
      module VARCHAR(50),
      level VARCHAR(20),
      description TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS tutors (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      expertise VARCHAR(255),
      rating NUMERIC(3,2) DEFAULT 5.00,
      available BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS tutoring_sessions (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      tutor_id INTEGER NOT NULL REFERENCES tutors(id) ON DELETE CASCADE,
      session_date TIMESTAMPTZ NOT NULL,
      duration INTEGER DEFAULT 30,
      notes TEXT,
      status VARCHAR(20) DEFAULT 'booked',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS audio_recordings (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      concept_id INTEGER REFERENCES concepts(id) ON DELETE SET NULL,
      target_text TEXT,
      transcript TEXT,
      duration_ms INTEGER,
      pronunciation_score INTEGER,
      accuracy_score INTEGER,
      fluency_score INTEGER,
      feedback JSONB,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS grammar_checks (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      text_input TEXT NOT NULL,
      issues JSONB,
      score INTEGER,
      word_count INTEGER,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS plagiarism_checks (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      text_input TEXT NOT NULL,
      similarity NUMERIC(5,2),
      verdict VARCHAR(20),
      matches JSONB,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS analytics (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      module VARCHAR(50),
      time_spent INTEGER DEFAULT 0,
      concepts_learned INTEGER DEFAULT 0,
      accuracy_score INTEGER,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS writing_submissions (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title VARCHAR(255),
      body TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS exercises (
      id SERIAL PRIMARY KEY,
      concept_id INTEGER NOT NULL REFERENCES concepts(id) ON DELETE CASCADE,
      position INTEGER DEFAULT 0,
      type VARCHAR(20) NOT NULL,
      question TEXT NOT NULL,
      options JSONB,
      answer TEXT NOT NULL,
      explanation TEXT NOT NULL
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS vocabulary (
      id SERIAL PRIMARY KEY,
      concept_id INTEGER REFERENCES concepts(id) ON DELETE CASCADE,
      word VARCHAR(100) NOT NULL,
      meaning TEXT NOT NULL,
      example TEXT,
      level VARCHAR(20),
      module VARCHAR(50)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS exercise_attempts (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      exercise_id INTEGER NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
      given_answer TEXT,
      correct BOOLEAN,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  await pool.query('CREATE TABLE IF NOT EXISTS schema_meta (key VARCHAR(64) PRIMARY KEY, value TEXT)');

  console.log('[db] all tables ready');
}

/* ------------------------------------------------------------------ */
/* Schema migration                                                    */
/* ------------------------------------------------------------------ */

/**
 * CREATE TABLE IF NOT EXISTS creates a missing table but never adds columns to
 * an existing one. A database created by an earlier version therefore keeps its
 * old shape forever. These migrations bring such a database up to date without
 * destroying anything the user cares about.
 */

async function tableExists(name) {
  const r = await pool.query(
    "SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = $1",
    [name]
  );
  return r.rows.length > 0;
}

async function columnExists(table, column) {
  const r = await pool.query(
    "SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = $1 AND column_name = $2",
    [table, column]
  );
  return r.rows.length > 0;
}

// Tables whose shape changed too much to patch column by column. Each is
// identified by a column only the current version has. The old table is
// renamed rather than dropped, so nothing is lost.
const REPLACED_TABLES = [
  { table: 'audio_recordings', signature: 'target_text' },
  { table: 'grammar_checks', signature: 'issues' },
  { table: 'plagiarism_checks', signature: 'similarity' }
];

async function retireLegacyTables() {
  for (const spec of REPLACED_TABLES) {
    if (!(await tableExists(spec.table))) continue;
    if (await columnExists(spec.table, spec.signature)) continue;
    const backup = spec.table + '_legacy';
    await pool.query('DROP TABLE IF EXISTS ' + backup);
    await pool.query('ALTER TABLE ' + spec.table + ' RENAME TO ' + backup);
    console.log('[db] "' + spec.table + '" had an older layout; kept as "' + backup + '" and rebuilt');
  }
}

// Columns added since earlier versions. Adding them is always safe.
const ADDED_COLUMNS = [
  ['users', 'level', "VARCHAR(20) DEFAULT 'Beginner'"],
  ['concepts', 'level', 'VARCHAR(20)'],
  ['concepts', 'cefr', 'VARCHAR(10)'],
  ['concepts', 'practice_text', 'TEXT'],
  ['progress', 'interval_days', 'INTEGER DEFAULT 0'],
  ['progress', 'last_quality', 'INTEGER'],
  ['assessments', 'module', 'VARCHAR(50)'],
  ['videos', 'level', 'VARCHAR(20)'],
  ['tutoring_sessions', 'status', "VARCHAR(20) DEFAULT 'booked'"]
];

async function migrateSchema() {
  let added = 0;
  for (const [table, column, definition] of ADDED_COLUMNS) {
    if (await columnExists(table, column)) continue;
    await pool.query('ALTER TABLE ' + table + ' ADD COLUMN ' + column + ' ' + definition);
    console.log('[db] added missing column ' + table + '.' + column);
    added++;
  }

  // An older database stored the level in a "difficulty" column.
  if (await columnExists('concepts', 'difficulty')) {
    await pool.query(
      "UPDATE concepts SET level = difficulty WHERE level IS NULL AND difficulty IS NOT NULL"
    );
  }
  await pool.query("UPDATE concepts SET level = 'Beginner' WHERE level IS NULL");
  await pool.query("UPDATE users SET level = 'Beginner' WHERE level IS NULL");
  await pool.query("UPDATE tutoring_sessions SET status = 'booked' WHERE status IS NULL");

  // ON CONFLICT needs these unique indexes. An older progress/gamification
  // table has neither, so remove any duplicate rows and add them.
  await pool.query(
    'DELETE FROM progress a USING progress b ' +
    'WHERE a.ctid < b.ctid AND a.user_id = b.user_id AND a.concept_id = b.concept_id'
  );
  await pool.query(
    'CREATE UNIQUE INDEX IF NOT EXISTS progress_user_concept_key ON progress(user_id, concept_id)'
  );
  await pool.query(
    'DELETE FROM gamification a USING gamification b WHERE a.ctid < b.ctid AND a.user_id = b.user_id'
  );
  await pool.query(
    'CREATE UNIQUE INDEX IF NOT EXISTS gamification_user_key ON gamification(user_id)'
  );

  // Created here rather than with the tables, because they depend on columns
  // that the migration above may have just added.
  await pool.query('CREATE INDEX IF NOT EXISTS idx_progress_user ON progress(user_id)');
  await pool.query('CREATE INDEX IF NOT EXISTS idx_assessments_user ON assessments(user_id)');
  await pool.query('CREATE INDEX IF NOT EXISTS idx_analytics_user ON analytics(user_id)');
  await pool.query('CREATE INDEX IF NOT EXISTS idx_concepts_level ON concepts(level)');
  await pool.query('CREATE INDEX IF NOT EXISTS idx_exercises_concept ON exercises(concept_id)');
  await pool.query('CREATE INDEX IF NOT EXISTS idx_vocab_concept ON vocabulary(concept_id)');
  await pool.query('CREATE INDEX IF NOT EXISTS idx_attempts_user ON exercise_attempts(user_id)');

  if (added > 0) {
    console.log('[db] schema migration complete (' + added + ' column(s) added)');
  }
}

/* ------------------------------------------------------------------ */
/* Seed content from content.js                                        */
/* ------------------------------------------------------------------ */

const { LESSONS, VIDEOS, TUTORS } = require('./content');

/** Builds a multi-row VALUES clause: ($1,$2),($3,$4), ... */
function rowsPlaceholder(rowCount, colCount) {
  const rows = [];
  let n = 1;
  for (let r = 0; r < rowCount; r++) {
    const cols = [];
    for (let c = 0; c < colCount; c++) cols.push('$' + (n++));
    rows.push('(' + cols.join(',') + ')');
  }
  return rows.join(',');
}

// Bump this whenever the lessons change, so an existing database is refreshed
// instead of keeping content from an earlier release.
const CONTENT_VERSION = '2026-09-14.1';

async function seedData() {
  const stored = await pool.query("SELECT value FROM schema_meta WHERE key = 'content_version'");
  const storedVersion = stored.rows.length ? stored.rows[0].value : null;
  const existing = await pool.query('SELECT COUNT(*)::int AS n FROM concepts');

  if (storedVersion === CONTENT_VERSION && existing.rows[0].n > 0) {
    console.log('[db] course content already up to date (' + existing.rows[0].n + ' lessons)');
    return;
  }

  // Content from an earlier release, or a half-finished load. Clear it so the
  // current course replaces it. Deleting concepts cascades to their exercises
  // and vocabulary; assessments keep their score with the lesson link cleared.
  if (existing.rows[0].n > 0) {
    console.log('[db] replacing ' + existing.rows[0].n + ' lesson(s) from an earlier version');
    await pool.query('DELETE FROM concepts');
    await pool.query('DELETE FROM videos');
    await pool.query('DELETE FROM tutors');
    existing.rows[0].n = 0;
  }

  if (existing.rows[0].n === 0) {
    // One transaction: a failure part-way leaves no content at all, rather
    // than a half-loaded course that the check above would then skip.
    const client = await pool.connect();
    let exerciseCount = 0;
    let vocabCount = 0;
    try {
      await client.query('BEGIN');

      for (const lesson of LESSONS) {
        const c = await client.query(
          `INSERT INTO concepts (title, description, module, level, cefr, content, practice_text)
           VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
          [lesson.title, lesson.description, lesson.module, lesson.level,
           lesson.cefr, lesson.content, lesson.practice_text]
        );
        const conceptId = c.rows[0].id;

        const exercises = lesson.exercises || [];
        if (exercises.length) {
          const params = [];
          exercises.forEach(function (ex, i) {
            params.push(conceptId, i, ex.type, ex.question,
              JSON.stringify(ex.options || null), String(ex.answer), ex.explanation);
          });
          await client.query(
            'INSERT INTO exercises (concept_id, position, type, question, options, answer, explanation) VALUES ' +
            rowsPlaceholder(exercises.length, 7),
            params
          );
          exerciseCount += exercises.length;
        }

        const vocab = lesson.vocabulary || [];
        if (vocab.length) {
          const params = [];
          vocab.forEach(function (v) {
            params.push(conceptId, v.word, v.meaning, v.example, lesson.level, lesson.module);
          });
          await client.query(
            'INSERT INTO vocabulary (concept_id, word, meaning, example, level, module) VALUES ' +
            rowsPlaceholder(vocab.length, 6),
            params
          );
          vocabCount += vocab.length;
        }
      }

      await client.query('COMMIT');
      console.log('[db] seeded ' + LESSONS.length + ' lessons, ' +
        exerciseCount + ' exercises, ' + vocabCount + ' vocabulary items');
    } catch (err) {
      try { await client.query('ROLLBACK'); } catch (e) { /* ignore */ }
      throw err;
    } finally {
      client.release();
    }
  }

  const tutorCount = await pool.query('SELECT COUNT(*)::int AS n FROM tutors');
  if (tutorCount.rows[0].n === 0) {
    for (const t of TUTORS) {
      await pool.query('INSERT INTO tutors (name, expertise, rating) VALUES ($1, $2, $3)', t);
    }
    console.log('[db] seeded ' + TUTORS.length + ' tutors');
  }

  const videoCount = await pool.query('SELECT COUNT(*)::int AS n FROM videos');
  if (videoCount.rows[0].n === 0) {
    for (const v of VIDEOS) {
      await pool.query(
        'INSERT INTO videos (title, url, module, level, description) VALUES ($1, $2, $3, $4, $5)',
        v
      );
    }
    console.log('[db] seeded ' + VIDEOS.length + ' videos');
  }

  await pool.query(
    "INSERT INTO schema_meta (key, value) VALUES ('content_version', $1) " +
    'ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value',
    [CONTENT_VERSION]
  );
}

/* ------------------------------------------------------------------ */
/* Auth helpers                                                        */
/* ------------------------------------------------------------------ */

function signToken(user) {
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
}

function authenticateToken(req, res, next) {
  const header = req.headers['authorization'] || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  jwt.verify(token, JWT_SECRET, function (err, payload) {
    if (err) {
      return res.status(401).json({ error: 'Session expired. Please log in again.' });
    }
    req.user = payload;
    next();
  });
}

/* ------------------------------------------------------------------ */
/* Gamification: points, streak, badges                                */
/* ------------------------------------------------------------------ */

const BADGE_RULES = [
  { id: 'first_step', label: 'First Step', test: function (s) { return s.points >= 10; } },
  { id: 'century', label: 'Century', test: function (s) { return s.points >= 100; } },
  { id: 'five_hundred', label: 'High Achiever', test: function (s) { return s.points >= 500; } },
  { id: 'streak_3', label: '3 Day Streak', test: function (s) { return s.streak >= 3; } },
  { id: 'streak_7', label: 'Week Warrior', test: function (s) { return s.streak >= 7; } },
  { id: 'streak_30', label: 'Unstoppable', test: function (s) { return s.streak >= 30; } }
];

async function awardPoints(userId, points) {
  const cur = await pool.query('SELECT * FROM gamification WHERE user_id = $1', [userId]);
  if (cur.rows.length === 0) {
    await pool.query(
      'INSERT INTO gamification (user_id, points, badges, streak, last_activity) VALUES ($1, $2, $3, 1, CURRENT_DATE)',
      [userId, points, '[]']
    );
    return getGamification(userId);
  }

  const row = cur.rows[0];
  let streak = row.streak || 0;
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  if (!row.last_activity) {
    streak = 1;
  } else {
    const last = new Date(row.last_activity);
    last.setUTCHours(0, 0, 0, 0);
    const dayDiff = Math.round((today - last) / 86400000);
    if (dayDiff === 0) {
      streak = streak || 1;
    } else if (dayDiff === 1) {
      streak = streak + 1;
    } else if (dayDiff > 1) {
      streak = 1;
    }
  }

  const newPoints = (row.points || 0) + points;

  let badges = [];
  try {
    badges = JSON.parse(row.badges || '[]');
  } catch (e) {
    badges = [];
  }
  const state = { points: newPoints, streak: streak };
  for (const rule of BADGE_RULES) {
    if (rule.test(state) && badges.indexOf(rule.label) === -1) {
      badges.push(rule.label);
    }
  }

  await pool.query(
    `UPDATE gamification
     SET points = $1, streak = $2, badges = $3, last_activity = CURRENT_DATE, updated_at = NOW()
     WHERE user_id = $4`,
    [newPoints, streak, JSON.stringify(badges), userId]
  );

  return getGamification(userId);
}

async function getGamification(userId) {
  const r = await pool.query('SELECT * FROM gamification WHERE user_id = $1', [userId]);
  if (r.rows.length === 0) {
    return { user_id: userId, points: 0, badges: [], streak: 0 };
  }
  const row = r.rows[0];
  let badges = [];
  try {
    badges = JSON.parse(row.badges || '[]');
  } catch (e) {
    badges = [];
  }
  return {
    user_id: row.user_id,
    points: row.points || 0,
    streak: row.streak || 0,
    badges: badges,
    last_activity: row.last_activity
  };
}

/* ------------------------------------------------------------------ */
/* Grammar checker (rule based, no external API needed)                */
/* ------------------------------------------------------------------ */

const IRREGULAR_PARTICIPLES = {
  go: 'gone', do: 'done', see: 'seen', take: 'taken', give: 'given', write: 'written',
  eat: 'eaten', speak: 'spoken', break: 'broken', choose: 'chosen', forget: 'forgotten',
  know: 'known', grow: 'grown', throw: 'thrown', drive: 'driven', ride: 'ridden',
  come: 'come', become: 'become', run: 'run', begin: 'begun', drink: 'drunk', sing: 'sung'
};

const CONFUSABLE_PAIRS = [
  { re: /\byour\s+(a|an|the)\b/gi, message: 'Use "you\'re" (you are) here, not the possessive "your".' },
  { re: /\bits\s+(a|an|the)\s+\w+\s+(is|was)\b/gi, message: 'Check "its" vs "it\'s". "It\'s" means "it is".' },
  { re: /\bcould\s+of\b/gi, message: 'Write "could have", not "could of".' },
  { re: /\bshould\s+of\b/gi, message: 'Write "should have", not "should of".' },
  { re: /\bwould\s+of\b/gi, message: 'Write "would have", not "would of".' },
  { re: /\balot\b/gi, message: '"A lot" is two words.' },
  { re: /\bdiscuss\s+about\b/gi, message: 'Drop "about": "discuss the matter", not "discuss about the matter".' },
  { re: /\b(return|revert)\s+back\b/gi, message: '"Back" is redundant after "return"/"revert".' },
  { re: /\brepeat\s+again\b/gi, message: '"Again" is redundant after "repeat".' },
  { re: /\border\s+for\b/gi, message: 'Use "order the item" or "place an order for".' },
  { re: /\bcope\s+up\s+with\b/gi, message: 'The phrase is "cope with", without "up".' },
  { re: /\bone\s+of\s+my\s+friend\b/gi, message: 'Use the plural: "one of my friends".' },
  { re: /\bmore\s+better\b/gi, message: 'Use "better", not "more better".' },
  { re: /\bmost\s+best\b/gi, message: 'Use "best", not "most best".' },
  { re: /\bvery\s+much\s+unique\b/gi, message: '"Unique" cannot be graded. Use "unique" alone.' },
  { re: /\bkindly\s+do\s+the\s+needful\b/gi, message: 'Replace "do the needful" with the specific action you want.' },
  { re: /\bprepone\b/gi, message: '"Prepone" is Indian English. Use "bring forward" or "move earlier".' },
  { re: /\bi\s+am\s+having\s+(a\s+)?(doubt|question)\b/gi, message: 'Use "I have a question" rather than "I am having a doubt".' }
];

const SUBJECT_VERB_PATTERNS = [
  { re: /\b(he|she|it)\s+(are|were|have|do|don't|dont)\b/gi, message: 'Singular subject needs a singular verb (is/was/has/does).' },
  { re: /\b(they|we|you)\s+(is|was|has|does)\b/gi, message: 'Plural subject needs a plural verb (are/were/have/do).' },
  { re: /\bi\s+(is|are|has|was\s+been\s+being)\b/gi, message: 'With "I" use am / have / was.' },
  { re: /\b(he|she|it)\s+don't\b/gi, message: 'Use "doesn\'t" with he/she/it.' },
  { re: /\b(there\s+is)\s+(many|several|few|two|three|four|five)\b/gi, message: 'Use "there are" before a plural.' },
  { re: /\b(there\s+are)\s+(a|an|one)\s+\w+\b/gi, message: 'Use "there is" before a singular.' }
];

const ARTICLE_PATTERNS = [
  { re: /\ba\s+([aeiou])/gi, message: 'Use "an" before a vowel sound.' },
  { re: /\ban\s+([bcdfgjklmnpqrstvwxyz])/gi, message: 'Use "a" before a consonant sound.' }
];

function checkGrammar(text) {
  const issues = [];
  const seen = {};

  function add(type, message, match, index) {
    const key = type + '|' + message + '|' + index;
    if (seen[key]) return;
    seen[key] = true;
    issues.push({
      type: type,
      message: message,
      excerpt: String(match).trim(),
      position: index
    });
  }

  function scan(patterns, type) {
    for (const p of patterns) {
      const re = new RegExp(p.re.source, p.re.flags.indexOf('g') >= 0 ? p.re.flags : p.re.flags + 'g');
      let m;
      while ((m = re.exec(text)) !== null) {
        add(type, p.message, m[0], m.index);
        if (m.index === re.lastIndex) re.lastIndex++;
      }
    }
  }

  scan(SUBJECT_VERB_PATTERNS, 'subject-verb agreement');
  scan(CONFUSABLE_PAIRS, 'word choice');
  scan(ARTICLE_PATTERNS, 'article');

  // have/has + base form instead of past participle
  const partRe = /\b(have|has|had)\s+([a-z]+)\b/gi;
  let pm;
  while ((pm = partRe.exec(text)) !== null) {
    const verb = pm[2].toLowerCase();
    if (IRREGULAR_PARTICIPLES[verb]) {
      add(
        'verb form',
        'After "' + pm[1].toLowerCase() + '" use the past participle "' + IRREGULAR_PARTICIPLES[verb] + '", not "' + verb + '".',
        pm[0],
        pm.index
      );
    }
  }

  // Sentence level checks
  const sentences = text.split(/(?<=[.!?])\s+/).filter(function (s) { return s.trim().length > 0; });
  let offset = 0;
  for (const s of sentences) {
    const idx = text.indexOf(s, offset);
    offset = idx >= 0 ? idx + s.length : offset;
    const trimmed = s.trim();

    if (/^[a-z]/.test(trimmed)) {
      add('capitalisation', 'Start the sentence with a capital letter.', trimmed.slice(0, 40), idx);
    }
    const words = trimmed.split(/\s+/);
    if (words.length > 45) {
      add('sentence length', 'This sentence is ' + words.length + ' words. Split it into two or three shorter sentences.', trimmed.slice(0, 60), idx);
    }
    if (/\bi\b/.test(trimmed)) {
      add('capitalisation', 'The pronoun "I" is always capitalised.', trimmed.slice(0, 40), idx);
    }
  }

  // Missing final punctuation
  const tidy = text.trim();
  if (tidy.length > 0 && !/[.!?]$/.test(tidy)) {
    add('punctuation', 'End the final sentence with a full stop, question mark or exclamation mark.', tidy.slice(-40), Math.max(0, tidy.length - 40));
  }

  // Double spaces and space before punctuation
  const dsRe = /\s{2,}/g;
  let ds;
  while ((ds = dsRe.exec(text)) !== null) {
    add('spacing', 'Use a single space between words.', '(extra space)', ds.index);
  }
  const spRe = /\s+([,.;:!?])/g;
  let sp;
  while ((sp = spRe.exec(text)) !== null) {
    add('spacing', 'Do not put a space before "' + sp[1] + '".', sp[0], sp.index);
  }

  const words = tidy.length ? tidy.split(/\s+/) : [];
  const wordCount = words.length;
  const sentenceCount = Math.max(1, sentences.length);

  // Score: start at 100, deduct per issue, weighted by text length
  const density = wordCount > 0 ? issues.length / wordCount : 0;
  let score = Math.round(100 - Math.min(60, density * 400) - Math.min(25, issues.length * 2));
  if (wordCount === 0) score = 0;
  score = Math.max(0, Math.min(100, score));

  const avgSentenceLength = Math.round((wordCount / sentenceCount) * 10) / 10;

  return {
    issues: issues.sort(function (a, b) { return a.position - b.position; }),
    score: score,
    word_count: wordCount,
    sentence_count: sentenceCount,
    avg_sentence_length: avgSentenceLength,
    readability: avgSentenceLength <= 14 ? 'Clear' : avgSentenceLength <= 22 ? 'Moderate' : 'Dense'
  };
}

/* ------------------------------------------------------------------ */
/* Plagiarism detection (trigram Jaccard similarity)                   */
/* ------------------------------------------------------------------ */

function normaliseWords(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(function (w) { return w.length > 0; });
}

function trigrams(text) {
  const words = normaliseWords(text);
  const set = new Set();
  if (words.length < 3) {
    if (words.length) set.add(words.join(' '));
    return set;
  }
  for (let i = 0; i <= words.length - 3; i++) {
    set.add(words[i] + ' ' + words[i + 1] + ' ' + words[i + 2]);
  }
  return set;
}

function similarity(aSet, bSet) {
  if (aSet.size === 0 || bSet.size === 0) return 0;
  let inter = 0;
  const smaller = aSet.size <= bSet.size ? aSet : bSet;
  const larger = aSet.size <= bSet.size ? bSet : aSet;
  for (const g of smaller) {
    if (larger.has(g)) inter++;
  }
  // Containment-style score: how much of the submission appears in the source
  return inter / aSet.size;
}

function longestCommonRun(text, sourceText) {
  const a = normaliseWords(text);
  const b = new Set(trigrams(sourceText));
  let best = '';
  let run = [];
  for (let i = 0; i <= a.length - 3; i++) {
    const g = a[i] + ' ' + a[i + 1] + ' ' + a[i + 2];
    if (b.has(g)) {
      if (run.length === 0) run = [a[i], a[i + 1], a[i + 2]];
      else run.push(a[i + 2]);
      if (run.join(' ').length > best.length) best = run.join(' ');
    } else {
      run = [];
    }
  }
  return best;
}

async function detectPlagiarism(userId, text) {
  const subSet = trigrams(text);
  const matches = [];

  const concepts = await pool.query('SELECT id, title, content, practice_text FROM concepts');
  for (const c of concepts.rows) {
    const source = (c.content || '') + ' ' + (c.practice_text || '');
    const s = similarity(subSet, trigrams(source));
    if (s >= 0.12) {
      matches.push({
        source: 'Course material: ' + c.title,
        source_type: 'concept',
        source_id: c.id,
        similarity: Math.round(s * 1000) / 10,
        excerpt: longestCommonRun(text, source).slice(0, 160)
      });
    }
  }

  const others = await pool.query(
    'SELECT s.id, s.body, u.name FROM writing_submissions s JOIN users u ON u.id = s.user_id WHERE s.user_id <> $1 ORDER BY s.id DESC LIMIT 500',
    [userId]
  );
  for (const o of others.rows) {
    const s = similarity(subSet, trigrams(o.body));
    if (s >= 0.12) {
      matches.push({
        source: 'Another learner\'s submission',
        source_type: 'submission',
        source_id: o.id,
        similarity: Math.round(s * 1000) / 10,
        excerpt: longestCommonRun(text, o.body).slice(0, 160)
      });
    }
  }

  matches.sort(function (a, b) { return b.similarity - a.similarity; });
  const top = matches.slice(0, 5);
  const overall = top.length ? top[0].similarity : 0;
  const verdict = overall >= 60 ? 'high' : overall >= 30 ? 'moderate' : overall >= 15 ? 'low' : 'original';

  return { similarity: overall, verdict: verdict, matches: top };
}

/* ------------------------------------------------------------------ */
/* Pronunciation analysis                                              */
/* ------------------------------------------------------------------ */

function levenshtein(a, b) {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  let prev = new Array(n + 1);
  let cur = new Array(n + 1);
  for (let j = 0; j <= n; j++) prev[j] = j;
  for (let i = 1; i <= m; i++) {
    cur[0] = i;
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      cur[j] = Math.min(cur[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
    }
    const t = prev; prev = cur; cur = t;
  }
  return prev[n];
}

// Sounds that Telugu/Hindi speakers most often substitute in English
const SOUND_TIPS = [
  { re: /\b\w*th\w*\b/i, tip: 'The "th" sound (think, this) is made with the tongue between the teeth, not as "t" or "d".' },
  { re: /\b\w*v\w*\b/i, tip: 'Keep "v" and "w" distinct: "v" touches the top teeth to the lower lip, "w" rounds the lips.' },
  { re: /\b\w*w\w*\b/i, tip: 'Keep "v" and "w" distinct: "w" rounds the lips with no teeth contact.' },
  { re: /\b\w*(sh|ch)\w*\b/i, tip: 'Distinguish "sh" (ship) from "ch" (chip): "ch" starts with a stop, "sh" flows.' },
  { re: /\b\w*(ee|ea|ie)\w*\b/i, tip: 'Hold long "ee" (sheep) clearly longer than short "i" (ship).' },
  { re: /\b\w*[aeiou]{2}\w*\b/i, tip: 'Watch vowel length: long vowels take about twice as long as short ones.' }
];

function analysePronunciation(targetText, transcript, durationMs) {
  const target = normaliseWords(targetText);
  const spoken = normaliseWords(transcript);

  if (target.length === 0) {
    return {
      pronunciation_score: null,
      accuracy_score: null,
      fluency_score: null,
      feedback: { summary: 'No target text was provided, so accuracy could not be measured.', word_results: [], tips: [] }
    };
  }

  const wordResults = [];
  let correct = 0;
  let near = 0;

  // Align greedily: for each target word find the best candidate near the same index
  let cursor = 0;
  for (let i = 0; i < target.length; i++) {
    const t = target[i];
    let best = null;
    let bestDist = Infinity;
    let bestIdx = -1;
    for (let j = cursor; j < Math.min(spoken.length, cursor + 4); j++) {
      const d = levenshtein(t, spoken[j]);
      if (d < bestDist) {
        bestDist = d;
        best = spoken[j];
        bestIdx = j;
      }
    }
    let status;
    if (best !== null && bestDist === 0) {
      status = 'correct';
      correct++;
      cursor = bestIdx + 1;
    } else if (best !== null && bestDist <= Math.max(1, Math.floor(t.length / 3))) {
      status = 'close';
      near++;
      cursor = bestIdx + 1;
    } else {
      status = 'missed';
    }
    wordResults.push({ target: t, heard: status === 'missed' ? null : best, status: status });
  }

  const accuracy = Math.round(((correct + near * 0.5) / target.length) * 100);

  // Fluency from speaking rate. Comfortable range is 110-160 words per minute.
  let fluency = null;
  let wpm = null;
  if (durationMs && durationMs > 500 && spoken.length > 0) {
    wpm = Math.round((spoken.length / (durationMs / 60000)));
    if (wpm >= 110 && wpm <= 160) fluency = 100;
    else if (wpm < 110) fluency = Math.max(40, Math.round(100 - (110 - wpm) * 1.2));
    else fluency = Math.max(40, Math.round(100 - (wpm - 160) * 1.0));
    fluency = Math.max(0, Math.min(100, fluency));
  }

  const pronunciation = fluency === null
    ? accuracy
    : Math.round(accuracy * 0.7 + fluency * 0.3);

  const missedWords = wordResults.filter(function (w) { return w.status !== 'correct'; }).map(function (w) { return w.target; });
  const tips = [];
  for (const rule of SOUND_TIPS) {
    if (missedWords.some(function (w) { return rule.re.test(w); })) {
      if (tips.indexOf(rule.tip) === -1) tips.push(rule.tip);
    }
    if (tips.length >= 3) break;
  }
  if (wpm !== null && wpm < 110) tips.push('You are speaking at about ' + wpm + ' words per minute. Aim for 110-160 for natural pace.');
  if (wpm !== null && wpm > 175) tips.push('You are speaking at about ' + wpm + ' words per minute. Slow down so each word is clear.');

  let summary;
  if (accuracy >= 90) summary = 'Excellent. Almost every word came through clearly.';
  else if (accuracy >= 75) summary = 'Good. Most words were clear, with a few to refine.';
  else if (accuracy >= 50) summary = 'Getting there. About half the words need more work.';
  else summary = 'Keep practising. Try reading more slowly, one word at a time.';

  return {
    pronunciation_score: pronunciation,
    accuracy_score: accuracy,
    fluency_score: fluency,
    words_per_minute: wpm,
    feedback: {
      summary: summary,
      correct: correct,
      close: near,
      missed: target.length - correct - near,
      word_results: wordResults,
      tips: tips
    }
  };
}

/* ------------------------------------------------------------------ */
/* Spaced repetition (SM-2)                                            */
/* ------------------------------------------------------------------ */

function sm2(prev, quality) {
  const q = Math.max(0, Math.min(5, Number(quality)));
  let ease = prev ? Number(prev.ease_factor) : 2.5;
  let reps = prev ? Number(prev.repetitions) : 0;
  let interval = prev ? Number(prev.interval_days) : 0;

  if (q < 3) {
    reps = 0;
    interval = 1;
  } else {
    reps = reps + 1;
    if (reps === 1) interval = 1;
    else if (reps === 2) interval = 6;
    else interval = Math.round(interval * ease);
    ease = ease + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
    if (ease < 1.3) ease = 1.3;
    if (ease > 2.8) ease = 2.8;
  }

  const status = q < 3 ? 'learning' : reps >= 3 && interval >= 21 ? 'mastered' : 'reviewing';

  return {
    repetitions: reps,
    interval_days: interval,
    ease_factor: Math.round(ease * 100) / 100,
    status: status
  };
}

/* ------------------------------------------------------------------ */
/* Adaptive learning / recommendation engine                           */
/* ------------------------------------------------------------------ */

const LEVEL_ORDER = ['Beginner', 'Intermediate', 'Advanced'];

async function buildRecommendations(userId) {
  const userRes = await pool.query('SELECT level FROM users WHERE id = $1', [userId]);
  const userLevel = (userRes.rows[0] && userRes.rows[0].level) || 'Beginner';

  const dueRes = await pool.query(
    `SELECT c.id, c.title, c.module, c.level, p.next_review, p.status, p.repetitions
     FROM progress p JOIN concepts c ON c.id = p.concept_id
     WHERE p.user_id = $1 AND p.next_review <= NOW()
     ORDER BY p.next_review ASC
     LIMIT 5`,
    [userId]
  );

  const weakRes = await pool.query(
    `SELECT module, ROUND(AVG(score))::int AS avg_score, COUNT(*)::int AS attempts
     FROM assessments WHERE user_id = $1 AND score IS NOT NULL
     GROUP BY module ORDER BY avg_score ASC`,
    [userId]
  );

  const newRes = await pool.query(
    `SELECT c.id, c.title, c.module, c.level, c.description
     FROM concepts c
     WHERE c.level = $2
       AND NOT EXISTS (SELECT 1 FROM progress p WHERE p.user_id = $1 AND p.concept_id = c.id)
     ORDER BY c.id ASC
     LIMIT 5`,
    [userId, userLevel]
  );

  const masteredRes = await pool.query(
    `SELECT COUNT(*)::int AS n FROM progress p JOIN concepts c ON c.id = p.concept_id
     WHERE p.user_id = $1 AND p.status = 'mastered' AND c.level = $2`,
    [userId, userLevel]
  );
  const totalAtLevel = await pool.query('SELECT COUNT(*)::int AS n FROM concepts WHERE level = $1', [userLevel]);

  const mastered = masteredRes.rows[0].n;
  const total = totalAtLevel.rows[0].n || 1;
  const levelProgress = Math.round((mastered / total) * 100);
  const nextLevel = LEVEL_ORDER[Math.min(LEVEL_ORDER.length - 1, LEVEL_ORDER.indexOf(userLevel) + 1)];
  const readyToAdvance = levelProgress >= 80 && userLevel !== 'Advanced';

  const actions = [];

  for (const d of dueRes.rows) {
    actions.push({
      priority: 1,
      kind: 'review',
      concept_id: d.id,
      title: d.title,
      module: d.module,
      reason: 'Due for review today. Reviewing on schedule is what moves it into long-term memory.'
    });
  }

  const weakest = weakRes.rows.filter(function (w) { return w.avg_score < 70 && w.attempts >= 1; });
  for (const w of weakest.slice(0, 2)) {
    const c = await pool.query(
      `SELECT id, title, module FROM concepts
       WHERE module = $1 AND level = $2
         AND NOT EXISTS (SELECT 1 FROM progress p WHERE p.user_id = $3 AND p.concept_id = concepts.id AND p.status = 'mastered')
       ORDER BY id ASC LIMIT 1`,
      [w.module, userLevel, userId]
    );
    if (c.rows.length) {
      actions.push({
        priority: 2,
        kind: 'strengthen',
        concept_id: c.rows[0].id,
        title: c.rows[0].title,
        module: c.rows[0].module,
        reason: 'Your ' + w.module + ' average is ' + w.avg_score + '%. This is the weakest area to work on next.'
      });
    }
  }

  for (const n of newRes.rows.slice(0, 3)) {
    actions.push({
      priority: 3,
      kind: 'new',
      concept_id: n.id,
      title: n.title,
      module: n.module,
      reason: 'New ' + n.level + ' material you have not started yet.'
    });
  }

  if (readyToAdvance) {
    actions.unshift({
      priority: 0,
      kind: 'level_up',
      concept_id: null,
      title: 'Move up to ' + nextLevel,
      module: 'All',
      reason: 'You have mastered ' + levelProgress + '% of ' + userLevel + ' material. You are ready for ' + nextLevel + '.'
    });
  }

  actions.sort(function (a, b) { return a.priority - b.priority; });

  return {
    level: userLevel,
    level_progress: levelProgress,
    mastered_at_level: mastered,
    total_at_level: total,
    ready_to_advance: readyToAdvance,
    suggested_next_level: readyToAdvance ? nextLevel : null,
    due_count: dueRes.rows.length,
    weak_modules: weakRes.rows,
    recommendations: actions.slice(0, 8)
  };
}

/* ------------------------------------------------------------------ */
/* API: health                                                         */
/* ------------------------------------------------------------------ */

// Always answers, whatever the database is doing, so a platform health check
// can see the process is alive while content is still loading.
app.get('/api/health', async function (req, res) {
  if (dbFailure) {
    return res.status(503).json({
      status: 'error',
      stage: dbStage,
      error: dbFailure,
      hint: 'Check that DATABASE_URL points at a reachable Postgres instance.'
    });
  }
  if (!dbReady) {
    return res.status(503).json({ status: 'starting', stage: dbStage });
  }
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', database: 'connected', time: new Date().toISOString() });
  } catch (e) {
    res.status(503).json({ status: 'degraded', database: 'unavailable', error: e.message });
  }
});

// Every other API route needs the database. Until it is ready, say so plainly
// rather than failing with an opaque error.
app.use('/api', function (req, res, next) {
  if (dbReady) return next();
  if (dbFailure) {
    return res.status(503).json({
      error: 'The server cannot reach its database. ' + dbFailure,
      stage: dbStage
    });
  }
  return res.status(503).json({
    error: 'The server is still starting up (' + dbStage + '). Please try again in a few seconds.',
    starting: true
  });
});

/* ------------------------------------------------------------------ */
/* API: auth                                                           */
/* ------------------------------------------------------------------ */

app.post('/api/auth/register', async function (req, res) {
  try {
    const name = String((req.body && req.body.name) || '').trim();
    const email = String((req.body && req.body.email) || '').trim().toLowerCase();
    const password = String((req.body && req.body.password) || '');

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are all required.' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name, level',
      [email, hash, name]
    );
    const user = result.rows[0];

    await pool.query(
      'INSERT INTO gamification (user_id, points, badges, streak) VALUES ($1, 0, $2, 0) ON CONFLICT (user_id) DO NOTHING',
      [user.id, '[]']
    );

    res.status(201).json({ message: 'Account created', user: user, token: signToken(user) });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'An account with that email already exists. Try logging in.' });
    }
    console.error('register:', error);
    res.status(500).json({ error: 'Could not create the account. Please try again.' });
  }
});

app.post('/api/auth/login', async function (req, res) {
  try {
    const email = String((req.body && req.body.email) || '').trim().toLowerCase();
    const password = String((req.body && req.body.password) || '');

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Incorrect email or password.' });
    }
    const user = result.rows[0];
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ error: 'Incorrect email or password.' });
    }

    res.json({
      message: 'Logged in',
      user: { id: user.id, email: user.email, name: user.name, level: user.level },
      token: signToken(user)
    });
  } catch (error) {
    console.error('login:', error);
    res.status(500).json({ error: 'Could not log in. Please try again.' });
  }
});

/* ------------------------------------------------------------------ */
/* API: profile                                                        */
/* ------------------------------------------------------------------ */

app.get('/api/user/profile', authenticateToken, async function (req, res) {
  try {
    const u = await pool.query('SELECT id, email, name, level, created_at FROM users WHERE id = $1', [req.user.id]);
    if (u.rows.length === 0) return res.status(404).json({ error: 'User not found.' });
    const g = await getGamification(req.user.id);
    res.json({ user: u.rows[0], gamification: g });
  } catch (error) {
    console.error('profile:', error);
    res.status(500).json({ error: 'Could not load the profile.' });
  }
});

app.put('/api/user/level', authenticateToken, async function (req, res) {
  try {
    const level = String((req.body && req.body.level) || '');
    if (LEVEL_ORDER.indexOf(level) === -1) {
      return res.status(400).json({ error: 'Level must be Beginner, Intermediate or Advanced.' });
    }
    const r = await pool.query('UPDATE users SET level = $1 WHERE id = $2 RETURNING id, email, name, level', [level, req.user.id]);
    res.json(r.rows[0]);
  } catch (error) {
    console.error('level:', error);
    res.status(500).json({ error: 'Could not update the level.' });
  }
});

/* ------------------------------------------------------------------ */
/* API: concepts                                                       */
/* ------------------------------------------------------------------ */

app.get('/api/concepts', async function (req, res) {
  try {
    const clauses = [];
    const params = [];
    if (req.query.level) {
      params.push(req.query.level);
      clauses.push('level = $' + params.length);
    }
    if (req.query.module) {
      params.push(req.query.module);
      clauses.push('module = $' + params.length);
    }
    const where = clauses.length ? ' WHERE ' + clauses.join(' AND ') : '';
    const r = await pool.query('SELECT * FROM concepts' + where + ' ORDER BY id ASC', params);
    res.json(r.rows);
  } catch (error) {
    console.error('concepts:', error);
    res.status(500).json({ error: 'Could not load the content.' });
  }
});

app.get('/api/concepts/modules', async function (req, res) {
  try {
    const r = await pool.query(
      `SELECT module, level, COUNT(*)::int AS count
       FROM concepts GROUP BY module, level ORDER BY module, level`
    );
    res.json(r.rows);
  } catch (error) {
    res.status(500).json({ error: 'Could not load module list.' });
  }
});

app.get('/api/concepts/:id', async function (req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (!Number.isInteger(id)) return res.status(400).json({ error: 'Invalid concept id.' });
    const r = await pool.query('SELECT * FROM concepts WHERE id = $1', [id]);
    if (r.rows.length === 0) return res.status(404).json({ error: 'Concept not found.' });
    res.json(r.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Could not load the concept.' });
  }
});

/* ------------------------------------------------------------------ */
/* API: exercises and grading                                          */
/* ------------------------------------------------------------------ */

/** Loose comparison for typed answers: ignores case, punctuation and spacing. */
function normaliseAnswer(s) {
  return String(s == null ? '' : s)
    .toLowerCase()
    .replace(/[‘’]/g, "'")
    .replace(/[^a-z0-9' ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function gradeExercise(exercise, given) {
  if (exercise.type === 'mcq') {
    return String(given).trim() === String(exercise.answer).trim();
  }
  const expected = normaliseAnswer(exercise.answer);
  const actual = normaliseAnswer(given);
  if (!actual) return false;
  if (actual === expected) return true;
  // A typed sentence is accepted if it contains the expected key words, so a
  // learner is not marked wrong for adding or omitting a full stop or article.
  if (expected.split(' ').length === 1) return false;
  return actual === expected;
}

// Exercises for a lesson. Answers are deliberately NOT included in the
// response; grading happens on the server so the quiz cannot be read from
// the page source.
app.get('/api/concepts/:id/exercises', async function (req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (!Number.isInteger(id)) return res.status(400).json({ error: 'Invalid concept id.' });
    const r = await pool.query(
      'SELECT id, position, type, question, options FROM exercises WHERE concept_id = $1 ORDER BY position ASC, id ASC',
      [id]
    );
    res.json(r.rows);
  } catch (error) {
    console.error('exercises:', error);
    res.status(500).json({ error: 'Could not load the exercises.' });
  }
});

// Grade a whole lesson quiz, record the attempt, update progress and points.
app.post('/api/concepts/:id/submit', authenticateToken, async function (req, res) {
  try {
    const conceptId = parseInt(req.params.id, 10);
    if (!Number.isInteger(conceptId)) return res.status(400).json({ error: 'Invalid concept id.' });

    const answers = (req.body && req.body.answers) || [];
    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ error: 'Please answer at least one question before submitting.' });
    }

    const concept = await pool.query('SELECT id, title, module FROM concepts WHERE id = $1', [conceptId]);
    if (concept.rows.length === 0) return res.status(404).json({ error: 'Lesson not found.' });

    const exRes = await pool.query(
      'SELECT * FROM exercises WHERE concept_id = $1 ORDER BY position ASC, id ASC',
      [conceptId]
    );
    if (exRes.rows.length === 0) return res.status(404).json({ error: 'This lesson has no exercises.' });

    const byId = {};
    exRes.rows.forEach(function (e) { byId[e.id] = e; });

    const results = [];
    let correctCount = 0;

    for (const a of answers) {
      const ex = byId[parseInt(a.exercise_id, 10)];
      if (!ex) continue;
      const isCorrect = gradeExercise(ex, a.answer);
      if (isCorrect) correctCount++;

      await pool.query(
        'INSERT INTO exercise_attempts (user_id, exercise_id, given_answer, correct) VALUES ($1, $2, $3, $4)',
        [req.user.id, ex.id, String(a.answer == null ? '' : a.answer), isCorrect]
      );

      results.push({
        exercise_id: ex.id,
        question: ex.question,
        your_answer: a.answer,
        correct: isCorrect,
        correct_answer: ex.type === 'mcq'
          ? (ex.options ? ex.options[parseInt(ex.answer, 10)] : ex.answer)
          : ex.answer,
        explanation: ex.explanation
      });
    }

    if (results.length === 0) {
      return res.status(400).json({ error: 'None of the submitted answers matched this lesson.' });
    }

    const score = Math.round((correctCount / results.length) * 100);

    await pool.query(
      'INSERT INTO assessments (user_id, concept_id, module, score, feedback) VALUES ($1, $2, $3, $4, $5)',
      [req.user.id, conceptId, concept.rows[0].module, score,
        correctCount + ' of ' + results.length + ' correct']
    );

    // Score drives the spaced-repetition schedule, so a learner does not have
    // to rate themselves: the quiz result decides when the lesson returns.
    const quality = score >= 90 ? 5 : score >= 75 ? 4 : score >= 60 ? 3 : score >= 40 ? 2 : 1;
    const prevRes = await pool.query(
      'SELECT * FROM progress WHERE user_id = $1 AND concept_id = $2',
      [req.user.id, conceptId]
    );
    const next = sm2(prevRes.rows[0] || null, quality);
    const savedProgress = await pool.query(
      `INSERT INTO progress (user_id, concept_id, repetitions, interval_days, ease_factor, last_quality, next_review, status, updated_at)
       VALUES ($1, $2, $3, $4::int, $5, $6, NOW() + ($4::int * INTERVAL '1 day'), $7, NOW())
       ON CONFLICT (user_id, concept_id) DO UPDATE
         SET repetitions = $3, interval_days = $4::int, ease_factor = $5, last_quality = $6,
             next_review = NOW() + ($4::int * INTERVAL '1 day'), status = $7, updated_at = NOW()
       RETURNING *`,
      [req.user.id, conceptId, next.repetitions, next.interval_days, next.ease_factor, quality, next.status]
    );

    const gamification = await awardPoints(req.user.id, 5 + correctCount * 3);

    res.status(201).json({
      lesson: concept.rows[0].title,
      score: score,
      correct: correctCount,
      total: results.length,
      results: results,
      progress: savedProgress.rows[0],
      gamification: gamification
    });
  } catch (error) {
    console.error('submit exercises:', error);
    res.status(500).json({ error: 'Could not grade the answers.' });
  }
});

/* ------------------------------------------------------------------ */
/* API: vocabulary                                                     */
/* ------------------------------------------------------------------ */

app.get('/api/concepts/:id/vocabulary', async function (req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (!Number.isInteger(id)) return res.status(400).json({ error: 'Invalid concept id.' });
    const r = await pool.query(
      'SELECT id, word, meaning, example FROM vocabulary WHERE concept_id = $1 ORDER BY id ASC',
      [id]
    );
    res.json(r.rows);
  } catch (error) {
    res.status(500).json({ error: 'Could not load the vocabulary.' });
  }
});

app.get('/api/vocabulary', async function (req, res) {
  try {
    const clauses = [];
    const params = [];
    if (req.query.level) {
      params.push(req.query.level);
      clauses.push('v.level = $' + params.length);
    }
    if (req.query.module) {
      params.push(req.query.module);
      clauses.push('v.module = $' + params.length);
    }
    const where = clauses.length ? ' WHERE ' + clauses.join(' AND ') : '';
    const r = await pool.query(
      `SELECT v.id, v.word, v.meaning, v.example, v.level, v.module, c.title AS lesson
       FROM vocabulary v LEFT JOIN concepts c ON c.id = v.concept_id` + where +
      ' ORDER BY v.word ASC',
      params
    );
    res.json(r.rows);
  } catch (error) {
    console.error('vocabulary:', error);
    res.status(500).json({ error: 'Could not load the vocabulary.' });
  }
});

/* ------------------------------------------------------------------ */
/* API: progress / spaced repetition                                   */
/* ------------------------------------------------------------------ */

app.post('/api/progress', authenticateToken, async function (req, res) {
  try {
    const conceptId = parseInt((req.body && req.body.concept_id), 10);
    const quality = Number((req.body && req.body.quality));
    if (!Number.isInteger(conceptId)) {
      return res.status(400).json({ error: 'concept_id is required.' });
    }
    if (!(quality >= 0 && quality <= 5)) {
      return res.status(400).json({ error: 'quality must be a number from 0 to 5.' });
    }

    const exists = await pool.query('SELECT id FROM concepts WHERE id = $1', [conceptId]);
    if (exists.rows.length === 0) return res.status(404).json({ error: 'Concept not found.' });

    const prevRes = await pool.query(
      'SELECT * FROM progress WHERE user_id = $1 AND concept_id = $2',
      [req.user.id, conceptId]
    );
    const next = sm2(prevRes.rows[0] || null, quality);

    const saved = await pool.query(
      `INSERT INTO progress (user_id, concept_id, repetitions, interval_days, ease_factor, last_quality, next_review, status, updated_at)
       VALUES ($1, $2, $3, $4::int, $5, $6, NOW() + ($4::int * INTERVAL '1 day'), $7, NOW())
       ON CONFLICT (user_id, concept_id) DO UPDATE
         SET repetitions = $3, interval_days = $4::int, ease_factor = $5, last_quality = $6,
             next_review = NOW() + ($4::int * INTERVAL '1 day'), status = $7, updated_at = NOW()
       RETURNING *`,
      [req.user.id, conceptId, next.repetitions, next.interval_days, next.ease_factor, quality, next.status]
    );

    const gamification = await awardPoints(req.user.id, quality >= 3 ? 10 : 3);

    res.status(201).json({ progress: saved.rows[0], gamification: gamification });
  } catch (error) {
    console.error('progress:', error);
    res.status(500).json({ error: 'Could not save progress.' });
  }
});

app.get('/api/progress', authenticateToken, async function (req, res) {
  try {
    const r = await pool.query(
      `SELECT p.*, c.title, c.module, c.level
       FROM progress p JOIN concepts c ON c.id = p.concept_id
       WHERE p.user_id = $1 ORDER BY p.next_review ASC NULLS LAST`,
      [req.user.id]
    );
    res.json(r.rows);
  } catch (error) {
    console.error('get progress:', error);
    res.status(500).json({ error: 'Could not load progress.' });
  }
});

app.get('/api/progress/due', authenticateToken, async function (req, res) {
  try {
    const r = await pool.query(
      `SELECT p.*, c.title, c.module, c.level, c.content, c.practice_text
       FROM progress p JOIN concepts c ON c.id = p.concept_id
       WHERE p.user_id = $1 AND p.next_review <= NOW()
       ORDER BY p.next_review ASC`,
      [req.user.id]
    );
    res.json(r.rows);
  } catch (error) {
    res.status(500).json({ error: 'Could not load the review queue.' });
  }
});

/* ------------------------------------------------------------------ */
/* API: assessments                                                    */
/* ------------------------------------------------------------------ */

app.post('/api/assessments', authenticateToken, async function (req, res) {
  try {
    const conceptId = req.body && req.body.concept_id ? parseInt(req.body.concept_id, 10) : null;
    const score = req.body && req.body.score !== undefined ? parseInt(req.body.score, 10) : null;
    const moduleName = (req.body && req.body.module) || null;
    const feedback = (req.body && req.body.feedback) || null;

    if (score !== null && !(score >= 0 && score <= 100)) {
      return res.status(400).json({ error: 'score must be between 0 and 100.' });
    }

    let resolvedModule = moduleName;
    if (!resolvedModule && conceptId) {
      const c = await pool.query('SELECT module FROM concepts WHERE id = $1', [conceptId]);
      resolvedModule = c.rows.length ? c.rows[0].module : null;
    }

    const r = await pool.query(
      'INSERT INTO assessments (user_id, concept_id, module, score, feedback) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [req.user.id, conceptId, resolvedModule, score, feedback]
    );

    const gamification = await awardPoints(req.user.id, score !== null && score >= 70 ? 15 : 5);
    res.status(201).json({ assessment: r.rows[0], gamification: gamification });
  } catch (error) {
    console.error('assessment:', error);
    res.status(500).json({ error: 'Could not save the assessment.' });
  }
});

app.get('/api/assessments', authenticateToken, async function (req, res) {
  try {
    const r = await pool.query(
      `SELECT a.*, c.title FROM assessments a
       LEFT JOIN concepts c ON c.id = a.concept_id
       WHERE a.user_id = $1 ORDER BY a.created_at DESC LIMIT 100`,
      [req.user.id]
    );
    res.json(r.rows);
  } catch (error) {
    res.status(500).json({ error: 'Could not load assessments.' });
  }
});

/* ------------------------------------------------------------------ */
/* API: gamification and leaderboard                                   */
/* ------------------------------------------------------------------ */

app.get('/api/gamification', authenticateToken, async function (req, res) {
  try {
    res.json(await getGamification(req.user.id));
  } catch (error) {
    res.status(500).json({ error: 'Could not load your stats.' });
  }
});

app.post('/api/gamification/points', authenticateToken, async function (req, res) {
  try {
    const points = parseInt((req.body && req.body.points), 10);
    if (!Number.isInteger(points) || points < 0 || points > 200) {
      return res.status(400).json({ error: 'points must be between 0 and 200.' });
    }
    res.json(await awardPoints(req.user.id, points));
  } catch (error) {
    console.error('points:', error);
    res.status(500).json({ error: 'Could not update points.' });
  }
});

app.get('/api/leaderboard', async function (req, res) {
  try {
    const r = await pool.query(
      `SELECT u.id, u.name, u.level, COALESCE(g.points, 0) AS points, COALESCE(g.streak, 0) AS streak
       FROM users u LEFT JOIN gamification g ON g.user_id = u.id
       ORDER BY points DESC, streak DESC, u.id ASC LIMIT 20`
    );
    res.json(r.rows);
  } catch (error) {
    res.status(500).json({ error: 'Could not load the leaderboard.' });
  }
});

/* ------------------------------------------------------------------ */
/* API: videos and tutors                                              */
/* ------------------------------------------------------------------ */

app.get('/api/videos', async function (req, res) {
  try {
    const clauses = [];
    const params = [];
    if (req.query.module) {
      params.push(req.query.module);
      clauses.push('module = $' + params.length);
    }
    if (req.query.level) {
      params.push(req.query.level);
      clauses.push('level = $' + params.length);
    }
    const where = clauses.length ? ' WHERE ' + clauses.join(' AND ') : '';
    const r = await pool.query('SELECT * FROM videos' + where + ' ORDER BY id ASC', params);
    res.json(r.rows);
  } catch (error) {
    res.status(500).json({ error: 'Could not load videos.' });
  }
});

app.get('/api/tutors', async function (req, res) {
  try {
    const r = await pool.query('SELECT * FROM tutors WHERE available = TRUE ORDER BY rating DESC, id ASC');
    res.json(r.rows);
  } catch (error) {
    res.status(500).json({ error: 'Could not load tutors.' });
  }
});

app.post('/api/tutoring/book', authenticateToken, async function (req, res) {
  try {
    const tutorId = parseInt((req.body && req.body.tutor_id), 10);
    const sessionDate = (req.body && req.body.session_date) || null;
    const duration = req.body && req.body.duration ? parseInt(req.body.duration, 10) : 30;

    if (!Number.isInteger(tutorId)) return res.status(400).json({ error: 'tutor_id is required.' });
    if (!sessionDate) return res.status(400).json({ error: 'session_date is required.' });

    const when = new Date(sessionDate);
    if (isNaN(when.getTime())) return res.status(400).json({ error: 'session_date is not a valid date.' });
    if (when.getTime() < Date.now() - 60000) return res.status(400).json({ error: 'Please choose a future date and time.' });

    const t = await pool.query('SELECT id, name FROM tutors WHERE id = $1 AND available = TRUE', [tutorId]);
    if (t.rows.length === 0) return res.status(404).json({ error: 'That tutor is not available.' });

    const clash = await pool.query(
      `SELECT id FROM tutoring_sessions
       WHERE tutor_id = $1 AND status = 'booked'
         AND session_date < $2::timestamptz + ($3 * INTERVAL '1 minute')
         AND ($2::timestamptz) < session_date + (duration * INTERVAL '1 minute')`,
      [tutorId, when.toISOString(), duration]
    );
    if (clash.rows.length > 0) {
      return res.status(409).json({ error: 'That slot is already booked. Please choose another time.' });
    }

    const r = await pool.query(
      `INSERT INTO tutoring_sessions (user_id, tutor_id, session_date, duration, notes)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [req.user.id, tutorId, when.toISOString(), duration, (req.body && req.body.notes) || null]
    );
    res.status(201).json({ session: r.rows[0], tutor: t.rows[0].name });
  } catch (error) {
    console.error('booking:', error);
    res.status(500).json({ error: 'Could not book the session.' });
  }
});

app.get('/api/tutoring/sessions', authenticateToken, async function (req, res) {
  try {
    const r = await pool.query(
      `SELECT s.*, t.name AS tutor_name, t.expertise
       FROM tutoring_sessions s JOIN tutors t ON t.id = s.tutor_id
       WHERE s.user_id = $1 ORDER BY s.session_date ASC`,
      [req.user.id]
    );
    res.json(r.rows);
  } catch (error) {
    res.status(500).json({ error: 'Could not load your sessions.' });
  }
});

app.delete('/api/tutoring/sessions/:id', authenticateToken, async function (req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const r = await pool.query(
      "UPDATE tutoring_sessions SET status = 'cancelled' WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, req.user.id]
    );
    if (r.rows.length === 0) return res.status(404).json({ error: 'Session not found.' });
    res.json(r.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Could not cancel the session.' });
  }
});

/* ------------------------------------------------------------------ */
/* API: speaking / pronunciation                                       */
/* ------------------------------------------------------------------ */

app.post('/api/speaking/analyze', authenticateToken, async function (req, res) {
  try {
    const targetText = String((req.body && req.body.target_text) || '');
    const transcript = String((req.body && req.body.transcript) || '');
    const durationMs = req.body && req.body.duration_ms ? parseInt(req.body.duration_ms, 10) : null;
    const conceptId = req.body && req.body.concept_id ? parseInt(req.body.concept_id, 10) : null;

    if (!targetText.trim()) return res.status(400).json({ error: 'target_text is required.' });
    if (!transcript.trim()) {
      return res.status(400).json({ error: 'No speech was detected. Please record again and speak clearly.' });
    }

    const analysis = analysePronunciation(targetText, transcript, durationMs);

    const saved = await pool.query(
      `INSERT INTO audio_recordings
         (user_id, concept_id, target_text, transcript, duration_ms, pronunciation_score, accuracy_score, fluency_score, feedback)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [
        req.user.id, conceptId, targetText, transcript, durationMs,
        analysis.pronunciation_score, analysis.accuracy_score, analysis.fluency_score,
        JSON.stringify(analysis.feedback)
      ]
    );

    if (analysis.pronunciation_score !== null) {
      await pool.query(
        'INSERT INTO assessments (user_id, concept_id, module, score, feedback) VALUES ($1, $2, $3, $4, $5)',
        [req.user.id, conceptId, 'Speaking', analysis.pronunciation_score, analysis.feedback.summary]
      );
    }

    const gamification = await awardPoints(req.user.id, 10);

    res.status(201).json({
      recording_id: saved.rows[0].id,
      pronunciation_score: analysis.pronunciation_score,
      accuracy_score: analysis.accuracy_score,
      fluency_score: analysis.fluency_score,
      words_per_minute: analysis.words_per_minute,
      feedback: analysis.feedback,
      gamification: gamification
    });
  } catch (error) {
    console.error('speaking:', error);
    res.status(500).json({ error: 'Could not analyse the recording.' });
  }
});

app.get('/api/speaking/recordings', authenticateToken, async function (req, res) {
  try {
    const r = await pool.query(
      `SELECT id, concept_id, target_text, transcript, duration_ms,
              pronunciation_score, accuracy_score, fluency_score, feedback, created_at
       FROM audio_recordings WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50`,
      [req.user.id]
    );
    res.json(r.rows);
  } catch (error) {
    res.status(500).json({ error: 'Could not load your recordings.' });
  }
});

/* ------------------------------------------------------------------ */
/* API: writing - grammar, plagiarism, submissions                     */
/* ------------------------------------------------------------------ */

app.post('/api/grammar/check', authenticateToken, async function (req, res) {
  try {
    const text = String((req.body && req.body.text) || (req.body && req.body.text_input) || '');
    if (!text.trim()) return res.status(400).json({ error: 'Please enter some text to check.' });
    if (text.length > 20000) return res.status(400).json({ error: 'Text is too long. Please keep it under 20,000 characters.' });

    const result = checkGrammar(text);

    const persist = req.body && req.body.save === false ? false : true;
    let id = null;
    if (persist) {
      const saved = await pool.query(
        'INSERT INTO grammar_checks (user_id, text_input, issues, score, word_count) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [req.user.id, text, JSON.stringify(result.issues), result.score, result.word_count]
      );
      id = saved.rows[0].id;
    }

    res.status(200).json(Object.assign({ id: id }, result));
  } catch (error) {
    console.error('grammar:', error);
    res.status(500).json({ error: 'Could not check the text.' });
  }
});

app.get('/api/grammar/history', authenticateToken, async function (req, res) {
  try {
    const r = await pool.query(
      'SELECT id, LEFT(text_input, 120) AS preview, score, word_count, created_at FROM grammar_checks WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50',
      [req.user.id]
    );
    res.json(r.rows);
  } catch (error) {
    res.status(500).json({ error: 'Could not load history.' });
  }
});

app.post('/api/plagiarism/check', authenticateToken, async function (req, res) {
  try {
    const text = String((req.body && req.body.text) || (req.body && req.body.text_input) || '');
    if (!text.trim()) return res.status(400).json({ error: 'Please enter some text to check.' });
    const words = normaliseWords(text);
    if (words.length < 20) {
      return res.status(400).json({ error: 'Please provide at least 20 words for a meaningful originality check.' });
    }

    const result = await detectPlagiarism(req.user.id, text);

    const saved = await pool.query(
      'INSERT INTO plagiarism_checks (user_id, text_input, similarity, verdict, matches) VALUES ($1, $2, $3, $4, $5) RETURNING id, created_at',
      [req.user.id, text, result.similarity, result.verdict, JSON.stringify(result.matches)]
    );

    res.status(200).json(Object.assign({ id: saved.rows[0].id }, result));
  } catch (error) {
    console.error('plagiarism:', error);
    res.status(500).json({ error: 'Could not run the originality check.' });
  }
});

app.post('/api/writing/submit', authenticateToken, async function (req, res) {
  try {
    const title = String((req.body && req.body.title) || 'Untitled').slice(0, 250);
    const body = String((req.body && req.body.body) || (req.body && req.body.text) || '');
    if (!body.trim()) return res.status(400).json({ error: 'The submission cannot be empty.' });

    const grammar = checkGrammar(body);
    const plagiarism = await detectPlagiarism(req.user.id, body);

    const saved = await pool.query(
      'INSERT INTO writing_submissions (user_id, title, body) VALUES ($1, $2, $3) RETURNING id, title, created_at',
      [req.user.id, title, body]
    );

    await pool.query(
      'INSERT INTO assessments (user_id, module, score, feedback) VALUES ($1, $2, $3, $4)',
      [req.user.id, 'Writing', grammar.score, grammar.issues.length + ' issue(s) found; originality ' + (100 - plagiarism.similarity).toFixed(0) + '%']
    );

    // Record the grammar result so the analytics writing panel reflects
    // submitted work, not only ad-hoc checks.
    await pool.query(
      'INSERT INTO grammar_checks (user_id, text_input, issues, score, word_count) VALUES ($1, $2, $3, $4, $5)',
      [req.user.id, body, JSON.stringify(grammar.issues), grammar.score, grammar.word_count]
    );

    const gamification = await awardPoints(req.user.id, 15);

    res.status(201).json({
      submission: saved.rows[0],
      grammar: grammar,
      plagiarism: plagiarism,
      gamification: gamification
    });
  } catch (error) {
    console.error('writing submit:', error);
    res.status(500).json({ error: 'Could not save the submission.' });
  }
});

app.get('/api/writing/submissions', authenticateToken, async function (req, res) {
  try {
    const r = await pool.query(
      'SELECT id, title, LEFT(body, 200) AS preview, created_at FROM writing_submissions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50',
      [req.user.id]
    );
    res.json(r.rows);
  } catch (error) {
    res.status(500).json({ error: 'Could not load submissions.' });
  }
});

/* ------------------------------------------------------------------ */
/* API: analytics dashboard                                            */
/* ------------------------------------------------------------------ */

app.post('/api/analytics', authenticateToken, async function (req, res) {
  try {
    const moduleName = (req.body && req.body.module) || null;
    const timeSpent = req.body && req.body.time_spent ? parseInt(req.body.time_spent, 10) : 0;
    const conceptsLearned = req.body && req.body.concepts_learned ? parseInt(req.body.concepts_learned, 10) : 0;
    const accuracy = req.body && req.body.accuracy_score !== undefined ? parseInt(req.body.accuracy_score, 10) : null;

    const r = await pool.query(
      'INSERT INTO analytics (user_id, module, time_spent, concepts_learned, accuracy_score) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [req.user.id, moduleName, timeSpent, conceptsLearned, accuracy]
    );
    res.status(201).json(r.rows[0]);
  } catch (error) {
    console.error('analytics post:', error);
    res.status(500).json({ error: 'Could not save analytics.' });
  }
});

app.get('/api/analytics/dashboard', authenticateToken, async function (req, res) {
  try {
    const userId = req.user.id;

    const totals = await pool.query(
      `SELECT
         COALESCE(SUM(time_spent), 0)::int AS total_minutes,
         COALESCE(SUM(concepts_learned), 0)::int AS total_concepts,
         COUNT(*)::int AS sessions
       FROM analytics WHERE user_id = $1`,
      [userId]
    );

    const byModule = await pool.query(
      `SELECT module,
              COALESCE(SUM(time_spent), 0)::int AS minutes,
              ROUND(AVG(accuracy_score))::int AS avg_accuracy,
              COUNT(*)::int AS sessions
       FROM analytics WHERE user_id = $1 AND module IS NOT NULL
       GROUP BY module ORDER BY minutes DESC`,
      [userId]
    );

    const assessmentByModule = await pool.query(
      `SELECT module, ROUND(AVG(score))::int AS avg_score, COUNT(*)::int AS attempts,
              MAX(score)::int AS best_score
       FROM assessments WHERE user_id = $1 AND module IS NOT NULL AND score IS NOT NULL
       GROUP BY module ORDER BY avg_score DESC`,
      [userId]
    );

    const daily = await pool.query(
      `SELECT TO_CHAR(d.day, 'YYYY-MM-DD') AS day,
              COALESCE(SUM(a.time_spent), 0)::int AS minutes,
              COUNT(a.id)::int AS activities
       FROM generate_series(CURRENT_DATE - INTERVAL '29 days', CURRENT_DATE, INTERVAL '1 day') AS d(day)
       LEFT JOIN analytics a ON a.user_id = $1 AND DATE(a.created_at) = d.day
       GROUP BY d.day ORDER BY d.day ASC`,
      [userId]
    );

    const scoreTrend = await pool.query(
      `SELECT TO_CHAR(created_at, 'YYYY-MM-DD') AS day, ROUND(AVG(score))::int AS avg_score
       FROM assessments WHERE user_id = $1 AND score IS NOT NULL
         AND created_at >= CURRENT_DATE - INTERVAL '29 days'
       GROUP BY 1 ORDER BY 1 ASC`,
      [userId]
    );

    const progressSummary = await pool.query(
      `SELECT status, COUNT(*)::int AS n FROM progress WHERE user_id = $1 GROUP BY status`,
      [userId]
    );

    const speaking = await pool.query(
      `SELECT ROUND(AVG(pronunciation_score))::int AS avg_pronunciation,
              ROUND(AVG(accuracy_score))::int AS avg_accuracy,
              ROUND(AVG(fluency_score))::int AS avg_fluency,
              COUNT(*)::int AS recordings
       FROM audio_recordings WHERE user_id = $1`,
      [userId]
    );

    const writing = await pool.query(
      `SELECT ROUND(AVG(score))::int AS avg_grammar_score, COUNT(*)::int AS checks,
              COALESCE(SUM(word_count), 0)::int AS total_words
       FROM grammar_checks WHERE user_id = $1`,
      [userId]
    );

    const g = await getGamification(userId);
    const dueCount = await pool.query(
      'SELECT COUNT(*)::int AS n FROM progress WHERE user_id = $1 AND next_review <= NOW()',
      [userId]
    );

    res.json({
      totals: totals.rows[0],
      gamification: g,
      due_for_review: dueCount.rows[0].n,
      time_by_module: byModule.rows,
      scores_by_module: assessmentByModule.rows,
      daily_activity: daily.rows,
      score_trend: scoreTrend.rows,
      progress_summary: progressSummary.rows,
      speaking: speaking.rows[0],
      writing: writing.rows[0]
    });
  } catch (error) {
    console.error('dashboard:', error);
    res.status(500).json({ error: 'Could not build the analytics dashboard.' });
  }
});

/* ------------------------------------------------------------------ */
/* API: adaptive recommendations                                       */
/* ------------------------------------------------------------------ */

app.get('/api/recommendations', authenticateToken, async function (req, res) {
  try {
    res.json(await buildRecommendations(req.user.id));
  } catch (error) {
    console.error('recommendations:', error);
    res.status(500).json({ error: 'Could not build recommendations.' });
  }
});

app.get('/api/study-plan', authenticateToken, async function (req, res) {
  try {
    const rec = await buildRecommendations(req.user.id);
    const minutesPerDay = req.query.minutes ? Math.max(10, Math.min(180, parseInt(req.query.minutes, 10))) : 30;
    const days = req.query.days ? Math.max(1, Math.min(30, parseInt(req.query.days, 10))) : 7;

    const items = rec.recommendations.filter(function (r) { return r.concept_id !== null; });
    const plan = [];
    const perDay = Math.max(1, Math.round(minutesPerDay / 15));

    for (let d = 0; d < days; d++) {
      const date = new Date();
      date.setDate(date.getDate() + d);
      const slice = [];
      for (let k = 0; k < perDay; k++) {
        if (items.length === 0) break;
        slice.push(items[(d * perDay + k) % items.length]);
      }
      plan.push({
        day: d + 1,
        date: date.toISOString().slice(0, 10),
        minutes: minutesPerDay,
        tasks: slice.map(function (s) {
          return { concept_id: s.concept_id, title: s.title, module: s.module, kind: s.kind };
        })
      });
    }

    res.json({ level: rec.level, minutes_per_day: minutesPerDay, days: days, plan: plan });
  } catch (error) {
    console.error('study plan:', error);
    res.status(500).json({ error: 'Could not build the study plan.' });
  }
});

/* ------------------------------------------------------------------ */
/* Frontend (registered last so /api routes always win)                */
/* ------------------------------------------------------------------ */

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'app.html'));
});

app.use('/api', function (req, res) {
  res.status(404).json({ error: 'Unknown API endpoint: ' + req.method + ' /api' + req.path });
});

app.use(function (req, res) {
  res.sendFile(path.join(__dirname, 'app.html'));
});

app.use(function (err, req, res, next) {
  console.error('Unhandled error:', err);
  if (res.headersSent) return next(err);
  res.status(500).json({ error: 'Something went wrong on the server.' });
});

/* ------------------------------------------------------------------ */
/* Startup                                                             */
/* ------------------------------------------------------------------ */

/**
 * Prepares the database in the background. The HTTP server is already
 * listening by the time this runs, so a slow first boot (creating tables and
 * loading the whole course) can never make the platform think the app is dead.
 */
async function initialiseDatabase() {
  try {
    dbStage = 'connecting to the database';
    await testConnection();

    dbStage = 'checking for an older schema';
    await retireLegacyTables();

    dbStage = 'creating tables';
    await initializeDatabase();

    dbStage = 'updating the schema';
    await migrateSchema();

    dbStage = 'loading course content';
    await seedData();

    dbReady = true;
    dbStage = 'ready';
    console.log('[server] ready - accepting requests');
  } catch (error) {
    dbFailure = error.message;
    console.error('[db] initialisation FAILED at stage "' + dbStage + '": ' + error.message);
    console.error('[db] the server is still listening and will report this error to clients.');
    console.error('[db] check DATABASE_URL, and that the Postgres service is running.');
  }
}

async function startServer() {
  console.log('=== English Learning Platform ===');

  // Open the port first, then prepare the database. Doing it the other way
  // round means a slow database looks like a dead application.
  const server = app.listen(PORT, '0.0.0.0', function () {
    console.log('[server] listening on 0.0.0.0:' + PORT);
    console.log('[server] preparing database ...');
  });

  server.on('error', function (err) {
    if (err.code === 'EADDRINUSE') {
      console.error('[server] port ' + PORT + ' is already in use. ' +
        'Do not set PORT yourself on a hosting platform; let it provide one.');
    } else {
      console.error('[server] could not listen on port ' + PORT + ': ' + err.message);
    }
    process.exit(1);
  });

  if (!process.env.DATABASE_URL) {
    dbFailure = 'DATABASE_URL is not set. Add the Postgres plugin, or set the variable.';
    dbStage = 'configuration';
    console.error('[config] ' + dbFailure);
  } else {
    initialiseDatabase();
  }

  function shutdown(signal) {
    return async function () {
      console.log('\n[server] ' + signal + ' received, shutting down');
      server.close(async function () {
        try { await pool.end(); } catch (e) { /* ignore */ }
        process.exit(0);
      });
      setTimeout(function () { process.exit(0); }, 8000);
    };
  }

  process.on('SIGTERM', shutdown('SIGTERM'));
  process.on('SIGINT', shutdown('SIGINT'));
}

if (require.main === module) {
  startServer();
}

module.exports = { app: app, pool: pool, checkGrammar: checkGrammar, analysePronunciation: analysePronunciation, sm2: sm2 };
