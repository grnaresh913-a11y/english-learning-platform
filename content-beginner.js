/**
 * BEGINNER course content (CEFR A1-A2).
 * Each lesson carries a full explanation, read-aloud practice, graded
 * exercises with explanations, and its own vocabulary set.
 */

module.exports = [

/* ------------------------------------------------------------------ 1 */
{
  title: 'The Verb "To Be"',
  description: 'am, is, are - the first verb you need for almost every sentence.',
  module: 'Grammar',
  level: 'Beginner',
  cefr: 'A1',
  content:
`"To be" is the most common verb in English and it is irregular, so it must be memorised rather than worked out.

THE THREE FORMS
I am. You are. He is. She is. It is. We are. They are.

Notice the pattern: only "I" takes "am", only he/she/it takes "is", and everything else takes "are".

MAKING IT NEGATIVE
Add "not" straight after the verb: "I am not ready." "She is not here." "They are not late."

ASKING A QUESTION
Swap the subject and the verb: "You are ready" becomes "Are you ready?" "She is a teacher" becomes "Is she a teacher?"

SHORT FORMS
In speech and informal writing, English almost always contracts: I'm, you're, he's, she's, it's, we're, they're. The negatives contract too: isn't, aren't. Using the full form in conversation sounds stiff and over-formal.

THE MISTAKE TO AVOID
Many learners drop the verb entirely, because in Telugu, Hindi and many other languages the equivalent sentence needs no verb. "I a student" and "She very tired" are wrong in English. The verb is compulsory: "I am a student." "She is very tired."`,
  practice_text: 'I am an officer at the port. She is my colleague. We are not free this afternoon. Are you ready for the meeting?',
  exercises: [
    { type:'mcq', question:'Choose the correct sentence.',
      options:['She are my sister.','She is my sister.','She am my sister.','She my sister.'],
      answer:1, explanation:'"She" is third person singular, so it takes "is". The verb can never be left out in English.' },
    { type:'fill', question:'I ___ from Andhra Pradesh.', answer:'am',
      explanation:'"I" always takes "am" - it is the only subject that does.' },
    { type:'fill', question:'They ___ not at the office today.', answer:'are',
      explanation:'"They" is plural, so it takes "are". The negative is formed by adding "not" after the verb.' },
    { type:'mcq', question:'Which is the correct question form?',
      options:['You are tired?','Are you tired?','Do you are tired?','Is you tired?'],
      answer:1, explanation:'With "to be", you make a question by putting the verb first: Are you tired? You do not need "do".' },
    { type:'correct', question:'He not ready.', answer:'He is not ready.',
      explanation:'The verb "is" is missing. English requires it, even though many languages do not.' },
    { type:'correct', question:'We is colleagues.', answer:'We are colleagues.',
      explanation:'"We" is plural and takes "are", not "is".' },
    { type:'mcq', question:'What is the contraction of "it is"?',
      options:['its','it\'s','its\'','it is has no contraction'],
      answer:1, explanation:'"It\'s" with an apostrophe means "it is". "Its" without an apostrophe is the possessive, as in "its colour".' }
  ],
  vocabulary: [
    { word:'colleague', meaning:'a person you work with', example:'My colleague handles the land records.' },
    { word:'ready', meaning:'prepared and able to start', example:'The report is ready for your signature.' },
    { word:'tired', meaning:'needing rest', example:'I am tired after the site visit.' },
    { word:'office', meaning:'the place where you do your job', example:'She is not in the office today.' }
  ]
},

/* ------------------------------------------------------------------ 2 */
{
  title: 'Present Simple Tense',
  description: 'Talk about habits, routines, facts and permanent situations.',
  module: 'Grammar',
  level: 'Beginner',
  cefr: 'A1',
  content:
`The present simple is not really about "now". It describes what is generally or repeatedly true.

USE IT FOR
Habits and routines: "I leave home at eight."
Permanent facts: "Water boils at 100 degrees."
Your job and where you live: "She works at the port. They live in Mumbai."

THE -S RULE
This is where most errors happen. Add -s only for he, she and it:
I work / you work / HE WORKS / she works / it works / we work / they work

Verbs ending in -o, -s, -sh, -ch or -x take -es: goes, misses, washes, watches, fixes.
Verbs ending in consonant + y change to -ies: study becomes studies, carry becomes carries.

NEGATIVES AND QUESTIONS NEED "DO"
Unlike "to be", this tense needs a helper verb.
Negative: "I do not work on Sunday." "He does not work on Sunday."
Question: "Do you work on Sunday?" "Does he work on Sunday?"

THE CRITICAL POINT: once you use does, the main verb loses its -s. "Does he works?" is wrong. It is "Does he work?" The -s has already been used up by "does".

FREQUENCY WORDS
always, usually, often, sometimes, rarely, never. These go before the main verb but after "to be": "I always check the file." "He is always late."`,
  practice_text: 'I work in estate management. She checks the records every morning. He does not handle legal files. Do you review these documents?',
  exercises: [
    { type:'fill', question:'She ___ (work) in the accounts department.', answer:'works',
      explanation:'"She" is third person singular, so the verb takes -s: works.' },
    { type:'fill', question:'They ___ (study) English every evening.', answer:'study',
      explanation:'"They" is plural, so the verb takes no -s. Only he/she/it add -s.' },
    { type:'mcq', question:'Choose the correct sentence.',
      options:['Does he works here?','Does he work here?','Do he works here?','Is he work here?'],
      answer:1, explanation:'After "does", the main verb returns to its base form. The -s is already carried by "does".' },
    { type:'fill', question:'He ___ not speak Tamil.', answer:'does',
      explanation:'For he/she/it the negative helper is "does not". For I/you/we/they it is "do not".' },
    { type:'correct', question:'My brother go to college by bus.', answer:'My brother goes to college by bus.',
      explanation:'"My brother" = he, so the verb needs -s. "Go" ends in -o, so it takes -es: goes.' },
    { type:'correct', question:'I am work at the port authority.', answer:'I work at the port authority.',
      explanation:'Do not mix "to be" with the present simple. Either "I work" (habit) or "I am working" (right now), never "I am work".' },
    { type:'mcq', question:'Where does "always" go? "She ___ arrives on time."',
      options:['always','is always','does always','always is'],
      answer:0, explanation:'Frequency adverbs go directly before the main verb: "She always arrives on time."' },
    { type:'fill', question:'___ your sister live in Hyderabad?', answer:'does',
      explanation:'"Your sister" = she, so the question helper is "does".' }
  ],
  vocabulary: [
    { word:'routine', meaning:'the set of things you do regularly', example:'My morning routine starts at six.' },
    { word:'usually', meaning:'most of the time, but not always', example:'I usually finish work by six.' },
    { word:'handle', meaning:'to be responsible for something', example:'She handles all the legal files.' },
    { word:'review', meaning:'to examine something carefully', example:'Please review the draft before Friday.' },
    { word:'department', meaning:'one section of a large organisation', example:'He moved to the accounts department.' }
  ]
},

/* ------------------------------------------------------------------ 3 */
{
  title: 'Articles: a, an, the',
  description: 'The small words that learners most often drop or misuse.',
  module: 'Grammar',
  level: 'Beginner',
  cefr: 'A1',
  content:
`Articles are difficult because many Indian languages have no direct equivalent. The rules are learnable, though.

"A" AND "AN" - one of many, not yet identified
Use them when you mention something for the first time, or when it does not matter which one: "I need a pen." "She is a doctor."

Choose by SOUND, not spelling:
"an" before a vowel sound: an apple, an hour (the h is silent), an MBA (sounds like "em-bee-ay")
"a" before a consonant sound: a book, a university (sounds like "yoo"), a one-way street (sounds like "wun")

"THE" - a specific thing both people can identify
Use it when the listener knows which one you mean: "Please close the door" (the one in this room). "The report you sent is excellent" (that particular report).
Also use "the" the second time you mention something: "I bought a file. The file was damaged."
And for unique things: the sun, the moon, the government, the Prime Minister.

NO ARTICLE AT ALL
Before plural or uncountable nouns talking in general: "Files are stored upstairs." "Water is essential." "I like music."
Before most countries, cities, languages and meals: "He lives in India." "She speaks Telugu." "We had lunch."

THE COMMONEST ERRORS
"I am going to office" should be "I am going to the office."
"He is doctor" should be "He is a doctor."
"I like the music" means one specific piece of music; for music in general, say "I like music."`,
  practice_text: 'I need a file from the cabinet. She is an officer in the estate department. The report is on my desk. Water is essential for health.',
  exercises: [
    { type:'mcq', question:'Choose the correct article: "She is ___ engineer."',
      options:['a','an','the','no article'],
      answer:1, explanation:'"Engineer" begins with a vowel sound, so it takes "an".' },
    { type:'mcq', question:'Choose the correct article: "He has ___ university degree."',
      options:['a','an','the','no article'],
      answer:0, explanation:'"University" starts with a "yoo" consonant sound, so it takes "a" despite beginning with the letter u.' },
    { type:'fill', question:'Please shut ___ window behind you.', answer:'the',
      explanation:'A specific window that both speaker and listener can identify, so "the".' },
    { type:'mcq', question:'Which sentence is correct?',
      options:['I am going to office.','I am going to the office.','I am going to an office.','I am going office.'],
      answer:1, explanation:'"The office" - your particular workplace. Dropping "the" here is one of the most common Indian-English errors.' },
    { type:'correct', question:'He is best officer in our department.', answer:'He is the best officer in our department.',
      explanation:'Superlatives (best, largest, first) always take "the", because only one thing can be the best.' },
    { type:'fill', question:'It will take ___ hour to reach the site.', answer:'an',
      explanation:'The "h" in "hour" is silent, so the word begins with a vowel sound and takes "an".' },
    { type:'mcq', question:'"___ files are kept in the basement." (files in general)',
      options:['A','An','The','No article'],
      answer:3, explanation:'A plural noun used in a general sense takes no article at all.' }
  ],
  vocabulary: [
    { word:'cabinet', meaning:'a cupboard for storing files or documents', example:'The deeds are in the steel cabinet.' },
    { word:'essential', meaning:'absolutely necessary', example:'A signature is essential on this form.' },
    { word:'degree', meaning:'a qualification from a university', example:'She has a degree in town planning.' },
    { word:'basement', meaning:'the floor below ground level', example:'Old records are stored in the basement.' }
  ]
},

/* ------------------------------------------------------------------ 4 */
{
  title: 'Plurals and Countable Nouns',
  description: 'One file, two files - and the nouns that break the rules.',
  module: 'Grammar',
  level: 'Beginner',
  cefr: 'A1',
  content:
`REGULAR PLURALS
Add -s: file becomes files, officer becomes officers.
After -s, -sh, -ch, -x, -z add -es: boxes, watches, buses, wishes.
Consonant + y becomes -ies: city becomes cities, duty becomes duties.
Some words ending in -f become -ves: leaf becomes leaves, shelf becomes shelves.

IRREGULAR PLURALS - memorise these
man/men, woman/women, child/children, person/people, foot/feet, tooth/teeth, mouse/mice.
Some do not change at all: one sheep, two sheep. One aircraft, two aircraft.

UNCOUNTABLE NOUNS - never take -s
Some things are treated as a mass, not as separate items: information, advice, furniture, luggage, equipment, staff, money, work, research, traffic, news.

This is a frequent source of error, because several of these ARE countable in Indian languages:
"informations" is wrong - say "information" or "pieces of information"
"advices" is wrong - say "advice" or "some advice"
"furnitures" is wrong - say "furniture" or "items of furniture"
"equipments" is wrong - say "equipment"

Note that "news" looks plural but is uncountable and singular: "The news is good", never "The news are good".

HOW MUCH, HOW MANY
Use "many" with countable nouns: many files, many people.
Use "much" with uncountable nouns: much information, much work.
"Some" and "a lot of" work with both.`,
  practice_text: 'I have three files and a lot of work. The staff need more equipment. She gave me some useful advice. The news is encouraging.',
  exercises: [
    { type:'mcq', question:'Choose the correct form.',
      options:['He gave me many informations.','He gave me many information.','He gave me a lot of information.','He gave me informations.'],
      answer:2, explanation:'"Information" is uncountable: it never takes -s and never takes "many". Use "a lot of" or "much".' },
    { type:'fill', question:'There are five ___ (child) in the programme.', answer:'children',
      explanation:'"Child" has the irregular plural "children".' },
    { type:'fill', question:'We need new office ___ (furniture).', answer:'furniture',
      explanation:'"Furniture" is uncountable and has no plural form.' },
    { type:'mcq', question:'Which is correct?',
      options:['How much files do you have?','How many files do you have?','How many file do you have?','How much file do you have?'],
      answer:1, explanation:'"Files" is countable and plural, so it takes "many".' },
    { type:'correct', question:'She gave me two good advices.', answer:'She gave me two good pieces of advice.',
      explanation:'"Advice" is uncountable. To count it, use a measure word: "pieces of advice".' },
    { type:'fill', question:'The ___ (city) of Mumbai and Pune are growing fast.', answer:'cities',
      explanation:'A noun ending in consonant + y forms its plural with -ies: city becomes cities.' },
    { type:'correct', question:'The news are very bad today.', answer:'The news is very bad today.',
      explanation:'Despite the final -s, "news" is uncountable and takes a singular verb.' }
  ],
  vocabulary: [
    { word:'equipment', meaning:'the tools or machines needed for a job (uncountable)', example:'The survey equipment arrived today.' },
    { word:'staff', meaning:'the people who work for an organisation', example:'The staff are attending training.' },
    { word:'duty', meaning:'something you are required to do as part of your job', example:'It is my duty to verify the records.' },
    { word:'encouraging', meaning:'giving hope or confidence', example:'The results are encouraging.' }
  ]
},

/* ------------------------------------------------------------------ 5 */
{
  title: 'Vowel Sounds: Short and Long',
  description: 'The sound pairs that change ship into sheep.',
  module: 'Speaking',
  level: 'Beginner',
  cefr: 'A1',
  content:
`English has around twelve vowel sounds, far more than most Indian languages, and length distinguishes meaning. Getting these wrong changes the word, not just the accent.

THE FIVE PAIRS THAT MATTER MOST

1. /i/ vs /ee/ - ship / sheep, sit / seat, fill / feel, bin / bean
For the short sound, relax your mouth and keep it brief. For the long sound, spread your lips into a slight smile and hold it about twice as long.

2. /u/ vs /oo/ - full / fool, pull / pool, look / Luke
The short one is relaxed; the long one needs tightly rounded lips.

3. /a/ vs /ar/ - cat / cart, hat / heart, match / march
The long sound opens the mouth wider and holds longer.

4. /e/ vs /ay/ - pen / pain, sell / sail, test / taste
The long one glides: your tongue moves upward during the sound.

5. /o/ vs /oh/ - not / note, cot / coat, hop / hope

THE SCHWA - the most common sound in English
In unstressed syllables, vowels collapse into a weak "uh": the first sound of "about", the last of "sofa", the middle of "family". Learners often pronounce every vowel fully and clearly, which is exactly what makes speech sound unnatural. Weakening the unstressed vowels is what produces a natural rhythm.

HOW TO PRACTISE
Say the pairs aloud, back to back, exaggerating the difference: ship SHEEP, ship SHEEP. Record yourself and listen. If you cannot hear a difference, the listener cannot either.`,
  practice_text: 'The ship carries sheep. Please fill the form and tell me how you feel. He will sit on the seat. I need a full pool of data.',
  exercises: [
    { type:'mcq', question:'Which word has the LONG vowel sound?',
      options:['ship','sit','sheep','fill'],
      answer:2, explanation:'"Sheep" has the long /ee/ sound. Ship, sit and fill all have the short /i/.' },
    { type:'mcq', question:'"He sat on the seat" - which vowel is long?',
      options:['sat','seat','both','neither'],
      answer:1, explanation:'"Seat" has the long /ee/ sound; "sat" has the short /a/.' },
    { type:'mcq', question:'What is the schwa sound?',
      options:['A long, stressed vowel','A weak "uh" in unstressed syllables','A silent letter','A rolled consonant'],
      answer:1, explanation:'The schwa is the weak "uh" that unstressed vowels reduce to. Pronouncing every vowel fully is what makes speech sound unnatural.' },
    { type:'mcq', question:'Which pair shows a meaning difference from vowel length alone?',
      options:['full / fool','big / large','fast / quick','start / begin'],
      answer:0, explanation:'"Full" and "fool" differ only in vowel length, and mean entirely different things. The other pairs are synonyms.' },
    { type:'fill', question:'A young sheep is a lamb. A large boat is a ___ . (ship or sheep?)', answer:'ship',
      explanation:'"Ship" with the short /i/ is the vessel; "sheep" with the long /ee/ is the animal.' },
    { type:'mcq', question:'To make the long /ee/ sound correctly you should:',
      options:['Round your lips tightly','Spread your lips slightly and hold the sound longer','Open your mouth as wide as possible','Keep the sound very short'],
      answer:1, explanation:'The long /ee/ needs spread lips and roughly double the duration of the short /i/.' }
  ],
  vocabulary: [
    { word:'vowel', meaning:'a speech sound made with an open mouth, like a, e, i, o, u', example:'English has twelve vowel sounds.' },
    { word:'syllable', meaning:'one unit of sound in a word', example:'"Water" has two syllables.' },
    { word:'stress', meaning:'the syllable you say with more force', example:'The stress in "record" changes its meaning.' },
    { word:'exaggerate', meaning:'to make something larger or more obvious than normal', example:'Exaggerate the difference while practising.' }
  ]
},

/* ------------------------------------------------------------------ 6 */
{
  title: 'Greetings and Introductions',
  description: 'Open and close a conversation at the right level of formality.',
  module: 'Speaking',
  level: 'Beginner',
  cefr: 'A1',
  content:
`Choosing the wrong level of formality is more noticeable than a grammar mistake, so match your greeting to the situation.

FORMAL - a senior officer, an interview, a client
"Good morning." / "Good afternoon." / "Good evening."
"My name is Naresh Kumar. I am the Assistant Estate Manager."
"It is a pleasure to meet you."
Note: "Good night" is NOT a greeting. It is only used when leaving or going to bed.

NEUTRAL - most workplace situations
"Hello, I'm Naresh."
"Nice to meet you."
"How do you do?" is very formal and now old-fashioned; avoid it.

INFORMAL - colleagues you know, friends
"Hi." / "Hey."
"How's it going?" / "How are you doing?"

ANSWERING "HOW ARE YOU?"
This is a greeting, not a real medical enquiry. The expected answer is short and positive, then you return the question:
"I'm fine, thank you. And you?"
"Very well, thanks. How about you?"
Do not describe your problems in detail; that is not what is being asked.

INTRODUCING OTHER PEOPLE
"Anjali, this is my colleague Naresh. Naresh, this is Anjali from the legal department."
Introduce the more junior person to the more senior one first.

CLOSING A CONVERSATION
"It was nice meeting you."
"I look forward to working with you."
"Please let me know if you need anything."`,
  practice_text: 'Good morning. My name is Naresh and I work in the estate department. It is a pleasure to meet you. I look forward to working with you.',
  exercises: [
    { type:'mcq', question:'You meet a senior officer at 3 p.m. What do you say?',
      options:['Good night.','Good afternoon.','Hey, what\'s up?','Good day.'],
      answer:1, explanation:'"Good afternoon" covers roughly midday to 6 p.m. "Good night" is only for leaving, never for greeting.' },
    { type:'mcq', question:'Someone asks "How are you?" What is the expected reply?',
      options:['I have a headache and my back hurts.','I\'m fine, thank you. And you?','Why are you asking?','I am not well since Monday.'],
      answer:1, explanation:'"How are you?" is a social formula, not a medical question. Answer briefly and return the question.' },
    { type:'fill', question:'On a first meeting you say: "Nice to ___ you."', answer:'meet',
      explanation:'"Nice to meet you" is for a first meeting. When you see someone again, say "Nice to see you".' },
    { type:'mcq', question:'When is "Good night" correct?',
      options:['When arriving at an evening event','When leaving at the end of the evening','When answering the phone at night','As a formal greeting after 8 p.m.'],
      answer:1, explanation:'"Good night" is a farewell only. To greet someone in the evening, say "Good evening".' },
    { type:'correct', question:'Myself Naresh.', answer:'My name is Naresh.',
      explanation:'"Myself Naresh" is not English. Say "My name is Naresh" or "I\'m Naresh".' },
    { type:'mcq', question:'Which is the most formal introduction?',
      options:['Hey, I\'m Naresh.','Hi, Naresh here.','My name is Naresh Kumar and I am the Assistant Estate Manager.','Naresh. You?'],
      answer:2, explanation:'Giving your full name and your role is the formal register, appropriate for interviews and senior contacts.' }
  ],
  vocabulary: [
    { word:'pleasure', meaning:'a feeling of enjoyment or satisfaction', example:'It is a pleasure to meet you.' },
    { word:'formality', meaning:'how official or serious the language is', example:'Match the formality to the situation.' },
    { word:'colleague', meaning:'someone you work with', example:'This is my colleague from the legal wing.' },
    { word:'introduce', meaning:'to tell people each other\'s names for the first time', example:'Let me introduce you to the manager.' }
  ]
},

/* ------------------------------------------------------------------ 7 */
{
  title: 'Reading Signs and Short Notices',
  description: 'Understand compressed English on signs, notices and messages.',
  module: 'Reading',
  level: 'Beginner',
  cefr: 'A1',
  content:
`Notices save space by deleting grammar words. To read them, find the key nouns and verbs and rebuild the full sentence in your head.

WHAT GETS DELETED
Articles, "to be", and often the subject:
"No parking 9am-6pm" means "Parking is not allowed between 9 a.m. and 6 p.m."
"Lift under maintenance" means "The lift is under maintenance."
"Office closed second Saturday" means "The office is closed on the second Saturday of the month."

COMMON NOTICE VOCABULARY
Prohibition: no entry, no smoking, prohibited, not permitted, strictly forbidden
Instruction: please use, kindly note, keep off, mind the step, queue here
Warning: caution, danger, wet floor, under construction, beware of
Information: opening hours, out of order, temporarily closed, closed for renovation, admission free

"KINDLY" AND "PLEASE"
Indian official notices often use "kindly" where British and American English use "please". Both are understood, but "please" is the international standard: "Please note" rather than "Kindly note".

READING STRATEGY
1. Find the numbers first - times, dates, floor numbers, amounts.
2. Find the main noun - what is this about?
3. Find the verb or the prohibition word - what should you do or not do?
4. Rebuild the sentence mentally before acting on it.`,
  practice_text: 'Office closed on the second Saturday. Lift under maintenance; please use the stairs. No entry for unauthorised persons. Visiting hours: 10 a.m. to 1 p.m.',
  exercises: [
    { type:'mcq', question:'"No parking 9am-6pm" means:',
      options:['Parking is free between 9 and 6.','You may not park between 9 a.m. and 6 p.m.','Parking is only allowed between 9 and 6.','The car park closes at 6.'],
      answer:1, explanation:'"No parking" is a prohibition, and the times state when the prohibition applies.' },
    { type:'mcq', question:'A sign says "Out of order". What does it mean?',
      options:['It is arranged incorrectly','It is not working','It is out of stock','It is in the wrong place'],
      answer:1, explanation:'"Out of order" means a machine is broken or not functioning.' },
    { type:'fill', question:'Rewrite as a full sentence: "Lift under maintenance." -> "The lift ___ under maintenance."', answer:'is',
      explanation:'Notices delete the verb "to be". Restoring it gives the full sentence.' },
    { type:'mcq', question:'"Beware of the dog" is an example of:',
      options:['An instruction','A warning','An invitation','An advertisement'],
      answer:1, explanation:'"Beware" signals danger, so this is a warning notice.' },
    { type:'mcq', question:'Which is standard international English on a notice?',
      options:['Kindly do the needful','Please note the revised timings','Do the needful urgently','Kindly revert back'],
      answer:1, explanation:'"Please note" is standard. "Do the needful" and "revert back" are Indian-English expressions that confuse international readers.' },
    { type:'mcq', question:'"Admission free" means:',
      options:['Entry is not allowed','You do not have to pay to enter','The hall is empty','Registration is required'],
      answer:1, explanation:'"Free" here refers to cost: there is no entry charge.' }
  ],
  vocabulary: [
    { word:'prohibited', meaning:'not allowed by a rule or law', example:'Smoking is prohibited in the building.' },
    { word:'maintenance', meaning:'the work of keeping something in good condition', example:'The lift is closed for maintenance.' },
    { word:'unauthorised', meaning:'without official permission', example:'No unauthorised entry beyond this point.' },
    { word:'caution', meaning:'care taken to avoid danger', example:'Proceed with caution near the site.' },
    { word:'temporarily', meaning:'for a short time only', example:'The counter is temporarily closed.' }
  ]
},

/* ------------------------------------------------------------------ 8 */
{
  title: 'Writing Simple Sentences',
  description: 'Build clear, correct sentences one idea at a time.',
  module: 'Writing',
  level: 'Beginner',
  cefr: 'A1',
  content:
`Every English sentence needs a subject and a verb. Get that right and you can write clearly even with a small vocabulary.

THE BASIC PATTERN: SUBJECT + VERB + OBJECT
"I (subject) sent (verb) the file (object)."
English word order is strict. Unlike Telugu or Hindi, the verb cannot move to the end. "I the file sent" is wrong.

FOUR ESSENTIAL RULES
1. Start with a capital letter, end with a full stop.
2. The verb must agree with the subject: "The file is ready", "The files are ready".
3. One main idea per sentence while you are learning. Short and correct beats long and confused.
4. Do not omit the verb, even when your first language would allow it.

JOINING TWO IDEAS
and - adds: "I checked the file and signed it."
but - contrasts: "I checked the file but did not sign it."
because - gives a reason: "I did not sign it because the survey was missing."
so - gives a result: "The survey was missing, so I returned the file."

Put a comma before "but" and "so" when they join two complete sentences.

THE COMMONEST BEGINNER ERRORS
Missing verb: "The report very long" should be "The report is very long."
Wrong order: "Yesterday I to the office went" should be "I went to the office yesterday."
Run-on sentence: "I checked the file it was wrong I returned it" should be three sentences, or joined with "and" and "so".

BUILD UP GRADUALLY
Start: "I sent the report."
Add detail: "I sent the report to the manager."
Add time: "I sent the report to the manager on Monday."
Add reason: "I sent the report to the manager on Monday because he asked for it."`,
  practice_text: 'I checked the file and signed it. The survey was missing, so I returned the document. My manager approved the request on Monday.',
  exercises: [
    { type:'mcq', question:'Which sentence is correctly built?',
      options:['The report very long.','The report is very long.','Very long the report.','Is the report very long is.'],
      answer:1, explanation:'Every English sentence needs a verb. "Is" is required here.' },
    { type:'correct', question:'Yesterday I to the office went.', answer:'I went to the office yesterday.',
      explanation:'English uses subject-verb-object order. The verb cannot move to the end of the sentence.' },
    { type:'fill', question:'I checked the file ___ I did not sign it. (contrast)', answer:'but',
      explanation:'"But" joins two ideas that contrast with each other.' },
    { type:'fill', question:'The survey was missing, ___ I returned the file. (result)', answer:'so',
      explanation:'"So" introduces the result of the first idea.' },
    { type:'mcq', question:'Which joining word gives a REASON?',
      options:['and','but','because','so'],
      answer:2, explanation:'"Because" introduces a reason. "So" introduces a result - they are opposite in direction.' },
    { type:'correct', question:'i sent the report to the manager', answer:'I sent the report to the manager.',
      explanation:'Two fixes: the pronoun "I" is always capitalised, and the sentence needs a full stop.' },
    { type:'mcq', question:'What is wrong with: "I checked the file it was wrong I returned it"?',
      options:['Nothing','It is a run-on: three sentences with no punctuation','The verbs are wrong','It needs a question mark'],
      answer:1, explanation:'Three complete ideas are run together. Separate them with full stops, or join them with "and" and "so".' }
  ],
  vocabulary: [
    { word:'approve', meaning:'to officially agree to something', example:'The manager approved my leave.' },
    { word:'submit', meaning:'to formally give something to an authority', example:'Please submit the form by Friday.' },
    { word:'draft', meaning:'an early version of a document', example:'This is only the first draft.' },
    { word:'deadline', meaning:'the latest time by which something must be done', example:'The deadline is 20 March.' }
  ]
},

/* ------------------------------------------------------------------ 9 */
{
  title: 'Numbers, Dates and Times',
  description: 'Say and write the details that carry the information.',
  module: 'Listening',
  level: 'Beginner',
  cefr: 'A1',
  content:
`Numbers carry the most important information in most calls and meetings, and they are the easiest thing to mishear.

TELEPHONE NUMBERS
Said digit by digit, not in thousands: 98452 is "nine eight four five two", never "ninety-eight thousand...".
A repeated digit is often "double": 4422 becomes "double four double two".
Zero is said "oh" in British English and "zero" in American English.

LARGE NUMBERS - the lakh and crore problem
International English does not use lakh or crore. Convert them:
1 lakh = 100,000 = "one hundred thousand"
10 lakh = 1,000,000 = "one million"
1 crore = 10,000,000 = "ten million"
100 crore = 1,000,000,000 = "one billion"
Writing "Rs. 5 lakh" to an international reader is unclear; write "500,000 rupees".

DATES
British: 20 March 2026, said "the twentieth of March"
American: March 20, 2026, said "March twentieth"
CRITICAL: 03/04/2026 means 3 April in Britain and 4 March in America. In international writing, always spell the month out to avoid a costly mistake.

TIMES
9:15 is "nine fifteen" or "a quarter past nine"
9:30 is "nine thirty" or "half past nine"
9:45 is "nine forty-five" or "a quarter to ten" - note it becomes TEN, not nine
12:00 midday is "noon"; 24:00 is "midnight"

LISTENING STRATEGY
Write numbers down as you hear them; do not wait for the sentence to finish. Then read them back to confirm: "So that is the twentieth of March at half past two?" Confirming is normal professional behaviour, not a sign of weak English.`,
  practice_text: 'My number is nine double four two, three one seven. The meeting is on the twentieth of March at half past two. The budget is five hundred thousand rupees.',
  exercises: [
    { type:'mcq', question:'How do you say a phone number ending 4422?',
      options:['four thousand four hundred twenty-two','double four double two','forty-four twenty-two thousand','four-four-two-two hundred'],
      answer:1, explanation:'Phone numbers are said digit by digit, and repeated digits usually become "double".' },
    { type:'mcq', question:'1 crore in international English is:',
      options:['one lakh','one million','ten million','one billion'],
      answer:2, explanation:'1 crore = 10,000,000 = ten million. Lakh and crore are not used in international English.' },
    { type:'fill', question:'9:45 can be said as "a quarter to ___".', answer:'ten',
      explanation:'"A quarter to" counts forward to the NEXT hour, so 9:45 is a quarter to ten.' },
    { type:'mcq', question:'In British English, 03/04/2026 means:',
      options:['3 April 2026','4 March 2026','It is ambiguous in Britain','March 2034'],
      answer:0, explanation:'British format is day/month, so 03/04 is 3 April. In America the same digits mean 4 March, which is why you should spell the month out.' },
    { type:'mcq', question:'What is the safest way to write a date for an international reader?',
      options:['20/03/2026','03/20/2026','20 March 2026','20-03-26'],
      answer:2, explanation:'Spelling the month out removes all ambiguity between the British and American conventions.' },
    { type:'fill', question:'1 lakh written in international figures is 100,___ .', answer:'000',
      explanation:'1 lakh = 100,000, said "one hundred thousand".' },
    { type:'mcq', question:'You did not catch a number on a call. What should you do?',
      options:['Guess and continue','Say nothing and hope','Read back what you heard and ask them to confirm','End the call'],
      answer:2, explanation:'Reading the number back to confirm is standard professional practice, not a sign of poor English.' }
  ],
  vocabulary: [
    { word:'confirm', meaning:'to check that something is definitely correct', example:'Please confirm the meeting time.' },
    { word:'ambiguous', meaning:'having more than one possible meaning', example:'That date format is ambiguous.' },
    { word:'budget', meaning:'the amount of money available for something', example:'The budget is five hundred thousand rupees.' },
    { word:'approximately', meaning:'roughly, about', example:'The plot is approximately two acres.' }
  ]
},

/* ------------------------------------------------------------------ 10 */
{
  title: 'Core Everyday Vocabulary',
  description: 'The high-frequency words that carry most conversations.',
  module: 'Vocabulary',
  level: 'Beginner',
  cefr: 'A1',
  content:
`A small number of words does most of the work in English. Learn these thoroughly before moving to rare vocabulary.

THE EIGHT VERBS THAT DO EVERYTHING
get - obtain, receive, become: "I got the file." "It is getting late."
make - create, cause: "Make a decision." "It makes no difference."
take - carry, require, accept: "Take the file upstairs." "It takes an hour."
give - transfer: "Give me the report."
go - move away: "I go to the office by train."
come - move towards: "Come to my desk."
put - place: "Put it on the table."
do - perform: "Do the work."

MAKE vs DO - a frequent error
DO is for work, tasks and duties: do the work, do a favour, do business, do your duty, do homework.
MAKE is for creating and producing: make a decision, make a mistake, make an appointment, make progress, make a phone call, make arrangements.
So it is "make a mistake", never "do a mistake"; and "do the work", never "make the work".

TIME WORDS
now, today, tomorrow, yesterday, soon, later, already, yet, still, always, never, sometimes, usually

PLACE WORDS
here, there, near, far, above, below, inside, outside, between, beside, upstairs, downstairs

USEFUL ADJECTIVE PAIRS
big/small, long/short, new/old, easy/difficult, cheap/expensive, early/late, full/empty, clean/dirty, right/wrong, same/different

HOW TO LEARN A WORD PROPERLY
Do not memorise the word alone. Learn it inside a sentence you might actually say, note whether it is countable, and note the words that normally go with it. "Make a decision" is one unit; storing "decision" by itself will not stop you from saying "do a decision".`,
  practice_text: 'I need to make a decision today. Please take this file upstairs and give it to my colleague. It takes about an hour to finish the work.',
  exercises: [
    { type:'mcq', question:'Choose the correct phrase.',
      options:['do a mistake','make a mistake','take a mistake','give a mistake'],
      answer:1, explanation:'"Make" is used for producing or causing something, including mistakes. "Do a mistake" is a very common error.' },
    { type:'fill', question:'I need to ___ a decision before Friday.', answer:'make',
      explanation:'Decisions are made, not done. "Make a decision" is a fixed collocation.' },
    { type:'fill', question:'Please ___ the work before you leave.', answer:'do',
      explanation:'"Do" is used for work, tasks and duties.' },
    { type:'mcq', question:'Which is correct?',
      options:['make your duty','do your duty','take your duty','give your duty'],
      answer:1, explanation:'Duties, like work and homework, take "do".' },
    { type:'mcq', question:'"It ___ an hour to reach the site."',
      options:['makes','does','takes','gives'],
      answer:2, explanation:'"Take" is used for the time something requires: it takes an hour.' },
    { type:'correct', question:'He did a big progress this month.', answer:'He made good progress this month.',
      explanation:'Two fixes: progress is MADE not done, and "progress" is uncountable so it takes "good", not "a big".' },
    { type:'mcq', question:'What is the best way to learn a new word?',
      options:['Memorise the word alone','Learn it in a sentence with the words that go with it','Write it fifty times','Learn only its translation'],
      answer:1, explanation:'Words behave in combinations. Learning "make a decision" as a unit prevents errors that learning "decision" alone will not.' }
  ],
  vocabulary: [
    { word:'decision', meaning:'a choice you make after thinking', example:'I must make a decision today.' },
    { word:'progress', meaning:'movement towards a goal (uncountable)', example:'She is making good progress.' },
    { word:'appointment', meaning:'an arranged meeting at a set time', example:'I made an appointment for Tuesday.' },
    { word:'arrangement', meaning:'a plan agreed with other people', example:'We made arrangements for the site visit.' },
    { word:'difference', meaning:'the way two things are not the same', example:'It makes no difference to me.' }
  ]
}

];
