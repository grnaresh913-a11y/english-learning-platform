# English Learning Platform

A complete English course with graded exercises, pronunciation analysis, grammar
checking, plagiarism detection, spaced repetition and analytics.

## IMPORTANT: this release adds new files

The lesson content lives in four new files. If you replace only `server.js`,
the app will crash with `Cannot find module './content'`.

You must upload **all** of these to your repository:

| File | New or changed |
|---|---|
| `server.js` | changed |
| `app.html` | changed |
| `package.json` | changed |
| `content.js` | **NEW - required** |
| `content-beginner.js` | **NEW - required** |
| `content-intermediate.js` | **NEW - required** |
| `content-advanced.js` | **NEW - required** |

`schema.sql` is no longer used. The app creates and seeds its own tables on
first start, so you can leave the old file in place or delete it.

## Deploying to Railway

1. Open your GitHub repository.
2. Click **Add file -> Upload files**, drag in all seven files above, and commit.
   Uploading a file that already exists replaces it.
3. In Railway, confirm these variables are set under **Variables**:
   - `DATABASE_URL` - provided automatically by the Postgres add-on
   - `JWT_SECRET` - any long random string of your own
   - `NODE_ENV` - `production`
   Railway sets `PORT` itself; do not override it.
4. Railway redeploys automatically. Wait for the deploy log to show:

```
[db] seeded 32 lessons, 227 exercises, 140 vocabulary items
[server] listening on 0.0.0.0:8080
[server] ready
```

5. Open your Railway URL and register an account.

The database is created and seeded on first boot, so registration works
immediately on an empty database. Restarting never duplicates the content.

## What a learner actually does

1. **Course** - 32 lessons across Beginner, Intermediate and Advanced. Open a
   lesson, read the explanation, study its vocabulary, then answer the
   exercises. Every wrong answer shows the correct answer and explains why.
2. **Speaking** - pick a lesson's practice sentence, record yourself, and get a
   pronunciation score with word-by-word feedback and targeted sound tips.
3. **Writing** - grammar is checked as you type; run an originality check, then
   submit.
4. **Vocabulary** - all 140 words with meanings and example sentences,
   searchable.
5. **Progress** - your quiz scores set the review schedule automatically.
6. **Dashboard / Analytics** - what to study next, and where your time goes.

## Course content

32 lessons, 227 graded exercises, 140 vocabulary items.

| Level | Lessons | CEFR |
|---|---|---|
| Beginner | 10 | A1-A2 |
| Intermediate | 11 | A2-B1 |
| Advanced | 11 | B2-C1 |

Modules: Grammar (12), Speaking (6), Writing (5), Reading (3), Listening (3),
Vocabulary (3).

Exercise types are multiple choice, fill in the blank, and error correction.
Answers are graded on the server and are never sent to the browser, so the
quiz cannot be read from the page source. Typed answers ignore case and
punctuation.

## How the features work

**Spaced repetition (SM-2).** Your quiz score sets the recall quality, which
sets the next review date. Below 60% the lesson returns tomorrow; a strong
score pushes it out to 6 days, then multiplies by the ease factor.

**Pronunciation analysis.** The browser records audio and transcribes it with
the Web Speech API. The server aligns the transcript against the target text
word by word using edit distance, scores accuracy, derives fluency from your
speaking rate, and returns sound-specific advice. If the browser cannot
transcribe, you can type what you said and still get the analysis.

**Grammar checking.** A rule-based checker covering subject-verb agreement,
irregular past participles, articles, confusable pairs, sentence length,
capitalisation and punctuation, plus the errors most common for Telugu and
Hindi speakers. No API key needed.

**Plagiarism detection.** Word-trigram containment similarity against the
course material and other learners' submissions, reporting the matched
passage.

**Adaptive recommendations.** Combines lessons due for review, your weakest
module by average score, and unstarted material at your level. Master 80% of a
level to unlock the next.

## Local development

```bash
npm install
createdb englishlearning
cat > .env <<'EOF'
DATABASE_URL=postgresql://localhost:5432/englishlearning
JWT_SECRET=any-long-random-string
PORT=8080
NODE_ENV=development
PGSSL=false
EOF
npm start
```

Open http://localhost:8080

## Tests

```bash
bash test-api.sh      # 75 API tests
node test-content.js  # 19 content and quiz-grading tests
node test-ui.js       # 57 browser tests across every screen (needs Playwright)
```

All 151 pass against a clean database. `test-ui.js` drives a real browser
through registration, every lesson screen, quiz grading, audio recording,
grammar and plagiarism checks, tutor booking and the analytics charts, and
fails on any console error or CSP violation.

## API

Public: `GET /api/health`, `/api/concepts`, `/api/concepts/:id`,
`/api/concepts/:id/exercises`, `/api/concepts/:id/vocabulary`,
`/api/vocabulary`, `/api/videos`, `/api/tutors`, `/api/leaderboard`;
`POST /api/auth/register`, `/api/auth/login`.

Authenticated (send `Authorization: Bearer <token>`):
`GET/PUT /api/user/profile`, `/api/user/level`;
`POST /api/concepts/:id/submit` (grade a quiz);
`GET/POST /api/progress`, `GET /api/progress/due`;
`GET/POST /api/assessments`;
`GET /api/gamification`, `POST /api/gamification/points`;
`POST /api/speaking/analyze`, `GET /api/speaking/recordings`;
`POST /api/grammar/check`, `GET /api/grammar/history`;
`POST /api/plagiarism/check`;
`POST /api/writing/submit`, `GET /api/writing/submissions`;
`POST /api/tutoring/book`, `GET /api/tutoring/sessions`,
`DELETE /api/tutoring/sessions/:id`;
`GET/POST /api/analytics`, `GET /api/analytics/dashboard`;
`GET /api/recommendations`, `/api/study-plan`.

## Adding your own lessons

Add an object to `content-beginner.js`, `content-intermediate.js` or
`content-advanced.js`:

```js
{
  title: 'Lesson title',
  description: 'One line shown in the course list.',
  module: 'Grammar',            // Grammar|Speaking|Writing|Reading|Listening|Vocabulary
  level: 'Beginner',            // Beginner|Intermediate|Advanced
  cefr: 'A1',
  content: `Multi-paragraph explanation.

ALL-CAPS LINES BECOME SECTION HEADINGS
A line wrapped entirely in "quotes" becomes an example block.`,
  practice_text: 'Sentences for the learner to read aloud.',
  exercises: [
    { type:'mcq', question:'...', options:['a','b'], answer:1, explanation:'Why.' },
    { type:'fill', question:'I ___ ready.', answer:'am', explanation:'Why.' },
    { type:'correct', question:'He not ready.', answer:'He is not ready.', explanation:'Why.' }
  ],
  vocabulary: [
    { word:'example', meaning:'a short definition', example:'A sentence using it.' }
  ]
}
```

For `mcq`, `answer` is the zero-based index of the correct option.

Seeding runs only when the `concepts` table is empty. To reload content after
editing, drop and recreate the database, or delete the rows in `concepts`
(exercises and vocabulary cascade) and restart.
