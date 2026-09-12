-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create concepts table
CREATE TABLE IF NOT EXISTS concepts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  module VARCHAR(100),
  difficulty VARCHAR(50),
  content TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create assessments table
CREATE TABLE IF NOT EXISTS assessments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  concept_id INTEGER REFERENCES concepts(id),
  type VARCHAR(100),
  score INTEGER,
  feedback TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create progress table
CREATE TABLE IF NOT EXISTS progress (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  concept_id INTEGER REFERENCES concepts(id),
  status VARCHAR(50),
  proficiency INTEGER DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, concept_id)
);

-- Create gamification table
CREATE TABLE IF NOT EXISTS gamification (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE REFERENCES users(id),
  points INTEGER DEFAULT 0,
  badges TEXT DEFAULT '[]',
  streak INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create videos table
CREATE TABLE IF NOT EXISTS videos (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  url VARCHAR(500),
  duration INTEGER,
  module VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create tutors table
CREATE TABLE IF NOT EXISTS tutors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255),
  expertise TEXT,
  rating DECIMAL(3,2),
  availability BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create tutoring_sessions table
CREATE TABLE IF NOT EXISTS tutoring_sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  tutor_id INTEGER REFERENCES tutors(id),
  scheduled_time TIMESTAMP,
  duration INTEGER,
  status VARCHAR(50) DEFAULT 'booked',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample concepts
INSERT INTO concepts (title, description, module, difficulty, content) VALUES
('English Vowel Sounds', 'Learn the 12 main vowel sounds in English', 'Pronunciation', 'Beginner', 'Detailed content about vowel sounds'),
('Consonant Sounds', 'Master the 24 consonant sounds', 'Pronunciation', 'Beginner', 'Detailed content about consonants'),
('Past Tense Verbs', 'Learn regular and irregular past tense', 'Grammar', 'Beginner', 'Detailed content about past tense'),
('Present Perfect', 'Master the present perfect tense', 'Grammar', 'Intermediate', 'Detailed content about present perfect'),
('Common Phrasal Verbs', 'Learn 50+ common phrasal verbs', 'Vocabulary', 'Intermediate', 'Detailed phrasal verb list')
ON CONFLICT DO NOTHING;

-- Insert sample tutors
INSERT INTO tutors (name, email, expertise, rating, availability) VALUES
('John Smith', 'john@tutors.com', 'Pronunciation, Conversation', 4.8, true),
('Sarah Johnson', 'sarah@tutors.com', 'Grammar, Writing', 4.9, true),
('Mike Wilson', 'mike@tutors.com', 'Business English, IELTS', 4.7, true),
('Emma Brown', 'emma@tutors.com', 'Vocabulary, Reading', 4.8, true)
ON CONFLICT DO NOTHING;
