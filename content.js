/**
 * Full course content, ordered Beginner -> Intermediate -> Advanced.
 * Each lesson: { title, description, module, level, cefr, content,
 *                practice_text, exercises[], vocabulary[] }
 */

const beginner = require('./content-beginner');
const intermediate = require('./content-intermediate');
const advanced = require('./content-advanced');

const LESSONS = [].concat(beginner, intermediate, advanced);

const VIDEOS = [
  ['The Verb "To Be" Explained', 'https://www.youtube.com/results?search_query=verb+to+be+english+grammar', 'Grammar', 'Beginner', 'am, is, are in statements, negatives and questions.'],
  ['Present Simple: Full Lesson', 'https://www.youtube.com/results?search_query=present+simple+tense+english', 'Grammar', 'Beginner', 'The -s rule, negatives with do/does, and frequency adverbs.'],
  ['Articles a, an, the', 'https://www.youtube.com/results?search_query=english+articles+a+an+the', 'Grammar', 'Beginner', 'When to use each article and when to use none.'],
  ['The 12 English Vowel Sounds', 'https://www.youtube.com/results?search_query=english+vowel+sounds+minimal+pairs', 'Speaking', 'Beginner', 'Short and long vowel pairs, with mouth position for each.'],
  ['Introducing Yourself in English', 'https://www.youtube.com/results?search_query=introduce+yourself+in+english+formally', 'Speaking', 'Beginner', 'Formal, neutral and informal introductions.'],
  ['Countable and Uncountable Nouns', 'https://www.youtube.com/results?search_query=countable+uncountable+nouns+english', 'Grammar', 'Beginner', 'Why "informations" and "advices" are wrong.'],
  ['Present Perfect vs Past Simple', 'https://www.youtube.com/results?search_query=present+perfect+vs+past+simple', 'Grammar', 'Intermediate', 'The single most useful tense distinction in English.'],
  ['Conditionals Made Clear', 'https://www.youtube.com/results?search_query=first+and+second+conditional+english', 'Grammar', 'Intermediate', 'Zero, first and second conditionals with examples.'],
  ['Word Stress Patterns', 'https://www.youtube.com/results?search_query=english+word+stress+rules', 'Speaking', 'Intermediate', 'Reliable rules for -tion, -ity, -eer and noun/verb pairs.'],
  ['Connected Speech and Linking', 'https://www.youtube.com/results?search_query=connected+speech+linking+weak+forms', 'Speaking', 'Intermediate', 'Linking, weak forms, and why fast English sounds impossible.'],
  ['Professional Email Writing', 'https://www.youtube.com/results?search_query=professional+email+writing+english', 'Writing', 'Intermediate', 'Subject lines, openings, sign-offs and what to avoid.'],
  ['Phrasal Verbs for Work', 'https://www.youtube.com/results?search_query=business+phrasal+verbs+english', 'Vocabulary', 'Intermediate', 'The phrasal verbs you will actually hear at work.'],
  ['Perfect Modals', 'https://www.youtube.com/results?search_query=must+have+should+have+could+have+english', 'Grammar', 'Advanced', 'must have, should have, could have and their meanings.'],
  ['Active vs Passive Voice', 'https://www.youtube.com/results?search_query=active+passive+voice+when+to+use', 'Grammar', 'Advanced', 'When the passive is right, and when it hides responsibility.'],
  ['Inversion for Emphasis', 'https://www.youtube.com/results?search_query=inversion+english+grammar+advanced', 'Grammar', 'Advanced', 'Never have I seen... and other formal structures.'],
  ['Intonation and Meaning', 'https://www.youtube.com/results?search_query=english+intonation+patterns+meaning', 'Speaking', 'Advanced', 'How pitch alone changes what a sentence means.'],
  ['Presentation Skills in English', 'https://www.youtube.com/results?search_query=english+presentation+skills+structure', 'Speaking', 'Advanced', 'Structure, signposting, pausing and handling questions.'],
  ['Argumentative Essay Structure', 'https://www.youtube.com/results?search_query=argumentative+essay+structure+counter+argument', 'Writing', 'Advanced', 'Thesis, evidence, counter-argument and conclusion.'],
  ['British vs American English', 'https://www.youtube.com/results?search_query=british+vs+american+english+pronunciation+vocabulary', 'Listening', 'Advanced', 'Pronunciation, vocabulary and spelling differences.'],
  ['Reading Strategies: Skim and Scan', 'https://www.youtube.com/results?search_query=skimming+scanning+reading+strategies', 'Reading', 'Intermediate', 'Choose the right technique before you start reading.']
];

const TUTORS = [
  ['Priya Sharma', 'Speaking and Pronunciation', 4.9],
  ['James Whitfield', 'Grammar and Academic Writing', 4.8],
  ['Anjali Menon', 'Business and Workplace English', 4.7],
  ['Robert Chen', 'IELTS and TOEFL Preparation', 4.9],
  ['Fatima Khan', 'Conversation Practice', 4.6],
  ['David Byrne', 'Accent and Intonation Coaching', 4.8]
];

module.exports = { LESSONS: LESSONS, VIDEOS: VIDEOS, TUTORS: TUTORS };
