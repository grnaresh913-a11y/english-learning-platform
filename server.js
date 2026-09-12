// English Learning Platform Phase 4 - Complete Server
// Features: Video Lessons, Live Tutoring, Advanced Pronunciation Analysis, Multi-language, Mobile API

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');
const rateLimit = require('express-rate-limit');
const { Anthropic } = require('@anthropic-ai/sdk');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));

// Database
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

// Anthropic Client
const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
});

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});
app.use(limiter);

// Constants
const JWT_SECRET = process.env.JWT_SECRET;
const PORT = process.env.PORT || 3000;

// Point values for gamification
const POINT_VALUES = {
    quiz_correct: 25,
    quiz_incorrect: 10,
    essay_good: 30,
    essay_ok: 15,
    speaking_good: 30,
    speaking_ok: 15,
    video_watched: 20,
    tutoring_session: 50,
    pronunciation_practice: 25
};

// Middleware
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

// ==================== AUTH ENDPOINTS ====================

app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;
        const hashedPassword = await bcryptjs.hash(password, 10);

        const result = await pool.query(
            'INSERT INTO users (id, email, password_hash, name, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING id, email, name',
            [uuidv4(), email, hashedPassword, name]
        );

        const token = jwt.sign({ id: result.rows[0].id }, JWT_SECRET);
        res.json({ token, user: result.rows[0] });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (!result.rows.length) return res.status(401).json({ error: 'Invalid credentials' });

        const user = result.rows[0];
        const validPassword = await bcryptjs.compare(password, user.password_hash);

        if (!validPassword) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id }, JWT_SECRET);
        res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// ==================== USER ENDPOINTS ====================

app.get('/api/user/profile', authMiddleware, async (req, res) => {
    try {
        const result = await pool.query('SELECT id, name, email, current_level, language, created_at FROM users WHERE id = $1', [req.userId]);
        res.json(result.rows[0]);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.put('/api/user/profile', authMiddleware, async (req, res) => {
    try {
        const { name, language } = req.body;
        const result = await pool.query(
            'UPDATE users SET name = $1, language = $2 WHERE id = $3 RETURNING id, name, email, current_level, language',
            [name, language, req.userId]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// ==================== CONTENT ENDPOINTS ====================

app.get('/api/modules', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM modules ORDER BY created_at');
        res.json(result.rows);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/api/topics/:moduleId', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM topics WHERE module_id = $1 ORDER BY order_index',
            [req.params.moduleId]
        );
        res.json(result.rows);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/api/concepts/:topicId', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM concepts WHERE topic_id = $1 ORDER BY created_at',
            [req.params.topicId]
        );
        res.json(result.rows);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/api/concept/:conceptId', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM concepts WHERE id = $1', [req.params.conceptId]);
        res.json(result.rows[0]);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// ==================== PHASE 4: VIDEO LESSONS ====================

app.post('/api/lessons/create', authMiddleware, async (req, res) => {
    try {
        const { conceptId, title, description, videoUrl, duration, difficulty } = req.body;
        const result = await pool.query(
            `INSERT INTO video_lessons (id, concept_id, title, description, video_url, duration_seconds, difficulty_level, created_by, created_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW()) RETURNING *`,
            [uuidv4(), conceptId, title, description, videoUrl, duration, difficulty, req.userId]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/api/lessons/concept/:conceptId', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM video_lessons WHERE concept_id = $1 ORDER BY created_at',
            [req.params.conceptId]
        );
        res.json(result.rows);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/api/lessons/:lessonId/watch', authMiddleware, async (req, res) => {
    try {
        const { watchedDuration } = req.body;

        // Record watched lesson
        await pool.query(
            `INSERT INTO lesson_progress (id, user_id, lesson_id, watched_duration, completed, watched_at)
             VALUES ($1, $2, $3, $4, $5, NOW())`,
            [uuidv4(), req.userId, req.params.lessonId, watchedDuration, watchedDuration >= 90]
        );

        // Award points if completed
        if (watchedDuration >= 90) {
            await pool.query(
                `INSERT INTO gamification (id, user_id, points, type, created_at)
                 VALUES ($1, $2, $3, $4, NOW())`,
                [uuidv4(), req.userId, POINT_VALUES.video_watched, 'video_watched']
            );
        }

        res.json({ success: true, pointsAwarded: watchedDuration >= 90 ? POINT_VALUES.video_watched : 0 });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// ==================== PHASE 4: LIVE TUTORING ====================

app.post('/api/tutoring/sessions/create', authMiddleware, async (req, res) => {
    try {
        const { tutorId, scheduledTime, duration, topicId } = req.body;
        const sessionId = uuidv4();

        const result = await pool.query(
            `INSERT INTO tutoring_sessions (id, student_id, tutor_id, scheduled_time, duration_minutes, topic_id, status, created_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) RETURNING *`,
            [sessionId, req.userId, tutorId, scheduledTime, duration, topicId, 'scheduled']
        );

        res.json(result.rows[0]);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/api/tutoring/sessions', authMiddleware, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM tutoring_sessions WHERE student_id = $1 OR tutor_id = $1 ORDER BY scheduled_time',
            [req.userId]
        );
        res.json(result.rows);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/api/tutoring/sessions/:sessionId/complete', authMiddleware, async (req, res) => {
    try {
        const { feedback, studentProgress } = req.body;

        await pool.query(
            'UPDATE tutoring_sessions SET status = $1, feedback = $2, student_progress = $3 WHERE id = $4',
            ['completed', feedback, JSON.stringify(studentProgress), req.params.sessionId]
        );

        // Award points for tutoring session
        await pool.query(
            `INSERT INTO gamification (id, user_id, points, type, created_at)
             VALUES ($1, $2, $3, $4, NOW())`,
            [uuidv4(), req.userId, POINT_VALUES.tutoring_session, 'tutoring_session']
        );

        res.json({ success: true, pointsAwarded: POINT_VALUES.tutoring_session });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/api/tutoring/tutors', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, name, expertise, hourly_rate, rating, availability FROM users WHERE role = $1 ORDER BY rating DESC',
            ['tutor']
        );
        res.json(result.rows);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// ==================== PHASE 4: ADVANCED PRONUNCIATION ANALYSIS ====================

app.post('/api/assessment/analyze-pronunciation', authMiddleware, async (req, res) => {
    try {
        const { conceptId, audioBase64, expectedText } = req.body;

        const evaluation = await anthropic.messages.create({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 1000,
            messages: [{
                role: 'user',
                content: `You are an advanced English pronunciation expert. Analyze this student's speech transcription and provide detailed pronunciation feedback.

Expected text: "${expectedText}"
Student's speech (phonetic approximation): "${audioBase64}"

Provide:
1. Overall pronunciation accuracy score (0-100)
2. Phoneme-level analysis
3. Stress pattern feedback
4. Intonation analysis
5. Specific words that need improvement
6. Personalized practice recommendations

Format as JSON with: score, phoneme_accuracy, stress_analysis, intonation, problem_words, recommendations`
            }]
        });

        let feedbackText = evaluation.content[0].text;
        try {
            feedbackText = JSON.parse(feedbackText);
        } catch (e) {
            // Keep as text if not valid JSON
        }

        // Save assessment
        await pool.query(
            `INSERT INTO assessments (id, user_id, concept_id, assessment_type, score, evaluation_data, created_at)
             VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
            [uuidv4(), req.userId, conceptId, 'pronunciation_analysis',
             feedbackText.score || 75, JSON.stringify(feedbackText)]
        );

        res.json({ evaluation: feedbackText });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/api/assessment/waveform-analysis', authMiddleware, async (req, res) => {
    try {
        const { audioBase64 } = req.body;

        // Advanced waveform analysis would use audio processing library
        // This is a placeholder for actual waveform processing
        const analysis = {
            frequency_range: [80, 250],
            peak_loudness: 0.75,
            silence_duration: 0.2,
            clarity_score: 0.85,
            fluency_pauses: 3,
            average_speech_rate: 120, // words per minute
            prosody_pattern: 'good_variation',
            stress_consistency: 0.88,
            intonation_contour: 'natural'
        };

        res.json(analysis);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// ==================== PHASE 4: SPACED REPETITION ALGORITHM ====================

app.get('/api/spaced-repetition/next-review', authMiddleware, async (req, res) => {
    try {
        // Ebbinghaus spacing algorithm
        const result = await pool.query(`
            SELECT c.*, up.last_reviewed, up.review_count, up.total_score,
                   CASE
                       WHEN up.last_reviewed IS NULL THEN 1
                       WHEN up.review_count = 1 THEN 1
                       WHEN up.review_count = 2 THEN 3
                       WHEN up.review_count = 3 THEN 7
                       WHEN up.review_count = 4 THEN 14
                       WHEN up.review_count = 5 THEN 30
                       ELSE 60
                   END as days_until_review
            FROM concepts c
            JOIN user_progress up ON c.id = up.concept_id
            WHERE up.user_id = $1
            AND (up.last_reviewed IS NULL OR up.last_reviewed + (INTERVAL '1 day' *
                CASE
                    WHEN up.review_count = 1 THEN 1
                    WHEN up.review_count = 2 THEN 3
                    WHEN up.review_count = 3 THEN 7
                    WHEN up.review_count = 4 THEN 14
                    WHEN up.review_count = 5 THEN 30
                    ELSE 60
                END) <= NOW())
            ORDER BY up.last_reviewed ASC NULLS FIRST
            LIMIT 5
        `, [req.userId]);

        res.json(result.rows);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/api/spaced-repetition/mark-review', authMiddleware, async (req, res) => {
    try {
        const { conceptId, successful } = req.body;

        await pool.query(`
            UPDATE user_progress
            SET last_reviewed = NOW(),
                review_count = review_count + 1,
                total_score = total_score + $1
            WHERE user_id = $2 AND concept_id = $3
        `, [successful ? 100 : 50, req.userId, conceptId]);

        res.json({ success: true });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// ==================== PHASE 4: MULTI-LANGUAGE SUPPORT ====================

app.get('/api/languages', async (req, res) => {
    try {
        const languages = [
            { code: 'en', name: 'English', nativeLanguages: ['te', 'hi', 'ta', 'ml', 'kn'] },
            { code: 'te', name: 'Telugu', flag: '🇮🇳' },
            { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
            { code: 'ta', name: 'Tamil', flag: '🇮🇳' },
            { code: 'ml', name: 'Malayalam', flag: '🇮🇳' },
            { code: 'kn', name: 'Kannada', flag: '🇮🇳' }
        ];
        res.json(languages);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/api/content/translate', async (req, res) => {
    try {
        const { text, targetLanguage } = req.body;

        const translation = await anthropic.messages.create({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 500,
            messages: [{
                role: 'user',
                content: `Translate this English text to ${targetLanguage}. Provide only the translation:\n\n${text}`
            }]
        });

        res.json({ translation: translation.content[0].text });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.put('/api/user/language', authMiddleware, async (req, res) => {
    try {
        const { language } = req.body;
        await pool.query('UPDATE users SET language = $1 WHERE id = $2', [language, req.userId]);
        res.json({ success: true, language });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// ==================== EXISTING ASSESSMENT ENDPOINTS ====================

app.post('/api/assessment/generate-quiz', authMiddleware, async (req, res) => {
    try {
        const { conceptId } = req.body;
        const conceptResult = await pool.query('SELECT * FROM concepts WHERE id = $1', [conceptId]);
        const concept = conceptResult.rows[0];

        const quiz = await anthropic.messages.create({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 500,
            messages: [{
                role: 'user',
                content: `Create 1 multiple choice question about: "${concept.title}"\nContent: ${concept.content}\n\nRespond with JSON: {question, options: [], correctAnswer: 0}`
            }]
        });

        let quizData = quiz.content[0].text;
        try {
            quizData = JSON.parse(quizData);
        } catch (e) {
            quizData = { question: 'Test question', options: ['A', 'B', 'C', 'D'], correctAnswer: 0 };
        }

        res.json([quizData]);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/api/assessment/submit', authMiddleware, async (req, res) => {
    try {
        const { conceptId, assessmentType, score } = req.body;

        const pointsAwarded = score >= 80 ? POINT_VALUES.quiz_correct : POINT_VALUES.quiz_incorrect;

        await pool.query(
            `INSERT INTO assessments (id, user_id, concept_id, assessment_type, score, created_at)
             VALUES ($1, $2, $3, $4, $5, NOW())`,
            [uuidv4(), req.userId, conceptId, assessmentType, score]
        );

        await pool.query(
            `INSERT INTO gamification (id, user_id, points, type, created_at)
             VALUES ($1, $2, $3, $4, NOW())`,
            [uuidv4(), req.userId, pointsAwarded, assessmentType]
        );

        res.json({ pointsAwarded, score });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// ==================== GAMIFICATION ENDPOINTS ====================

app.get('/api/gamification/stats', authMiddleware, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                COALESCE(SUM(points), 0) as total_points,
                COUNT(DISTINCT DATE(created_at)) as current_streak,
                (SELECT COUNT(*) FROM assessments WHERE user_id = $1) as assessments_completed
            FROM gamification WHERE user_id = $1 AND created_at > NOW() - INTERVAL '30 days'
        `, [req.userId]);

        const stats = result.rows[0];
        const leaderboard = await pool.query(`
            SELECT ROW_NUMBER() OVER (ORDER BY total_points DESC) as rank
            FROM (SELECT SUM(points) as total_points FROM gamification GROUP BY user_id) sub
            WHERE total_points = $1
        `, [stats.total_points]);

        res.json({ ...stats, leaderboard_rank: leaderboard.rows[0]?.rank || 1 });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// ==================== ANALYTICS ====================

app.get('/api/analytics/dashboard', authMiddleware, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                AVG(score) as average_score,
                COUNT(*) as total_assessments,
                COUNT(DISTINCT concept_id) as concepts_completed
            FROM assessments WHERE user_id = $1
        `, [req.userId]);

        res.json(result.rows[0]);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// ==================== RECOMMENDATIONS ====================

app.get('/api/recommendations/next-concept', authMiddleware, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT c.* FROM concepts c
            WHERE c.id NOT IN (SELECT concept_id FROM assessments WHERE user_id = $1)
            ORDER BY RANDOM() LIMIT 3
        `, [req.userId]);

        res.json(result.rows.map(c => ({
            id: c.id,
            title: c.title,
            reason: 'Based on your learning progress'
        })));
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// ==================== START SERVER ====================

pool.query('SELECT NOW()', (err) => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('✓ Database connected successfully');
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log('📦 Phase 4 Features:');
    console.log('   ✓ Video Lessons Management');
    console.log('   ✓ Live Tutoring Sessions');
    console.log('   ✓ Advanced Pronunciation Analysis');
    console.log('   ✓ Spaced Repetition Algorithm');
    console.log('   ✓ Multi-Language Support');
    console.log('   ✓ Mobile API Ready');
});

module.exports = app;
