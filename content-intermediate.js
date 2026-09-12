/**
 * INTERMEDIATE course content (CEFR A2-B1).
 */

module.exports = [

/* ------------------------------------------------------------------ 1 */
{
  title: 'Present Continuous vs Present Simple',
  description: 'The difference between "I work" and "I am working".',
  module: 'Grammar',
  level: 'Intermediate',
  cefr: 'A2',
  content:
`These two tenses are not interchangeable, and choosing wrongly changes your meaning.

PRESENT SIMPLE - permanent, routine, general
"I work at the port authority." (my job, ongoing)
"She checks the records every morning." (routine)
"Water boils at 100 degrees." (general fact)

PRESENT CONTINUOUS - happening now, or temporary
Formed with am/is/are + verb-ing.
"I am working on the lease renewals." (right now, or this period)
"She is checking the records." (at this moment)
"He is living with his brother while his house is repaired." (temporary)

THE CONTRAST IN ONE PAIR
"I work in estate management." - that is my profession.
"I am working on the valuation file." - that is my current task.
Both can be true simultaneously; they answer different questions.

VERBS THAT RESIST THE CONTINUOUS FORM
State verbs describe conditions, not actions, and normally stay simple:
know, understand, believe, remember, forget, want, need, like, love, hate, prefer, own, belong, seem, mean, contain, cost.

So "I am knowing the answer" is wrong; say "I know the answer".
"I am wanting tea" is wrong; say "I want tea".

The important exception is "have". When it means possession it stays simple ("I have two files"), but in action phrases it takes the continuous freely ("I am having lunch", "We are having a meeting").

FUTURE ARRANGEMENTS
The present continuous is also the natural way to state a fixed future plan: "I am meeting the contractor on Thursday." This is more common in speech than "I will meet".`,
  practice_text: 'I work in estate management, but this month I am working on the lease renewals. She is checking the records right now. I am meeting the contractor on Thursday.',
  exercises: [
    { type:'mcq', question:'Choose the correct sentence.',
      options:['I am knowing the answer.','I know the answer.','I am know the answer.','I knowing the answer.'],
      answer:1, explanation:'"Know" is a state verb and does not normally take the continuous form.' },
    { type:'fill', question:'Please be quiet - she ___ (talk) to the manager at the moment.', answer:'is talking',
      explanation:'"At the moment" signals something in progress now, so use the present continuous.' },
    { type:'fill', question:'Water ___ (boil) at 100 degrees Celsius.', answer:'boils',
      explanation:'A general scientific fact takes the present simple.' },
    { type:'mcq', question:'Which sentence describes your permanent job?',
      options:['I am working on the valuation file.','I work in estate management.','I am meeting the contractor.','I am checking the records.'],
      answer:1, explanation:'The present simple describes the permanent situation; the continuous describes the current task.' },
    { type:'correct', question:'I am wanting a copy of the deed.', answer:'I want a copy of the deed.',
      explanation:'"Want" is a state verb and stays in the simple form.' },
    { type:'mcq', question:'Which is correct for a fixed future plan?',
      options:['I meet the contractor on Thursday.','I am meeting the contractor on Thursday.','I will meeting the contractor Thursday.','I am meet the contractor Thursday.'],
      answer:1, explanation:'The present continuous is the natural way to state a fixed arrangement already in the diary.' },
    { type:'mcq', question:'Which use of "have" correctly takes the continuous?',
      options:['I am having two brothers.','I am having a car.','We are having a meeting at four.','She is having blue eyes.'],
      answer:2, explanation:'"Have a meeting" is an action phrase, so the continuous works. Possession ("have a car") stays simple.' }
  ],
  vocabulary: [
    { word:'renewal', meaning:'the act of extending an agreement for a further period', example:'The lease renewal is due in March.' },
    { word:'valuation', meaning:'an estimate of what something is worth', example:'We are awaiting the valuation report.' },
    { word:'contractor', meaning:'a person or firm hired to do a specific job', example:'The contractor starts on Monday.' },
    { word:'temporary', meaning:'lasting only a short time', example:'This is a temporary arrangement.' }
  ]
},

/* ------------------------------------------------------------------ 2 */
{
  title: 'Past Simple and Past Continuous',
  description: 'Narrate events and set the background scene.',
  module: 'Grammar',
  level: 'Intermediate',
  cefr: 'A2',
  content:
`PAST SIMPLE - completed actions in sequence
Regular verbs add -ed: checked, signed, approved, submitted.
Irregular verbs must be memorised: go/went, see/saw, take/took, write/wrote, send/sent, give/gave, come/came, do/did, have/had, make/made, get/got, find/found, think/thought, tell/told, leave/left.

"I opened the file, checked the survey and signed the approval." Three completed actions, in order.

Negatives and questions use "did", and the main verb returns to its base form:
"I did not sign it." (never "did not signed")
"Did you sign it?" (never "Did you signed")

PAST CONTINUOUS - the background, the action in progress
Formed with was/were + verb-ing.
"I was reviewing the file when the manager called."

THE STANDARD COMBINATION
The longer, interrupted action takes the continuous; the short interrupting action takes the simple:
"While I was checking the records, the power went off."
"I was leaving the office when he arrived."

Notice the linking words: WHILE and AS usually introduce the continuous; WHEN usually introduces the simple.

TWO PARALLEL ACTIONS
Use the continuous twice: "I was drafting the note while she was verifying the measurements."

USED TO - past habits that have stopped
"I used to work in Nellore." (I no longer do.)
The negative is "did not use to", without the d.

THE COMMONEST ERROR
Mixing the past simple with the present perfect. If you state a finished time, you must use the past simple: "I sent it yesterday", never "I have sent it yesterday".`,
  practice_text: 'I was checking the records when the call came. I opened the file, verified the survey and signed the approval. I used to work in Nellore before I moved to Mumbai.',
  exercises: [
    { type:'fill', question:'I ___ (check) the file when the manager arrived.', answer:'was checking',
      explanation:'The longer, interrupted action takes the past continuous.' },
    { type:'fill', question:'She ___ (send) the report yesterday.', answer:'sent',
      explanation:'A completed action with a stated past time takes the past simple. "Send" is irregular: sent.' },
    { type:'mcq', question:'Choose the correct sentence.',
      options:['I did not signed the document.','I did not sign the document.','I not signed the document.','I didn\'t signing the document.'],
      answer:1, explanation:'After "did", the main verb returns to its base form. "Did" already carries the past tense.' },
    { type:'mcq', question:'"While I ___ the survey, the power went off."',
      options:['checked','was checking','have checked','am checking'],
      answer:1, explanation:'"While" introduces the ongoing background action, which takes the past continuous.' },
    { type:'correct', question:'Did you went to the site yesterday?', answer:'Did you go to the site yesterday?',
      explanation:'After "did", use the base form "go", not the past form "went".' },
    { type:'fill', question:'I ___ to work in Nellore, but I moved in 2015.', answer:'used',
      explanation:'"Used to" describes a past habit or state that has now stopped.' },
    { type:'correct', question:'I have submitted the file yesterday.', answer:'I submitted the file yesterday.',
      explanation:'A stated finished time ("yesterday") requires the past simple, not the present perfect.' },
    { type:'mcq', question:'Which sentence shows two parallel ongoing actions?',
      options:['I drafted the note while she verified the figures.','I was drafting the note while she was verifying the figures.','I was drafting the note when she verified the figures.','I draft the note while she verifies the figures.'],
      answer:1, explanation:'Two simultaneous ongoing actions both take the past continuous.' }
  ],
  vocabulary: [
    { word:'verify', meaning:'to check that something is true or accurate', example:'Please verify the measurements.' },
    { word:'approval', meaning:'official permission or agreement', example:'The file is awaiting approval.' },
    { word:'interrupt', meaning:'to stop something that is in progress', example:'The call interrupted my review.' },
    { word:'previously', meaning:'before the time being discussed', example:'He previously worked in Nellore.' }
  ]
},

/* ------------------------------------------------------------------ 3 */
{
  title: 'Present Perfect',
  description: 'Connect the past to now - and stop confusing it with the past simple.',
  module: 'Grammar',
  level: 'Intermediate',
  cefr: 'B1',
  content:
`Formed with have/has + past participle: "I have sent", "She has finished".

WHEN TO USE IT
1. The time is unfinished or unstated: "I have sent the report." (It is done; when does not matter.)
2. Experience in your life so far: "I have visited Delhi three times."
3. Something that started in the past and continues now: "I have worked here since 2018."
4. A recent action with a present result: "I have lost my keys." (I still cannot get in.)

THE DECISIVE TEST: PAST SIMPLE OR PRESENT PERFECT?
If you state a finished time, you MUST use the past simple.
Correct: "I sent it yesterday." / "I sent it at four o'clock." / "I sent it last week."
Wrong: "I have sent it yesterday."

If the time is unstated or the period is still open, use the present perfect.
"I have sent it." / "I have sent three files today." (today is not over)

SINCE AND FOR
SINCE + a point in time: since 2018, since Monday, since I joined.
FOR + a length of time: for eight years, for two weeks, for a long time.
"I have worked here since 2018" and "I have worked here for eight years" mean the same thing.

Note that English uses the present perfect here where many languages use the present: "I am working here since 2018" is wrong.

ALREADY, YET, JUST, STILL
already - sooner than expected: "She has already submitted it."
yet - in negatives and questions: "I have not signed it yet." "Have you finished yet?"
just - a moment ago: "He has just left."
still - continuing, usually with a negative: "I still have not received a reply."

BEEN vs GONE
"He has gone to Delhi" - he is there now.
"He has been to Delhi" - he went and has returned.`,
  practice_text: 'I have worked here since 2018. She has already submitted three files this week. I have not received a reply yet. He has just left for the site.',
  exercises: [
    { type:'mcq', question:'Choose the correct sentence.',
      options:['I have sent the file yesterday.','I sent the file yesterday.','I have send the file yesterday.','I am sending the file yesterday.'],
      answer:1, explanation:'"Yesterday" is a finished time, which forces the past simple.' },
    { type:'fill', question:'I have worked here ___ 2018.', answer:'since',
      explanation:'"Since" is used with a point in time. "For" would need a duration: for eight years.' },
    { type:'fill', question:'She has worked here ___ eight years.', answer:'for',
      explanation:'"For" is used with a length of time.' },
    { type:'mcq', question:'"I have not signed it ___."',
      options:['already','yet','since','just'],
      answer:1, explanation:'"Yet" is used in negatives and questions to mean "up to now".' },
    { type:'correct', question:'I am working in this office since 2018.', answer:'I have worked in this office since 2018.',
      explanation:'For an action starting in the past and continuing now, English uses the present perfect, not the present continuous.' },
    { type:'mcq', question:'"He has gone to Delhi" means:',
      options:['He is in Delhi now.','He visited Delhi and came back.','He will go to Delhi.','He lives in Delhi.'],
      answer:0, explanation:'"Has gone" means he is still there. "Has been to" would mean he went and returned.' },
    { type:'fill', question:'Have you finished the draft ___?', answer:'yet',
      explanation:'"Yet" appears at the end of questions and negatives with the present perfect.' },
    { type:'mcq', question:'Which sentence is correct?',
      options:['I have visited Delhi in 2015.','I visited Delhi in 2015.','I have been visiting Delhi in 2015.','I am visiting Delhi in 2015.'],
      answer:1, explanation:'"In 2015" is a finished time, so the past simple is required.' }
  ],
  vocabulary: [
    { word:'experience', meaning:'knowledge gained from doing something over time', example:'She has eight years of experience.' },
    { word:'recently', meaning:'a short time ago', example:'I have recently joined this department.' },
    { word:'receive', meaning:'to get something that is sent to you', example:'I have not received a reply yet.' },
    { word:'submit', meaning:'to formally hand something in', example:'He has already submitted the form.' }
  ]
},

/* ------------------------------------------------------------------ 4 */
{
  title: 'Conditionals: First and Second',
  description: 'Talk about real possibilities and imaginary situations.',
  module: 'Grammar',
  level: 'Intermediate',
  cefr: 'B1',
  content:
`ZERO CONDITIONAL - things that are always true
If + present simple, present simple.
"If you heat water to 100 degrees, it boils."
"If a file is incomplete, we return it." (standard procedure)

FIRST CONDITIONAL - a real, likely possibility
If + present simple, WILL + base verb.
"If the approval comes today, I will process it."
"If it rains, we will postpone the site visit."

The crucial rule: never put "will" in the if-clause. "If it will rain" is wrong. The if-clause stays in the present even though it refers to the future.

SECOND CONDITIONAL - unreal, unlikely or imaginary
If + past simple, WOULD + base verb.
"If I had more time, I would learn Spanish." (I do not have more time.)
"If I were the manager, I would change the system." (I am not the manager.)

Note "were" rather than "was" with I/he/she/it in this structure. "If I were you" is the fixed form, and it is the standard way to give advice.

The second rule: never put "would" in the if-clause. "If I would have time" is wrong.

FIRST OR SECOND? - it depends on how likely you think it is
"If I get the promotion, I will move to Delhi." (I expect it might happen.)
"If I got the promotion, I would move to Delhi." (I doubt it will.)
Both are grammatical; they signal different levels of confidence.

UNLESS
"Unless" means "if not": "I will not sign it unless the survey is attached" = "I will not sign it if the survey is not attached." Do not add a second negative after "unless".`,
  practice_text: 'If the approval comes today, I will process it immediately. If I were the manager, I would simplify the procedure. I will not sign it unless the survey is attached.',
  exercises: [
    { type:'mcq', question:'Choose the correct first conditional.',
      options:['If it will rain, we will postpone.','If it rains, we will postpone.','If it rains, we postpone.','If it would rain, we will postpone.'],
      answer:1, explanation:'The if-clause stays in the present simple; "will" belongs only in the main clause.' },
    { type:'fill', question:'If I ___ (be) you, I would accept the offer.', answer:'were',
      explanation:'In the second conditional, "were" is used with I/he/she/it. "If I were you" is the standard form for giving advice.' },
    { type:'fill', question:'If the file arrives today, I ___ process it. (will / would)', answer:'will',
      explanation:'This is a real possibility, so it is a first conditional and takes "will".' },
    { type:'mcq', question:'Which sentence describes an imaginary situation?',
      options:['If the approval comes, I will process it.','If I had more staff, I would finish faster.','If you heat water, it boils.','If it rains, we will postpone.'],
      answer:1, explanation:'"If I had more staff" is a second conditional: it imagines a situation contrary to fact.' },
    { type:'correct', question:'If I would have more time, I would learn Spanish.', answer:'If I had more time, I would learn Spanish.',
      explanation:'"Would" never appears in the if-clause. The second conditional uses the past simple there.' },
    { type:'mcq', question:'"I will not sign it unless the survey is attached" means:',
      options:['I will sign it even without the survey.','I will only sign it if the survey is attached.','I will never sign it.','The survey is already attached.'],
      answer:1, explanation:'"Unless" means "if not", so signing depends on the survey being attached.' },
    { type:'correct', question:'Unless you do not submit the form, we cannot proceed.', answer:'Unless you submit the form, we cannot proceed.',
      explanation:'"Unless" already contains the negative. Adding "do not" creates a double negative that reverses your meaning.' },
    { type:'fill', question:'If a file is incomplete, we ___ (return) it. (standard procedure)', answer:'return',
      explanation:'A general rule that is always true takes the zero conditional: present simple in both clauses.' }
  ],
  vocabulary: [
    { word:'postpone', meaning:'to move something to a later time', example:'We postponed the site visit.' },
    { word:'procedure', meaning:'the official way of doing something', example:'The procedure requires two signatures.' },
    { word:'incomplete', meaning:'missing some parts', example:'The application is incomplete.' },
    { word:'proceed', meaning:'to continue or go ahead', example:'We cannot proceed without approval.' },
    { word:'attach', meaning:'to fasten or include with something', example:'Please attach the survey report.' }
  ]
},

/* ------------------------------------------------------------------ 5 */
{
  title: 'Word Stress in Long Words',
  description: 'Put the emphasis on the right syllable, or risk not being understood.',
  module: 'Speaking',
  level: 'Intermediate',
  cefr: 'B1',
  content:
`Every English word of more than one syllable has exactly one strongly stressed syllable. The others are weak. Misplaced stress is the single biggest cause of being misunderstood, more than any individual sound.

WHAT STRESS ACTUALLY IS
The stressed syllable is longer, louder and higher in pitch. The unstressed syllables shrink, and their vowels often collapse to the weak "uh" schwa.

RELIABLE PATTERNS
Words ending in -tion, -sion, -cian: stress the syllable immediately BEFORE the ending.
informATion, educATion, administrATion, decISion, techNICian

Words ending in -ity, -ity, -ify, -ical, -ogy: stress two syllables before the ending.
possiBILity, resonsiBILity, idENtify, ecoNOMical, techNOLogy

Words ending in -ee, -eer, -ese: stress the ending itself.
employEE, engiNEER, JapanESE

Two-syllable nouns usually stress the first syllable; two-syllable verbs usually stress the second.

STRESS THAT CHANGES MEANING
Some words are a noun or a verb depending on stress alone:
RECord (noun: a document) vs reCORD (verb: to register)
PERmit (noun: a licence) vs perMIT (verb: to allow)
INcrease (noun) vs inCREASE (verb)
PREsent (noun: a gift) vs preSENT (verb: to show)
OBject (noun: a thing) vs obJECT (verb: to disagree)

So "I need to reCORD the RECord" has the stress on different syllables in the two words.

SENTENCE STRESS
Within a sentence, stress the content words (nouns, main verbs, adjectives) and weaken the grammar words (a, the, of, to, is, was). "I SENT the FILE to the MANager" has three strong beats. Stressing every word equally is what makes speech sound mechanical.`,
  practice_text: 'The administration requires documentation before registration is complete. I need to record the record of this decision. The engineer identified a possibility.',
  exercises: [
    { type:'mcq', question:'Where is the stress in "information"?',
      options:['IN-for-ma-tion','in-FOR-ma-tion','in-for-MA-tion','in-for-ma-TION'],
      answer:2, explanation:'Words ending in -tion stress the syllable immediately before the ending: informATion.' },
    { type:'mcq', question:'Where is the stress in "possibility"?',
      options:['POS-si-bil-i-ty','pos-SI-bil-i-ty','pos-si-BIL-i-ty','pos-si-bil-I-ty'],
      answer:2, explanation:'Words ending in -ity stress two syllables before the ending: possiBILity.' },
    { type:'mcq', question:'In "I need to record this", where does the stress fall on "record"?',
      options:['RE-cord (first syllable)','re-CORD (second syllable)','Both equally','It does not matter'],
      answer:1, explanation:'As a verb it is reCORD. As a noun (a document) it is RECord.' },
    { type:'mcq', question:'"He refused to sign the PERmit." What is "permit" here?',
      options:['A verb meaning to allow','A noun meaning a licence','An adjective','It is ambiguous'],
      answer:1, explanation:'Stress on the first syllable marks it as a noun: a PERmit is a licence.' },
    { type:'mcq', question:'Where is the stress in "engineer"?',
      options:['EN-gi-neer','en-GI-neer','en-gi-NEER','All syllables equally'],
      answer:2, explanation:'Words ending in -eer take the stress on the ending itself: engiNEER.' },
    { type:'mcq', question:'Which words should be stressed in "I sent the file to the manager"?',
      options:['Every word equally','sent, file, manager','I, the, to','the, to, the'],
      answer:1, explanation:'Stress the content words - main verb, nouns - and weaken the grammar words.' },
    { type:'mcq', question:'What happens to unstressed vowels in English?',
      options:['They are pronounced fully and clearly','They usually reduce to a weak "uh" schwa','They are always silent','They become longer'],
      answer:1, explanation:'Unstressed vowels reduce to the schwa. Pronouncing every vowel fully is what makes speech sound unnatural.' }
  ],
  vocabulary: [
    { word:'documentation', meaning:'the official papers supporting something', example:'Submit the documentation with the form.' },
    { word:'registration', meaning:'the act of officially recording something', example:'Registration closes on Friday.' },
    { word:'identify', meaning:'to recognise or name something', example:'Please identify the missing annexure.' },
    { word:'emphasis', meaning:'special importance given to something', example:'Put the emphasis on the first syllable.' }
  ]
},

/* ------------------------------------------------------------------ 6 */
{
  title: 'Connected Speech and Linking',
  description: 'Why native speech sounds fast, and how to sound natural.',
  module: 'Speaking',
  level: 'Intermediate',
  cefr: 'B1',
  content:
`Native speakers do not leave gaps between words. Words run into each other, and learning these joins is what turns word-by-word speech into fluency.

LINKING CONSONANT TO VOWEL
When a word ends in a consonant and the next begins with a vowel, they join:
"pick it up" sounds like "pi-ki-tup"
"an hour and a half" sounds like "a-nou-ran-a-half"
"look at it" sounds like "loo-ka-tit"
"turn it off" sounds like "tur-ni-toff"

LINKING VOWEL TO VOWEL
A /w/ or /y/ sound appears between them:
"go on" sounds like "go-won"
"I am" sounds like "I-yam"
"do it" sounds like "do-wit"

DISAPPEARING SOUNDS
A /t/ or /d/ between consonants is often dropped:
"next day" sounds like "neks day"
"used to" sounds like "yoos to"
"I don't know" often becomes "I dunno"

WEAK FORMS - the biggest listening obstacle
Grammar words lose their full vowel in normal speech:
and becomes "n" - "fish and chips" sounds like "fish-n-chips"
of becomes "uv" - "a cup of tea" sounds like "a cuppa tea"
to becomes "tuh" - "I want to go" sounds like "I wanna go"
you becomes "yuh" - "what do you think" sounds like "whaddya think"
have becomes "uv" - "should have" sounds like "shoulda"

This is why fast English sounds impossible at first. You are listening for full vowels that are simply not there.

PRACTICE METHOD
Take one sentence and say it slowly, then gradually faster, deliberately joining the words. Do not speed up your individual words; instead remove the gaps between them. That is what fluency actually is.`,
  practice_text: 'Pick it up and put it on the table. I need an hour and a half. What do you think about it? I should have turned it off.',
  exercises: [
    { type:'mcq', question:'How does "pick it up" sound in natural speech?',
      options:['pick. it. up.','pi-ki-tup','pick-it-up with pauses','peek eet oop'],
      answer:1, explanation:'The final consonants link to the following vowels, producing "pi-ki-tup".' },
    { type:'mcq', question:'"Whaddya think?" is the natural form of:',
      options:['What you think?','What do you think?','Who do you think?','What did you think?'],
      answer:1, explanation:'"Do you" reduces to "dya" in rapid speech, giving "whaddya".' },
    { type:'mcq', question:'In "a cup of tea", the word "of" is usually pronounced:',
      options:['with a full clear "o"','as a weak "uv" or even just "a"','as "off"','it is silent'],
      answer:1, explanation:'"Of" is a grammar word and takes a weak form, giving "a cuppa tea".' },
    { type:'mcq', question:'What sound appears between the words in "go on"?',
      options:['A /w/ sound','A /t/ sound','A pause','Nothing changes'],
      answer:0, explanation:'Vowel-to-vowel links insert a /w/ or /y/ glide: "go-won".' },
    { type:'mcq', question:'Why is fast English hard to understand at first?',
      options:['Native speakers use rare vocabulary','Grammar words lose their full vowels, so you listen for sounds that are not there','They speak at twice the normal speed','They use incorrect grammar'],
      answer:1, explanation:'Weak forms remove the full vowels from grammar words. The difficulty is reduction, not raw speed.' },
    { type:'mcq', question:'What is the best way to practise sounding fluent?',
      options:['Say each word faster','Remove the gaps between words while keeping each word clear','Speak more loudly','Memorise long sentences'],
      answer:1, explanation:'Fluency comes from linking words together, not from speeding up individual words.' },
    { type:'fill', question:'"I should ___ checked it first." (the reduced spoken form of "should have")', answer:'have',
      explanation:'In speech "should have" reduces to "shoulda", but in writing it must always be "should have" - never "should of".' }
  ],
  vocabulary: [
    { word:'fluency', meaning:'the ability to speak smoothly without hesitating', example:'Linking words improves fluency.' },
    { word:'natural', meaning:'normal and not forced', example:'Try to sound natural, not mechanical.' },
    { word:'reduce', meaning:'to make smaller or weaker', example:'Unstressed vowels reduce in fast speech.' },
    { word:'deliberately', meaning:'on purpose, intentionally', example:'Deliberately join the words together.' }
  ]
},

/* ------------------------------------------------------------------ 7 */
{
  title: 'Skimming and Scanning',
  description: 'Get what you need from a long document quickly.',
  module: 'Reading',
  level: 'Intermediate',
  cefr: 'B1',
  content:
`Reading every word of a long document is usually the wrong strategy. Choose your technique before you start, based on what you need.

SKIMMING - to get the overall picture
Read the title, the first and last paragraphs in full, then the FIRST SENTENCE of every paragraph in between. In well-written English that first sentence is the topic sentence and carries the paragraph's main point. In three or four minutes you will know what a twenty-page report argues.

Use skimming when you must decide whether a document is relevant at all, or summarise it.

SCANNING - to find one specific piece of information
Do not read. Move your eyes down the page hunting for a visual shape: a number, a date, a capital letter, a currency symbol. Your brain recognises "20 March" or "Rs." far faster than it reads sentences.

Use scanning for deadlines, amounts, names and clause numbers.

INTENSIVE READING - to understand precisely
Slow, every word, re-reading where needed. Reserve this for the clauses that actually bind you: penalties, notice periods, liabilities.

A PRACTICAL SEQUENCE FOR AN OFFICIAL DOCUMENT
1. Scan the first page for parties, dates and the subject.
2. Skim the headings to map the structure.
3. Scan for the numbers that matter: dates, amounts, periods.
4. Read intensively only the two or three clauses that carry obligations.

GUESSING VOCABULARY FROM CONTEXT
Do not stop at every unknown word. Ask: is it a noun or a verb? Is it positive or negative? Does the sentence still make sense without it? Most unknown words are not essential to your purpose. Look up a word only when the meaning of a binding clause depends on it.`,
  practice_text: 'Read the clauses and locate the renewal date, the notice period and the penalty amount. Skim the headings first, then scan for the figures.',
  exercises: [
    { type:'mcq', question:'You need to find the deadline in a twelve-page contract. Which technique?',
      options:['Skimming','Scanning','Intensive reading','Read it from start to finish'],
      answer:1, explanation:'Scanning hunts for one specific item - here a date - without reading the surrounding text.' },
    { type:'mcq', question:'When skimming, which sentence of each paragraph matters most?',
      options:['The last one','The first one','The longest one','The one with numbers'],
      answer:1, explanation:'In well-structured English the first sentence is the topic sentence and carries the paragraph\'s main point.' },
    { type:'mcq', question:'You must decide whether a report is relevant at all. Which technique?',
      options:['Skimming','Scanning','Intensive reading','Translating it'],
      answer:0, explanation:'Skimming gives you the overall picture quickly, which is what a relevance decision needs.' },
    { type:'mcq', question:'Which parts of a contract deserve intensive reading?',
      options:['Every clause equally','The introduction','The clauses carrying penalties, notice periods and liabilities','The signature page'],
      answer:2, explanation:'Reserve slow, careful reading for the clauses that actually create obligations.' },
    { type:'mcq', question:'You meet an unknown word while scanning for a date. You should:',
      options:['Stop and look it up immediately','Ignore it and continue - it is probably irrelevant to your purpose','Abandon the document','Translate the whole paragraph'],
      answer:1, explanation:'Most unknown words are not essential to your purpose. Look a word up only when a binding clause depends on it.' },
    { type:'mcq', question:'What is the first step when approaching a long official document?',
      options:['Read every word carefully','Scan the first page for parties, dates and subject','Look up all difficult words','Start from the last page'],
      answer:1, explanation:'Establish who, when and what first; that frames everything you read afterwards.' }
  ],
  vocabulary: [
    { word:'clause', meaning:'a numbered section of a legal document', example:'Clause 7 covers the notice period.' },
    { word:'notice period', meaning:'the advance warning required before ending an agreement', example:'The notice period is three months.' },
    { word:'penalty', meaning:'a punishment, often a payment, for breaking a rule', example:'A penalty applies after the due date.' },
    { word:'liability', meaning:'legal responsibility for something', example:'The contractor accepts liability for damage.' },
    { word:'relevant', meaning:'connected with what you are dealing with', example:'Only two clauses are relevant here.' }
  ]
},

/* ------------------------------------------------------------------ 8 */
{
  title: 'Paragraph Structure',
  description: 'Write paragraphs that hold together and lead somewhere.',
  module: 'Writing',
  level: 'Intermediate',
  cefr: 'B1',
  content:
`A paragraph makes ONE point. If you find a second point, start a second paragraph.

THE STANDARD SHAPE
1. TOPIC SENTENCE - states the point, first.
2. SUPPORT - two to four sentences of evidence, explanation or example.
3. CLOSE or LINK - a conclusion, or a bridge to the next paragraph.

AN EXAMPLE
"The lease requires urgent review. [topic] The current terms expire in March, leaving only six weeks. Renewal at the existing rate would undervalue the plot by roughly forty percent against the 2024 ready reckoner. [support] I therefore recommend an immediate revaluation. [close]"

Notice that the reader knows the point from the very first sentence. English professional writing puts the conclusion first, not last. This differs from many academic traditions where the argument builds to the conclusion; in a workplace report, lead with it.

LINKING WORDS, USED SPARINGLY
Adding: in addition, furthermore, moreover
Contrasting: however, nevertheless, on the other hand
Result: therefore, consequently, as a result
Example: for instance, for example, in particular
Sequence: first, then, finally

Two warnings. First, do not begin every sentence with a linking word; it makes writing feel mechanical. Second, "however" is not a conjunction - you cannot join two sentences with it. "The rate is low, however we accepted it" is wrong. Write "The rate is low. However, we accepted it." or "The rate is low, but we accepted it."

PARAGRAPH LENGTH
Three to six sentences is normal. A one-sentence paragraph is acceptable for emphasis. A paragraph running past ten sentences almost always contains two points that should be separated.

TESTING YOUR OWN PARAGRAPH
Cover everything except the first sentence. Does it tell the reader the point? If not, your topic sentence is buried somewhere below and should be moved up.`,
  practice_text: 'The lease requires urgent review. The current terms expire in March. Renewal at the existing rate would undervalue the plot. I therefore recommend an immediate revaluation.',
  exercises: [
    { type:'mcq', question:'Where does the topic sentence belong in professional English writing?',
      options:['At the end, as a conclusion','At the beginning of the paragraph','In the middle','It is optional'],
      answer:1, explanation:'English professional writing leads with the point so the reader knows it immediately.' },
    { type:'mcq', question:'How many main points should one paragraph contain?',
      options:['As many as possible','One','Two or three','At least four'],
      answer:1, explanation:'One point per paragraph. A second point means a second paragraph.' },
    { type:'mcq', question:'Which sentence is punctuated correctly?',
      options:['The rate is low, however we accepted it.','The rate is low however we accepted it.','The rate is low. However, we accepted it.','The rate is low; however we accepted it.'],
      answer:2, explanation:'"However" is an adverb, not a conjunction, so it cannot join two sentences with only a comma.' },
    { type:'fill', question:'The survey was incomplete. ___, we returned the file. (result)', answer:'Therefore',
      explanation:'"Therefore" introduces a result or consequence.' },
    { type:'mcq', question:'A paragraph runs to twelve sentences. What is the likely problem?',
      options:['Nothing, longer is better','It probably contains two points that should be separated','It needs more linking words','It should be one sentence'],
      answer:1, explanation:'Very long paragraphs almost always contain a second point that deserves its own paragraph.' },
    { type:'mcq', question:'How do you test whether your topic sentence works?',
      options:['Count the words','Cover the rest of the paragraph and see whether the first sentence conveys the point','Check the grammar','Read it aloud'],
      answer:1, explanation:'If the first sentence alone does not convey the point, the real topic sentence is buried lower and should be moved up.' },
    { type:'correct', question:'Furthermore, moreover, the rate is also too low in addition.', answer:'Furthermore, the rate is too low.',
      explanation:'Stacking linking words adds no meaning. One is enough.' }
  ],
  vocabulary: [
    { word:'recommend', meaning:'to suggest a course of action', example:'I recommend an immediate revaluation.' },
    { word:'undervalue', meaning:'to assess something as worth less than it is', example:'The renewal would undervalue the plot.' },
    { word:'consequently', meaning:'as a result', example:'Consequently, the file was returned.' },
    { word:'expire', meaning:'to come to an end', example:'The current terms expire in March.' }
  ]
},

/* ------------------------------------------------------------------ 9 */
{
  title: 'Formal Email Writing',
  description: 'Write workplace emails that get read and answered.',
  module: 'Writing',
  level: 'Intermediate',
  cefr: 'B1',
  content:
`SUBJECT LINE
Specific and actionable. "Approval required: lease renewal, Plot 14, by 20 March" tells the reader what it is and what they must do. "Regarding a matter" tells them nothing.

OPENING
Formal, name unknown: "Dear Sir or Madam,"
Formal, name known: "Dear Mr Sharma," (no first name, no full stop after Mr in British usage)
Neutral professional: "Dear Anjali," or "Hello Anjali,"
Never: "Respected Sir," "Dear Sir/Madam," or "Hi Sir" - these are not standard international English.

FIRST LINE - state your purpose immediately
"I am writing to request approval for the revised estate plan."
"I am writing to follow up on my email of 3 March."
Do not open with "Hope you are doing well" and leave the purpose to paragraph three. Busy readers decide in one line whether to keep reading.

BODY
One request per email. Give the necessary context in two or three sentences, state exactly what you need, and state the deadline. If you have several unrelated requests, send several emails; they will be actioned separately anyway.

CLOSING REQUEST
"Could you please confirm by 20 March?"
"I would be grateful if you could review the attached draft."
"Please let me know if you need any further information."

SIGN-OFF
"Yours sincerely," when you used the person's name.
"Yours faithfully," when you wrote "Dear Sir or Madam." (British convention)
"Kind regards," or "Best regards," for ordinary professional email - this is the safest everyday choice.

EXPRESSIONS TO AVOID
"Please do the needful" - state the actual action required.
"Please revert back" - say "please reply" or "please respond".
"Kindly" everywhere - "please" is the international standard.
"Same" as a pronoun ("please find the same attached") - say "please find it attached" or simply "I have attached it".
"Prepone" - say "bring forward" or "move earlier".`,
  practice_text: 'Dear Mr Sharma, I am writing to request approval for the revised estate plan. Could you please confirm by 20 March? Kind regards, Naresh.',
  exercises: [
    { type:'mcq', question:'Which subject line is best?',
      options:['Regarding a matter','Important!!','Approval required: lease renewal, Plot 14, by 20 March','Hello sir'],
      answer:2, explanation:'A good subject line states the topic and the action required, so the reader can prioritise it.' },
    { type:'mcq', question:'What should the first line of a formal email do?',
      options:['Ask about the reader\'s health','State your purpose directly','Apologise for writing','Introduce your whole department'],
      answer:1, explanation:'Busy readers decide in one line whether to keep reading, so state the purpose first.' },
    { type:'mcq', question:'You wrote "Dear Sir or Madam". Which sign-off is correct in British convention?',
      options:['Yours sincerely','Yours faithfully','Thanks','Regarding'],
      answer:1, explanation:'"Yours faithfully" pairs with "Dear Sir or Madam"; "Yours sincerely" pairs with a named recipient.' },
    { type:'correct', question:'Please do the needful and revert back at the earliest.', answer:'Please review the file and reply by Friday.',
      explanation:'"Do the needful" hides the actual action, and "revert back" is redundant. State what you want and when.' },
    { type:'mcq', question:'Which opening is standard international English?',
      options:['Respected Sir,','Dear Sir/Madam,','Dear Mr Sharma,','Hi Sir,'],
      answer:2, explanation:'"Dear Mr Sharma" is standard. "Respected Sir" and "Hi Sir" are not used in international professional English.' },
    { type:'mcq', question:'You have three unrelated requests. What should you do?',
      options:['Put all three in one long email','Send three separate emails','Put them in a numbered list in one email','Wait and send them next week'],
      answer:1, explanation:'Unrelated requests get actioned separately anyway, so separate emails track better and get answered faster.' },
    { type:'correct', question:'Please find the same attached herewith for your kind perusal.', answer:'I have attached the draft for your review.',
      explanation:'"The same", "herewith" and "kind perusal" are dated officialese. Plain, direct English is clearer and more professional.' }
  ],
  vocabulary: [
    { word:'grateful', meaning:'thankful', example:'I would be grateful if you could confirm.' },
    { word:'confirm', meaning:'to state officially that something is correct or agreed', example:'Could you please confirm by Friday?' },
    { word:'attach', meaning:'to include a file with an email', example:'I have attached the revised draft.' },
    { word:'follow up', meaning:'to check on something you asked about earlier', example:'I am writing to follow up on my email of 3 March.' },
    { word:'revised', meaning:'changed and corrected', example:'Please see the revised estate plan.' }
  ]
},

/* ------------------------------------------------------------------ 10 */
{
  title: 'Phrasal Verbs in Daily Use',
  description: 'Verb plus preposition combinations you cannot guess from the parts.',
  module: 'Vocabulary',
  level: 'Intermediate',
  cefr: 'B1',
  content:
`A phrasal verb is a verb plus a small word, and the combination usually means something you could never work out from the pieces. "Look" and "into" are both simple, but "look into" means investigate.

THE ONES YOU WILL ACTUALLY USE AT WORK
look into - investigate: "We will look into the complaint."
carry out - perform: "The team carried out an inspection."
put off - postpone: "They put off the meeting."
call off - cancel: "The visit was called off."
take over - assume control: "She took over the department."
draw up - prepare a document: "We drew up a fresh agreement."
point out - draw attention to: "He pointed out an error in the survey."
turn down - reject: "They turned down the proposal."
bring forward - move to an earlier time: "Can we bring the meeting forward?"
follow up - check on progress: "Please follow up with the contractor."
sort out - resolve: "We sorted out the discrepancy."
come up with - produce an idea: "She came up with a workable plan."
go through - examine in detail: "Let us go through the clauses."
hold on - wait: "Hold on, I will check the file."
find out - discover: "I found out that the deed was unregistered."

SEPARABLE OR NOT
With most of these, a noun object can go in either position:
"Put off the meeting" or "Put the meeting off."
BUT a pronoun object must go in the middle:
"Put it off" is correct; "Put off it" is wrong.

Some are inseparable, and the object always follows the whole phrase:
"We will look into the matter" - never "look the matter into".

FORMALITY
Phrasal verbs are the natural, conversational choice. Formal writing often prefers a single Latin-derived verb: investigate rather than look into, postpone rather than put off, cancel rather than call off, prepare rather than draw up.

So say "We will look into it" in a meeting, and write "The matter will be investigated" in the report.`,
  practice_text: 'We will look into the complaint and carry out an inspection. Do not put it off any longer. She came up with a plan and drew up the agreement.',
  exercises: [
    { type:'mcq', question:'"We will look into the complaint" means we will:',
      options:['ignore it','investigate it','forward it','reject it'],
      answer:1, explanation:'"Look into" means investigate - a meaning you cannot derive from "look" plus "into".' },
    { type:'mcq', question:'Which is correct?',
      options:['Put off it.','Put it off.','Put off it off.','Off put it.'],
      answer:1, explanation:'A pronoun object must sit between the verb and the particle: "put it off".' },
    { type:'fill', question:'They ___ down the proposal because the rate was too low. (rejected)', answer:'turned',
      explanation:'"Turn down" means reject.' },
    { type:'mcq', question:'"The visit was called off" means it was:',
      options:['postponed','cancelled','confirmed','shortened'],
      answer:1, explanation:'"Call off" means cancel. "Put off" would mean postpone - moved, not cancelled.' },
    { type:'mcq', question:'Which is the formal written equivalent of "carry out an inspection"?',
      options:['do an inspection','conduct an inspection','make an inspection','put an inspection'],
      answer:1, explanation:'Formal writing prefers a single Latin-derived verb: conduct or perform an inspection.' },
    { type:'fill', question:'Can we ___ the meeting forward to Tuesday? (move it earlier)', answer:'bring',
      explanation:'"Bring forward" means move to an earlier time. "Prepone" is Indian English and is not understood internationally.' },
    { type:'mcq', question:'Which phrasal verb is INSEPARABLE?',
      options:['put off','turn down','look into','call off'],
      answer:2, explanation:'"Look into" is inseparable: the object always follows the whole phrase. "Look the matter into" is wrong.' },
    { type:'fill', question:'She ___ up with a workable solution. (produced an idea)', answer:'came',
      explanation:'"Come up with" means to produce an idea or suggestion.' }
  ],
  vocabulary: [
    { word:'inspection', meaning:'an official examination of something', example:'The team carried out an inspection.' },
    { word:'discrepancy', meaning:'a difference between things that should match', example:'We sorted out the discrepancy in the figures.' },
    { word:'complaint', meaning:'a statement that something is unsatisfactory', example:'We will look into the complaint.' },
    { word:'proposal', meaning:'a plan or suggestion put forward formally', example:'They turned down the proposal.' },
    { word:'workable', meaning:'practical and able to succeed', example:'She came up with a workable plan.' }
  ]
},

/* ------------------------------------------------------------------ 11 */
{
  title: 'Listening to Fast Speech',
  description: 'Follow natural-speed conversation without panicking.',
  module: 'Listening',
  level: 'Intermediate',
  cefr: 'B1',
  content:
`Understanding fast English is not about hearing every word. Native listeners do not hear every word either; they catch the stressed words and reconstruct the rest.

WHAT ACTUALLY HAPPENS IN FAST SPEECH
going to becomes "gonna"
want to becomes "wanna"
got to becomes "gotta"
did you becomes "didja"
what do you becomes "whaddya"
let me becomes "lemme"
give me becomes "gimme"
kind of becomes "kinda"
because becomes "cos"

These are not lazy or incorrect. They are normal spoken English, used by educated speakers in professional settings. They belong in speech, not in writing.

THE STRATEGY THAT WORKS
Listen for the STRESSED words. Meaning lives in the nouns, main verbs and adjectives. If you catch "sent - file - manager - Monday", you have the message, even if you missed every "the", "to" and "have".

Do not stop to translate. Translating one sentence means missing the next three. Let the unclear parts go and keep following; context usually fills them in a moment later.

Accept partial understanding. Seventy percent is enough to act on, and the missing thirty percent is mostly grammar words that carry no information.

ASKING FOR REPETITION - normal, not embarrassing
"Sorry, could you repeat that?"
"Could you say that again more slowly, please?"
"Do you mean...?" - then say it in your own words. This is the most useful one, because it confirms the meaning rather than just the sound.
"Sorry, I did not catch the last part."

HOW TO TRAIN
Listen to the same short clip three times: once for the general topic, once for the key facts, once with the transcript. Then listen a final time without the transcript. This builds the ear faster than listening to many clips once each.`,
  practice_text: 'Whaddya think about the proposal? I was gonna send it but I did not get the file. Sorry, could you repeat that more slowly?',
  exercises: [
    { type:'mcq', question:'"I was gonna send it" means:',
      options:['I was going to send it','I want to send it','I have sent it','I must send it'],
      answer:0, explanation:'"Gonna" is the normal spoken reduction of "going to".' },
    { type:'mcq', question:'Which words carry the meaning in fast speech?',
      options:['Grammar words like the, to, of','Stressed content words: nouns, main verbs, adjectives','The first word of each sentence','All words equally'],
      answer:1, explanation:'Meaning lives in the stressed content words; grammar words are reduced and carry little information.' },
    { type:'mcq', question:'You miss a word mid-sentence. What should you do?',
      options:['Stop and translate it','Let it go and keep following - context usually fills it in','Ask them to stop immediately','Give up on the conversation'],
      answer:1, explanation:'Stopping to translate costs you the next three sentences. Keep following and let context resolve the gap.' },
    { type:'mcq', question:'Which is the most useful way to confirm you understood?',
      options:['Could you repeat that?','Do you mean...? followed by your own words','Sorry?','Say again.'],
      answer:1, explanation:'Restating in your own words confirms the meaning, not merely the sound, so it catches misunderstandings.' },
    { type:'mcq', question:'Are reductions like "gonna" and "whaddya" incorrect English?',
      options:['Yes, only uneducated speakers use them','No, they are normal in speech but do not belong in writing','They are only used in America','They are grammatical errors'],
      answer:1, explanation:'Educated speakers use them constantly in speech. They simply should not appear in formal writing.' },
    { type:'mcq', question:'What is the most effective way to train your listening?',
      options:['Listen to many clips once each','Listen to one short clip several times, then check the transcript, then listen again','Read transcripts only','Listen while doing other work'],
      answer:1, explanation:'Repeated focused listening on one clip builds the ear faster than single exposure to many clips.' },
    { type:'fill', question:'Write the full form of "didja": "___ you"', answer:'did',
      explanation:'"Didja" is the reduced form of "did you".' }
  ],
  vocabulary: [
    { word:'reconstruct', meaning:'to build something back from partial pieces', example:'Listeners reconstruct the missing words from context.' },
    { word:'context', meaning:'the surrounding situation that helps you understand', example:'Context usually fills in the word you missed.' },
    { word:'repetition', meaning:'saying something again', example:'Asking for repetition is perfectly normal.' },
    { word:'partial', meaning:'not complete', example:'Partial understanding is often enough to act on.' }
  ]
}

];
