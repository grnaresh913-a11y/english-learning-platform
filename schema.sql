-- English Learning Platform Phase 4 - Database Schema
-- Includes all Phase 1-3 features plus Phase 4 enhancements
-- Video Lessons, Live Tutoring, Advanced Pronunciation, Spaced Repetition, Multi-language

-- ==================== USERS TABLE ====================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    current_level VARCHAR(50) DEFAULT 'BASIC',
    language VARCHAR(10) DEFAULT 'en',
    role VARCHAR(50) DEFAULT 'student', -- student, tutor, admin
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================== MODULES, TOPICS, CONCEPTS ====================
CREATE TABLE IF NOT EXISTS modules (
    id UUID PRIMARY KEY,
    type VARCHAR(50) NOT NULL, -- reading, writing, speaking
    title VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS topics (
    id UUID PRIMARY KEY,
    module_id UUID REFERENCES modules(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    difficulty_level VARCHAR(50),
    order_index INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS concepts (
    id UUID PRIMARY KEY,
    topic_id UUID REFERENCES topics(id),
    title VARCHAR(255) NOT NULL,
    content TEXT,
    examples TEXT,
    difficulty_level VARCHAR(50),
    estimated_time_minutes INT,
    video_lesson_id UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================== PHASE 4: VIDEO LESSONS ====================
CREATE TABLE IF NOT EXISTS video_lessons (
    id UUID PRIMARY KEY,
    concept_id UUID REFERENCES concepts(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    video_url VARCHAR(500),
    transcript TEXT,
    duration_seconds INT,
    difficulty_level VARCHAR(50),
    created_by UUID REFERENCES users(id),
    view_count INT DEFAULT 0,
    rating DECIMAL(3,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS lesson_progress (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    lesson_id UUID REFERENCES video_lessons(id),
    watched_duration INT, -- in seconds
    completed BOOLEAN DEFAULT FALSE,
    notes TEXT,
    watched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================== PHASE 4: LIVE TUTORING ====================
CREATE TABLE IF NOT EXISTS tutoring_sessions (
    id UUID PRIMARY KEY,
    student_id UUID REFERENCES users(id),
    tutor_id UUID REFERENCES users(id),
    scheduled_time TIMESTAMP NOT NULL,
    duration_minutes INT,
    topic_id UUID REFERENCES topics(id),
    status VARCHAR(50) DEFAULT 'scheduled', -- scheduled, ongoing, completed, cancelled
    room_id VARCHAR(255), -- for video conferencing integration
    feedback TEXT,
    student_progress JSONB,
    rating INT, -- 1-5 star rating
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- ==================== PHASE 4: TUTOR PROFILES ====================
CREATE TABLE IF NOT EXISTS tutor_profiles (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id) UNIQUE,
    bio TEXT,
    expertise JSONB, -- array of topics/languages
    hourly_rate DECIMAL(10,2),
    availability JSONB, -- weekly schedule
    total_sessions INT DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================== PHASE 4: PRONUNCIATION ANALYSIS ====================
CREATE TABLE IF NOT EXISTS pronunciation_records (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    concept_id UUID REFERENCES concepts(id),
    audio_url VARCHAR(500),
    transcription TEXT,
    expected_text TEXT,
    accuracy_score INT,
    phoneme_analysis JSONB,
    stress_analysis JSONB,
    intonation_score INT,
    fluency_score INT,
    clarity_score INT,
    problem_words TEXT[],
    suggestions TEXT[],
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================== PHASE 4: SPACED REPETITION ====================
CREATE TABLE IF NOT EXISTS spaced_repetition (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    concept_id UUID REFERENCES concepts(id),
    review_count INT DEFAULT 0,
    last_reviewed TIMESTAMP,
    next_review TIMESTAMP,
    interval INT DEFAULT 1, -- days
    ease_factor DECIMAL(3,2) DEFAULT 2.5, -- SM-2 algorithm
    quality INT, -- 0-5 for SM-2
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================== ASSESSMENTS ====================
CREATE TABLE IF NOT EXISTS assessments (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    concept_id UUID REFERENCES concepts(id),
    assessment_type VARCHAR(50), -- quiz, essay, speaking, video_review, tutoring
    score INT,
    evaluation_data JSONB,
    duration_seconds INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================== USER PROGRESS ====================
CREATE TABLE IF NOT EXISTS user_progress (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    concept_id UUID REFERENCES concepts(id),
    total_attempts INT DEFAULT 0,
    best_score INT DEFAULT 0,
    total_score INT DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    mastery_level VARCHAR(50), -- beginner, intermediate, advanced, mastered
    last_attempted TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, concept_id)
);

-- ==================== GAMIFICATION ====================
CREATE TABLE IF NOT EXISTS gamification (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    points INT,
    type VARCHAR(50), -- quiz_correct, essay, speaking, video_watched, tutoring_session, etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS achievements (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    achievement_name VARCHAR(255),
    description TEXT,
    icon VARCHAR(10),
    unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================== ANALYTICS ====================
CREATE TABLE IF NOT EXISTS learning_analytics (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    date DATE DEFAULT CURRENT_DATE,
    concepts_completed INT DEFAULT 0,
    average_score DECIMAL(5,2) DEFAULT 0,
    time_spent_minutes INT DEFAULT 0,
    assessments_taken INT DEFAULT 0,
    videos_watched INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, date)
);

-- ==================== INDICES FOR PERFORMANCE ====================
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_concepts_topic ON concepts(topic_id);
CREATE INDEX IF NOT EXISTS idx_concepts_difficulty ON concepts(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_assessments_user ON assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_assessments_concept ON assessments(concept_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_gamification_user ON gamification(user_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_user ON lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_tutoring_sessions_student ON tutoring_sessions(student_id);
CREATE INDEX IF NOT EXISTS idx_tutoring_sessions_tutor ON tutoring_sessions(tutor_id);
CREATE INDEX IF NOT EXISTS idx_spaced_repetition_user ON spaced_repetition(user_id);
CREATE INDEX IF NOT EXISTS idx_spaced_repetition_next_review ON spaced_repetition(next_review);
CREATE INDEX IF NOT EXISTS idx_pronunciation_user ON pronunciation_records(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_analytics_user_date ON learning_analytics(user_id, date);

-- ==================== SEED DATA ====================

-- Modules
INSERT INTO modules (id, type, title, description, icon) VALUES
('mod-reading-001', 'reading', '📖 Reading', 'Build comprehension and vocabulary through interactive reading exercises', '📖'),
('mod-writing-001', 'writing', '✍️ Writing', 'Master essay writing and grammar with AI-powered feedback', '✍️'),
('mod-speaking-001', 'speaking', '🎤 Speaking', 'Improve pronunciation and fluency with audio recording and analysis', '🎤')
ON CONFLICT DO NOTHING;

-- Reading Topics
INSERT INTO topics (id, module_id, title, description, difficulty_level, order_index) VALUES
('topic-reading-basic-001', 'mod-reading-001', 'Parts of Speech', 'Learn nouns, verbs, adjectives, adverbs', 'BASIC', 1),
('topic-reading-basic-002', 'mod-reading-001', 'Basic Sentence Structure', 'Understanding simple and compound sentences', 'BASIC', 2),
('topic-reading-basic-003', 'mod-reading-001', 'Vocabulary Essentials', 'Build core vocabulary for everyday communication', 'BASIC', 3),
('topic-reading-basic-004', 'mod-reading-001', 'Reading Comprehension', 'Practice reading short passages and answering questions', 'BASIC', 4),
('topic-reading-inter-001', 'mod-reading-001', 'Verb Tenses', 'Master past, present, and future tenses', 'INTERMEDIATE', 5),
('topic-reading-inter-002', 'mod-reading-001', 'Prepositions & Articles', 'Understanding articles and prepositions in context', 'INTERMEDIATE', 6),
('topic-reading-inter-003', 'mod-reading-001', 'Advanced Vocabulary', 'Expand vocabulary for academic and professional contexts', 'INTERMEDIATE', 7),
('topic-reading-inter-004', 'mod-reading-001', 'Complex Texts', 'Read and analyze complex English passages', 'INTERMEDIATE', 8),
('topic-reading-adv-001', 'mod-reading-001', 'Idioms & Expressions', 'Learn common idioms and colloquial expressions', 'ADVANCED', 9),
('topic-reading-adv-002', 'mod-reading-001', 'Phrasal Verbs', 'Master phrasal verbs and their multiple meanings', 'ADVANCED', 10),
('topic-reading-adv-003', 'mod-reading-001', 'Literary Analysis', 'Analyze literary texts and writing styles', 'ADVANCED', 11),
('topic-reading-adv-004', 'mod-reading-001', 'Academic English', 'Read and understand academic papers and articles', 'ADVANCED', 12)
ON CONFLICT DO NOTHING;

-- Writing Topics
INSERT INTO topics (id, module_id, title, description, difficulty_level, order_index) VALUES
('topic-writing-basic-001', 'mod-writing-001', 'Grammar Fundamentals', 'Master basic grammar rules and sentence construction', 'BASIC', 1),
('topic-writing-basic-002', 'mod-writing-001', 'Punctuation & Capitalization', 'Learn correct punctuation and capitalization rules', 'BASIC', 2),
('topic-writing-basic-003', 'mod-writing-001', 'Simple Paragraphs', 'Learn to write clear and organized paragraphs', 'BASIC', 3),
('topic-writing-basic-004', 'mod-writing-001', 'Email & Messages', 'Master professional and casual written communication', 'BASIC', 4),
('topic-writing-inter-001', 'mod-writing-001', 'Essay Structure', 'Learn to structure essays with thesis and arguments', 'INTERMEDIATE', 5),
('topic-writing-inter-002', 'mod-writing-001', 'Advanced Grammar', 'Complex sentence structures and advanced grammar', 'INTERMEDIATE', 6),
('topic-writing-inter-003', 'mod-writing-001', 'Writing Style', 'Develop your unique writing voice and style', 'INTERMEDIATE', 7),
('topic-writing-inter-004', 'mod-writing-001', 'Argumentative Writing', 'Master persuasive and argumentative writing', 'INTERMEDIATE', 8),
('topic-writing-adv-001', 'mod-writing-001', 'Creative Writing', 'Express yourself through creative writing', 'ADVANCED', 9),
('topic-writing-adv-002', 'mod-writing-001', 'Professional Writing', 'Business proposals, reports, and formal documents', 'ADVANCED', 10),
('topic-writing-adv-003', 'mod-writing-001', 'Editing & Revision', 'Learn to edit and revise your own work', 'ADVANCED', 11),
('topic-writing-adv-004', 'mod-writing-001', 'Academic Papers', 'Write research papers and academic essays', 'ADVANCED', 12)
ON CONFLICT DO NOTHING;

-- Speaking Topics
INSERT INTO topics (id, module_id, title, description, difficulty_level, order_index) VALUES
('topic-speaking-basic-001', 'mod-speaking-001', 'Pronunciation Essentials', 'Master individual sounds and word pronunciation', 'BASIC', 1),
('topic-speaking-basic-002', 'mod-speaking-001', 'Basic Greetings', 'Learn common greetings and introductions', 'BASIC', 2),
('topic-speaking-basic-003', 'mod-speaking-001', 'Everyday Phrases', 'Master common phrases for daily situations', 'BASIC', 3),
('topic-speaking-basic-004', 'mod-speaking-001', 'Basic Conversations', 'Practice simple conversations on familiar topics', 'BASIC', 4),
('topic-speaking-inter-001', 'mod-speaking-001', 'Stress & Intonation', 'Learn word and sentence stress patterns', 'INTERMEDIATE', 5),
('topic-speaking-inter-002', 'mod-speaking-001', 'Fluency Practice', 'Improve speaking fluency and confidence', 'INTERMEDIATE', 6),
('topic-speaking-inter-003', 'mod-speaking-001', 'Advanced Conversations', 'Discuss complex topics and express opinions', 'INTERMEDIATE', 7),
('topic-speaking-inter-004', 'mod-speaking-001', 'Presentation Skills', 'Learn to give presentations and speeches', 'INTERMEDIATE', 8),
('topic-speaking-adv-001', 'mod-speaking-001', 'Accent Reduction', 'Modify accent and improve speech clarity', 'ADVANCED', 9),
('topic-speaking-adv-002', 'mod-speaking-001', 'Public Speaking', 'Master public speaking techniques and delivery', 'ADVANCED', 10),
('topic-speaking-adv-003', 'mod-speaking-001', 'Debate & Discussion', 'Participate in debates and academic discussions', 'ADVANCED', 11),
('topic-speaking-adv-004', 'mod-speaking-001', 'Storytelling', 'Tell compelling stories and narratives', 'ADVANCED', 12)
ON CONFLICT DO NOTHING;

-- Concepts (50+ concepts across all topics)
INSERT INTO concepts (id, topic_id, title, content, examples, difficulty_level, estimated_time_minutes) VALUES
('concept-001', 'topic-reading-basic-001', 'Nouns', 'Nouns are words that represent people, places, things, or ideas. They are the foundation of English grammar.', 'cat, house, love, freedom, John, London', 'BASIC', 15),
('concept-002', 'topic-reading-basic-001', 'Verbs', 'Verbs are action words that show what someone or something is doing or being.', 'run, jump, eat, sleep, be, have, like', 'BASIC', 15),
('concept-003', 'topic-reading-basic-001', 'Adjectives', 'Adjectives describe or modify nouns. They tell us more about the noun.', 'beautiful, tall, happy, red, large, intelligent', 'BASIC', 12),
('concept-004', 'topic-reading-basic-001', 'Adverbs', 'Adverbs modify verbs, adjectives, or other adverbs. Many end in -ly.', 'quickly, slowly, happily, very, really, well', 'BASIC', 12),
('concept-005', 'topic-reading-basic-002', 'Simple Sentences', 'A simple sentence has one independent clause with a subject and verb.', 'The cat sleeps. | She runs fast. | I like coffee.', 'BASIC', 10),
('concept-006', 'topic-reading-basic-002', 'Compound Sentences', 'Compound sentences join two independent clauses with a conjunction.', 'I like coffee, and she likes tea. | He studied, but he failed.', 'BASIC', 15),
('concept-007', 'topic-reading-basic-003', 'Common Verbs', 'Essential verbs used in everyday conversations and writing.', 'be, have, do, go, get, make, take, come, see, think', 'BASIC', 20),
('concept-008', 'topic-reading-basic-003', 'Common Adjectives', 'Frequently used adjectives to describe people, things, and situations.', 'good, bad, big, small, new, old, hot, cold, happy, sad', 'BASIC', 15),
('concept-009', 'topic-reading-basic-004', 'Reading for Details', 'Understand main ideas and supporting details in texts.', 'Read the passage and answer: What is the main idea? What details support it?', 'BASIC', 25),
('concept-010', 'topic-reading-inter-001', 'Present Tense', 'Talking about present actions, habits, and general truths.', 'I eat breakfast. She works here. They play football. I am happy.', 'INTERMEDIATE', 20),
('concept-011', 'topic-reading-inter-001', 'Past Tense', 'Talking about completed actions and past events.', 'I ate breakfast. She worked there. They played football. I was happy.', 'INTERMEDIATE', 20),
('concept-012', 'topic-reading-inter-001', 'Future Tense', 'Talking about future actions and plans.', 'I will eat. She will work. They are going to play. I shall go.', 'INTERMEDIATE', 20),
('concept-013', 'topic-reading-inter-002', 'Articles: A, An, The', 'Understanding when to use a, an, or the with nouns.', 'a cat, an apple, the sun, a teacher, an hour, the World', 'INTERMEDIATE', 15),
('concept-014', 'topic-reading-inter-002', 'Prepositions of Place', 'Describing where things are located.', 'in, on, at, under, over, beside, between, behind, in front of, above', 'INTERMEDIATE', 12),
('concept-015', 'topic-reading-inter-003', 'Academic Vocabulary', 'Words commonly used in academic writing and research.', 'analyze, synthesize, evaluate, methodology, hypothesis, conclusion, evidence', 'INTERMEDIATE', 25),
('concept-016', 'topic-reading-adv-001', 'Common Idioms', 'Expressions with meanings that differ from the literal words.', 'break the ice, hit the books, piece of cake, raining cats and dogs', 'ADVANCED', 20),
('concept-017', 'topic-reading-adv-002', 'Phrasal Verbs Introduction', 'Verb + preposition combinations with special meanings.', 'look after, look for, look forward to, put up with, give up', 'ADVANCED', 25),
('concept-018', 'topic-reading-adv-003', 'Literary Devices', 'Techniques used in literature to create meaning and effect.', 'metaphor, simile, personification, imagery, symbolism, irony', 'ADVANCED', 30),
('concept-019', 'topic-writing-basic-001', 'Subject-Verb Agreement', 'The subject and verb must agree in number and person.', 'The cat is sleeping. The cats are sleeping. She goes. They go.', 'BASIC', 12),
('concept-020', 'topic-writing-basic-001', 'Sentence Fragments', 'Understanding what makes a complete sentence.', 'Fragment: "Running to the store." Complete: "I am running to the store."', 'BASIC', 10),
('concept-021', 'topic-writing-basic-002', 'Comma Rules', 'When and how to use commas correctly.', 'In lists: apples, oranges, and bananas. | Before conjunctions: I wanted to go, but I was tired.', 'BASIC', 15),
('concept-022', 'topic-writing-basic-002', 'Apostrophe Usage', 'Using apostrophes for contractions and possessives.', 'Contractions: don\'t, can\'t, it\'s | Possessives: John\'s book, the cat\'s tail', 'BASIC', 10),
('concept-023', 'topic-writing-basic-003', 'Topic Sentences', 'The main idea of a paragraph, usually the first sentence.', 'Topic: Technology has changed education. Supporting: online classes, interactive tools, global access.', 'BASIC', 12),
('concept-024', 'topic-writing-basic-003', 'Supporting Details', 'Information that supports and explains the topic sentence.', 'Use examples, facts, statistics, and explanations to support your main idea.', 'BASIC', 12),
('concept-025', 'topic-writing-basic-004', 'Formal Email Structure', 'How to write professional emails.', 'Subject: Clear topic | Greeting: Dear [Name] | Body: 3-5 sentences | Closing: Sincerely', 'BASIC', 10),
('concept-026', 'topic-writing-inter-001', 'Five Paragraph Essay', 'Structure: Introduction, 3 body paragraphs, conclusion.', 'Intro with thesis | Body 1, 2, 3 with arguments | Conclusion summarizing', 'INTERMEDIATE', 25),
('concept-027', 'topic-writing-inter-001', 'Thesis Statement', 'A clear statement of your main argument or purpose.', 'Strong: "Social media has both positive and negative effects on teenagers." Weak: "Social media is important."', 'INTERMEDIATE', 15),
('concept-028', 'topic-writing-inter-002', 'Complex Sentences', 'Combining independent and dependent clauses.', 'Because I was late, I missed the meeting. | Although it rained, we went outside.', 'INTERMEDIATE', 18),
('concept-029', 'topic-writing-inter-002', 'Parallel Structure', 'Using the same grammatical form for related items.', 'Correct: I like reading, writing, and speaking. | Incorrect: I like reading, write, and to speak.', 'INTERMEDIATE', 12),
('concept-030', 'topic-writing-inter-003', 'Word Choice', 'Selecting the right words to convey your meaning.', 'Instead of "nice", use: beautiful, kind, pleasant, enjoyable, or clever', 'INTERMEDIATE', 15),
('concept-031', 'topic-writing-adv-001', 'Creative Writing Techniques', 'Methods to make writing more engaging and vivid.', 'Show, don\'t tell | Use sensory details | Create compelling characters | Build tension', 'ADVANCED', 30),
('concept-032', 'topic-writing-adv-002', 'Business Writing', 'Professional communication in business contexts.', 'Clear structure, formal tone, action items, professional vocabulary', 'ADVANCED', 25),
('concept-033', 'topic-writing-adv-003', 'Editing Checklist', 'What to check when revising your work.', 'Grammar, spelling, clarity, coherence, tone, word choice, flow', 'ADVANCED', 20),
('concept-034', 'topic-speaking-basic-001', 'English Sounds', 'The 44 sounds (phonemes) of English language.', '/i:/ (ee), /ɪ/ (ih), /e/ (eh), /æ/ (ash), /a:/ (ah), /ɒ/ (o)', 'BASIC', 20),
('concept-035', 'topic-speaking-basic-001', 'Vowel Pronunciation', 'Correct pronunciation of short and long vowels.', 'Short: /ɪ/ sit, /ɛ/ bed, /æ/ cat | Long: /i:/ see, /u:/ shoe, /o:/ door', 'BASIC', 15),
('concept-036', 'topic-speaking-basic-002', 'Greetings', 'Ways to greet people in different contexts.', 'Formal: Good morning. How do you do? | Informal: Hi! What\'s up? How are you?', 'BASIC', 10),
('concept-037', 'topic-speaking-basic-002', 'Introductions', 'How to introduce yourself and others.', 'I am (name). This is my friend (name). Nice to meet you. Where are you from?', 'BASIC', 10),
('concept-038', 'topic-speaking-basic-003', 'Common Phrases', 'Frequently used expressions in everyday speech.', 'How are you? What\'s your name? Where do you live? What do you do?', 'BASIC', 15),
('concept-039', 'topic-speaking-basic-004', 'Simple Conversations', 'Basic dialogue practice on familiar topics.', 'Ordering food, asking directions, introducing yourself, talking about hobbies', 'BASIC', 25),
('concept-040', 'topic-speaking-inter-001', 'Word Stress', 'Emphasizing the correct syllable in a word.', 'PHOtograph vs phOTOgraphy | REcord (noun) vs reCORD (verb)', 'INTERMEDIATE', 15),
('concept-041', 'topic-speaking-inter-001', 'Sentence Intonation', 'The rise and fall of pitch in sentences.', 'Questions go up: "Are you coming?" | Statements go down: "I am here."', 'INTERMEDIATE', 15),
('concept-042', 'topic-speaking-inter-002', 'Fluency Exercises', 'Techniques to speak more smoothly and naturally.', 'Shadowing native speakers, reading aloud, timed speaking practice', 'INTERMEDIATE', 25),
('concept-043', 'topic-speaking-inter-003', 'Expressing Opinions', 'How to politely share your views and thoughts.', 'I think... | In my opinion... | I believe... | It seems to me...', 'INTERMEDIATE', 12),
('concept-044', 'topic-speaking-inter-003', 'Asking for Clarification', 'Politely asking someone to explain something.', 'Can you repeat that? | What do you mean? | Could you explain further? | I don\'t quite understand.', 'INTERMEDIATE', 10),
('concept-045', 'topic-speaking-adv-001', 'Connected Speech', 'How sounds change when words are connected in natural speech.', 'Linking, elision, assimilation: "Did you" sounds like "didja"', 'ADVANCED', 20),
('concept-046', 'topic-speaking-adv-002', 'Public Speaking Tips', 'Techniques for confident public speaking.', 'Make eye contact | Speak clearly | Use pauses | Control pace | Project your voice', 'ADVANCED', 25),
('concept-047', 'topic-speaking-adv-003', 'Academic Discussions', 'Participating in formal discussions and debates.', 'Present evidence | Engage with counterarguments | Use formal register | Cite sources', 'ADVANCED', 20),
('concept-048', 'topic-speaking-adv-004', 'Storytelling Techniques', 'How to tell engaging stories in English.', 'Hook your audience | Describe vividly | Use dialogue | Build to a climax | Provide conclusion', 'ADVANCED', 25),
('concept-049', 'topic-reading-basic-001', 'Pronouns', 'Words that replace nouns to avoid repetition.', 'I, you, he, she, it, we, they, my, your, his, her, its, our, their', 'BASIC', 10),
('concept-050', 'topic-writing-inter-001', 'Paragraph Transitions', 'Words and phrases that connect ideas between sentences.', 'Furthermore, however, in addition, on the other hand, as a result, therefore', 'INTERMEDIATE', 12)
ON CONFLICT DO NOTHING;

-- ==================== ACKNOWLEDGMENTS ====================
-- Phase 4 Database Schema includes:
-- ✓ All Phase 1-3 tables and data
-- ✓ Video Lessons management
-- ✓ Live Tutoring sessions
-- ✓ Tutor Profiles
-- ✓ Pronunciation Records
-- ✓ Spaced Repetition tracking
-- ✓ Performance indices
-- ✓ 50+ seed concepts
-- Ready for Phase 4 features and mobile app
