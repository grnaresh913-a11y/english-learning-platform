/**
 * ADVANCED course content (CEFR B2-C1).
 */

module.exports = [

/* ------------------------------------------------------------------ 1 */
{
  title: 'Perfect Modals',
  description: 'Speculate about, and regret, the past.',
  module: 'Grammar',
  level: 'Advanced',
  cefr: 'B2',
  content:
`Modal + HAVE + past participle lets you comment on the past rather than simply report it. Each modal carries a distinct attitude.

MUST HAVE - near certainty, deduced from evidence
"The file is signed, so he must have seen it."
You are not stating a fact; you are drawing the only reasonable conclusion.

CAN'T HAVE / COULDN'T HAVE - near-certain impossibility
"She can't have approved it - she was on leave all week."
This is the opposite of "must have", not of "can".

MAY HAVE / MIGHT HAVE / COULD HAVE - possibility
"The letter might have been lost in transit."
All three are close in meaning. "Could have" carries slightly more doubt.

COULD HAVE - also a missed opportunity
"We could have avoided the penalty if we had filed on time."
Here it means the possibility existed but was not taken.

SHOULD HAVE / OUGHT TO HAVE - criticism or regret
"I should have checked the survey before signing."
"They should not have released the file without approval."
This is the strongest way to assign fault in a report while remaining professional.

WOULD HAVE - the unreal past
"I would have attended, but the meeting was cancelled."
Frequently paired with the third conditional: "If I had known, I would have told you."

THE ERROR THAT MATTERS MOST
In speech, "should have" reduces to "shoulda", which is why learners write "should of". This is always wrong in writing. The forms are should have, could have, would have, must have - never "should of", "could of", "would of".

Equally, do not write "should had" or "must had". The modal is always followed by the bare "have".`,
  practice_text: 'They must have received it by now. We should have raised the objection earlier. She cannot have approved it, because she was on leave.',
  exercises: [
    { type:'mcq', question:'"The file is signed, so he ___ seen it." (near certainty)',
      options:['should have','must have','might have','can\'t have'],
      answer:1, explanation:'"Must have" expresses a confident deduction from available evidence.' },
    { type:'mcq', question:'"She ___ approved it - she was on leave all week."',
      options:['must have','should have','can\'t have','would have'],
      answer:2, explanation:'"Can\'t have" expresses near-certain impossibility, the opposite of "must have".' },
    { type:'fill', question:'I ___ have checked the survey before signing. (regret)', answer:'should',
      explanation:'"Should have" expresses regret or criticism about a past action.' },
    { type:'correct', question:'I should of verified the measurements.', answer:'I should have verified the measurements.',
      explanation:'"Should of" is never correct in writing. The spoken reduction "shoulda" is written "should have".' },
    { type:'mcq', question:'"We could have avoided the penalty" implies:',
      options:['We did avoid it','The possibility existed but was not taken','We will avoid it','It was impossible to avoid'],
      answer:1, explanation:'"Could have" here describes a missed opportunity: the option existed and was not used.' },
    { type:'correct', question:'They must had received the notice.', answer:'They must have received the notice.',
      explanation:'A modal is always followed by the bare form "have", never "had".' },
    { type:'mcq', question:'Which sentence assigns fault most clearly while staying professional?',
      options:['Someone made an error.','The file should not have been released without approval.','It was released, unfortunately.','The release happened.'],
      answer:1, explanation:'"Should not have" states clearly that the action was wrong, without becoming personal or informal.' }
  ],
  vocabulary: [
    { word:'deduce', meaning:'to reach a conclusion from evidence', example:'We deduce that he saw the file.' },
    { word:'objection', meaning:'a formal statement of disagreement', example:'We should have raised the objection earlier.' },
    { word:'transit', meaning:'the process of being transported', example:'The letter was lost in transit.' },
    { word:'speculate', meaning:'to form a theory without firm evidence', example:'I would rather not speculate.' }
  ]
},

/* ------------------------------------------------------------------ 2 */
{
  title: 'The Passive Voice and When to Avoid It',
  description: 'Shift the focus away from the doer - deliberately, not by habit.',
  module: 'Grammar',
  level: 'Advanced',
  cefr: 'B2',
  content:
`The passive is formed with "to be" plus the past participle: "The file was approved."

WHEN THE PASSIVE IS THE RIGHT CHOICE
1. The doer is unknown: "The records were destroyed in the flood."
2. The doer is obvious or irrelevant: "The application was rejected." (by the authority, of course)
3. The action matters more than the actor: "Three plots were revalued this quarter."
4. You want to keep the topic consistent across sentences: "The lease was signed in 2018. It was renewed in 2023."

ADDING THE DOER BACK
Use "by": "The lease was approved by the committee." Add this only when the identity genuinely matters; otherwise it defeats the purpose of choosing the passive.

WHEN THE PASSIVE IS THE WRONG CHOICE
Official English overuses it, usually to avoid naming who is responsible. Compare:
"It was decided that the lease would be renewed without valuation."
"The committee renewed the lease without obtaining a valuation."

The first hides the actor. The second states who did what. In a report intended to establish accountability, the passive is evasion, and a careful reader notices.

Strong professional writers use the ACTIVE by default and switch to the passive for the four specific reasons above.

THE TEST
Read your sentence and ask: can the reader tell who did this? If not, ask whether that is a deliberate choice or just habit. If it is habit, rewrite it in the active voice.

IMPERSONAL STRUCTURES
"It is understood that...", "It has been observed that...", "It was felt that..." are extreme forms of the same evasion. They attribute an opinion to nobody. Replace them: "The survey team observed that..." or "I consider that..."`,
  practice_text: 'The lease was renewed without valuation. Compare: the committee renewed the lease without obtaining a valuation. The records were destroyed in the flood.',
  exercises: [
    { type:'mcq', question:'When is the passive clearly the right choice?',
      options:['Always in official writing','When the doer is unknown or irrelevant','When you want longer sentences','When assigning responsibility'],
      answer:1, explanation:'The passive suits cases where the actor is unknown, obvious or unimportant.' },
    { type:'correct', question:'It was decided that the lease would be renewed.', answer:'The committee decided to renew the lease.',
      explanation:'The passive hides who decided. In a report establishing accountability, name the actor.' },
    { type:'mcq', question:'Which sentence establishes accountability best?',
      options:['An error was made in the valuation.','It has been observed that the valuation is incorrect.','The valuer applied the 2019 rates instead of the 2024 rates.','Mistakes happened.'],
      answer:2, explanation:'The active voice names who did what, which is what accountability requires.' },
    { type:'fill', question:'Make this passive: "The flood destroyed the records." -> "The records ___ destroyed in the flood."', answer:'were',
      explanation:'"Records" is plural, so the passive takes "were destroyed".' },
    { type:'mcq', question:'What is wrong with "It is felt that the rate is too low"?',
      options:['Nothing','It attributes the opinion to nobody','It is too short','It needs a comma'],
      answer:1, explanation:'Impersonal structures attribute opinions to no one. Say who holds the view: "I consider the rate too low."' },
    { type:'mcq', question:'When should you add "by the committee" to a passive sentence?',
      options:['Always','Never','Only when the identity of the doer genuinely matters','Only in the first paragraph'],
      answer:2, explanation:'Adding the agent defeats the purpose of the passive unless the identity is genuinely relevant.' },
    { type:'mcq', question:'Which voice should be your default in professional writing?',
      options:['Passive, because it sounds formal','Active, switching to passive for specific reasons','Whichever is longer','It makes no difference'],
      answer:1, explanation:'The active voice is clearer and shorter. Use the passive deliberately, for one of its four legitimate purposes.' }
  ],
  vocabulary: [
    { word:'accountability', meaning:'the obligation to accept responsibility for your actions', example:'The report is intended to establish accountability.' },
    { word:'evasion', meaning:'the act of avoiding something, often dishonestly', example:'The passive voice can become evasion.' },
    { word:'attribute', meaning:'to say that something was caused or said by someone', example:'Do not attribute the opinion to nobody.' },
    { word:'deliberate', meaning:'done intentionally', example:'Make it a deliberate choice, not a habit.' }
  ]
},

/* ------------------------------------------------------------------ 3 */
{
  title: 'Inversion and Emphasis',
  description: 'Front a negative or adverb to create formal emphasis.',
  module: 'Grammar',
  level: 'Advanced',
  cefr: 'C1',
  content:
`Beginning a clause with certain words forces question word order in a statement. Used sparingly, it produces controlled emphasis; used often, it sounds theatrical.

AFTER A FRONTED NEGATIVE ADVERB
never, rarely, seldom, hardly, scarcely, no sooner, at no time, under no circumstances, little

"Never have I seen such a discrepancy." (rather than "I have never seen...")
"Rarely does the department revise its rates."
"At no time was the objection recorded."
"Under no circumstances should the file leave this office."
"Little did we know that the survey was outdated."

Notice the structure: fronted negative + auxiliary + subject + main verb.

NOT ONLY ... BUT ALSO
"Not only did he submit the report late, but he also omitted the annexure."
The inversion applies to the first clause; the second returns to normal order.

NO SOONER ... THAN / HARDLY ... WHEN
"No sooner had we filed the objection than the order was issued."
"Hardly had the meeting begun when the power failed."
Note the pairing: no sooner takes THAN, hardly takes WHEN. Mixing them is a common error.

AFTER "SO" AND "SUCH"
"So serious was the discrepancy that the file was referred upward."
"Such was the delay that the lease expired."

CONDITIONAL INVERSION - formal alternative to "if"
"Should you require further information, please contact me." (= If you require)
"Were the rate revised annually, the shortfall would not arise." (= If the rate were revised)
"Had we known, we would have objected." (= If we had known)

This is standard in formal correspondence and is worth mastering; "Should you require any further information" is one of the most useful closing lines in professional English.

WHEN NOT TO USE IT
Never in conversation, rarely in email, and at most once or twice in a report. Inversion draws attention to itself, and attention spent on your sentence structure is attention taken from your argument.`,
  practice_text: 'Rarely does the department revise its rates. Not only was the notice late, it was also incomplete. Should you require further information, please contact me.',
  exercises: [
    { type:'mcq', question:'Which is correctly inverted?',
      options:['Never I have seen such an error.','Never have I seen such an error.','Never seen I have such an error.','Never I seen such an error.'],
      answer:1, explanation:'A fronted negative forces question word order: auxiliary before subject.' },
    { type:'fill', question:'No sooner had we filed the objection ___ the order was issued.', answer:'than',
      explanation:'"No sooner" pairs with "than". "Hardly" pairs with "when".' },
    { type:'fill', question:'Hardly had the meeting begun ___ the power failed.', answer:'when',
      explanation:'"Hardly" and "scarcely" pair with "when", not "than".' },
    { type:'mcq', question:'"Should you require further information" means:',
      options:['You must require further information','If you require further information','You should require further information','Do you require further information'],
      answer:1, explanation:'Conditional inversion with "should" is a formal substitute for "if".' },
    { type:'correct', question:'Not only he submitted it late, but he also omitted the annexure.', answer:'Not only did he submit it late, but he also omitted the annexure.',
      explanation:'"Not only" at the start of a clause requires inversion: "did he submit".' },
    { type:'mcq', question:'"Had we known, we would have objected" is equivalent to:',
      options:['If we know, we object','If we had known, we would have objected','We had known and objected','We must have known'],
      answer:1, explanation:'Inversion with "had" is a formal alternative to the third conditional "if we had known".' },
    { type:'mcq', question:'How often should inversion appear in a professional report?',
      options:['In every paragraph','Once or twice at most','Never','As often as possible, for emphasis'],
      answer:1, explanation:'Inversion draws attention to the sentence itself. Overuse distracts from the argument.' },
    { type:'fill', question:'Under no circumstances ___ the file leave this office. (should)', answer:'should',
      explanation:'The fronted negative phrase forces the auxiliary before the subject: "should the file leave".' }
  ],
  vocabulary: [
    { word:'discrepancy', meaning:'an inconsistency between things that should agree', example:'Never have I seen such a discrepancy.' },
    { word:'annexure', meaning:'a document attached to a main document', example:'He omitted the annexure.' },
    { word:'emphasis', meaning:'special importance or prominence', example:'Inversion creates formal emphasis.' },
    { word:'theatrical', meaning:'exaggerated, as if performing', example:'Overused inversion sounds theatrical.' }
  ]
},

/* ------------------------------------------------------------------ 4 */
{
  title: 'Relative Clauses and Precision',
  description: 'Defining and non-defining clauses - and why the comma changes the meaning.',
  module: 'Grammar',
  level: 'Advanced',
  cefr: 'B2',
  content:
`Relative clauses add information about a noun. Whether you use a comma changes what the sentence actually says, and in a legal or official context that difference can matter a great deal.

DEFINING CLAUSE - no commas, identifies which one
"The plots which were revalued in 2024 are exempt."
This means: only those particular plots are exempt. The clause is essential; remove it and the sentence no longer identifies anything.

NON-DEFINING CLAUSE - with commas, adds extra detail
"The plots, which were revalued in 2024, are exempt."
This means: ALL the plots are exempt, and incidentally all of them were revalued. The clause is removable.

The two sentences differ only by two commas, and they say materially different things. In a contract, that is the difference between some plots and all plots.

WHICH RELATIVE PRONOUN
who - people: "the officer who signed it"
which - things: "the clause which governs renewal"
that - people or things, but ONLY in defining clauses: "the file that went missing"
whose - possession, people or things: "the tenant whose lease expired"
where - places: "the office where the records are kept"
when - times: "the year when the lease began"

Critically, "that" cannot introduce a non-defining clause. "The lease, that was signed in 2018, expires soon" is wrong; it must be "which".

OMITTING THE PRONOUN
When the relative pronoun is the OBJECT of a defining clause, you may drop it:
"The file (which) I signed yesterday is missing."
You may not drop it when it is the subject: "The officer who signed it" cannot become "The officer signed it", which means something entirely different.

REDUCED RELATIVE CLAUSES - more concise
"The plots which were revalued in 2024" becomes "The plots revalued in 2024".
"The officer who is handling the case" becomes "The officer handling the case".
This is a good way to tighten dense official prose.`,
  practice_text: 'The plots which were revalued in 2024 are exempt. The lease, which was signed in 2018, expires in March. The officer handling the case is on leave.',
  exercises: [
    { type:'mcq', question:'"The plots, which were revalued in 2024, are exempt." How many plots are exempt?',
      options:['Only the revalued ones','All of them','None of them','It cannot be determined'],
      answer:1, explanation:'The commas make the clause non-defining: all plots are exempt, and incidentally all were revalued.' },
    { type:'mcq', question:'"The plots which were revalued in 2024 are exempt." How many plots are exempt?',
      options:['Only the revalued ones','All of them','None of them','It cannot be determined'],
      answer:0, explanation:'Without commas the clause is defining: it restricts the exemption to the revalued plots only.' },
    { type:'mcq', question:'Which sentence is incorrect?',
      options:['The file that went missing was found.','The officer who signed it has retired.','The lease, that was signed in 2018, expires soon.','The lease, which was signed in 2018, expires soon.'],
      answer:2, explanation:'"That" cannot introduce a non-defining clause. With commas you must use "which".' },
    { type:'fill', question:'The tenant ___ lease expired has applied for renewal. (possession)', answer:'whose',
      explanation:'"Whose" shows possession, for both people and things.' },
    { type:'mcq', question:'In which sentence can the relative pronoun be omitted?',
      options:['The officer who signed it has retired.','The file which I signed is missing.','The lease, which expires in March, is under review.','The office where records are kept is closed.'],
      answer:1, explanation:'The pronoun is the object of a defining clause, so it can be dropped: "The file I signed is missing."' },
    { type:'correct', question:'The officer which approved the file is on leave.', answer:'The officer who approved the file is on leave.',
      explanation:'Use "who" for people. "Which" is for things.' },
    { type:'mcq', question:'Reduce this: "The officer who is handling the case is on leave."',
      options:['The officer handling the case is on leave.','The officer handle the case is on leave.','The officer who handling the case is on leave.','The officer is handling the case on leave.'],
      answer:0, explanation:'A reduced relative clause drops "who is", producing a tighter sentence with the same meaning.' }
  ],
  vocabulary: [
    { word:'exempt', meaning:'free from an obligation that applies to others', example:'Those plots are exempt from the revision.' },
    { word:'tenant', meaning:'a person who rents property', example:'The tenant whose lease expired applied for renewal.' },
    { word:'govern', meaning:'to control or determine', example:'Clause 7 governs renewal.' },
    { word:'concise', meaning:'short and clear, with no unnecessary words', example:'Reduced clauses make prose more concise.' }
  ]
},

/* ------------------------------------------------------------------ 5 */
{
  title: 'Intonation for Meaning',
  description: 'Change your meaning with pitch, without changing a single word.',
  module: 'Speaking',
  level: 'Advanced',
  cefr: 'C1',
  content:
`Intonation is the melody of a sentence. In English it carries grammatical and emotional information, and getting it wrong can make a polite sentence sound rude.

FALLING TONE - certainty, completion, statement
"The file is ready." (falling on READY) - a plain fact.
Use falling tone for statements, commands, and wh-questions: "When did you send it?"

RISING TONE - question, doubt, incompleteness
"The file is ready?" (rising on READY) - I am surprised, or asking.
Use rising tone for yes/no questions: "Did you send it?"
A rising tone on a statement signals doubt or invites confirmation.

FALL-RISE - polite reservation or an unspoken "but"
"The report is thorough." with a fall-rise on THOROUGH implies "...but there is a problem."
Native listeners hear this reservation clearly. Learners often produce it accidentally and puzzle their listener.

CONTRASTIVE STRESS - the most powerful tool
Moving the stress changes which part you are correcting. "I didn't say he took the file" has six meanings:
"I didn't say he took the file" - someone else said it.
"I DIDN'T say he took the file" - I deny saying it.
"I didn't SAY he took the file" - I implied it, but did not say it.
"I didn't say HE took the file" - someone else took it.
"I didn't say he TOOK the file" - he did something else with it.
"I didn't say he took the FILE" - he took something else.

Same words, six different messages, conveyed by pitch alone.

LISTS
Rising on each item, falling on the last: "We need the survey, the valuation, and the approval." The falling tone on the last item signals that the list is complete.

POLITENESS
A flat or falling tone on a request sounds like an order. "Could you send the file" with a flat tone sounds brusque; a slight rise makes it a genuine request. This is a frequent and entirely unintentional cause of sounding rude in English.`,
  practice_text: 'I did not say he took the file. The file is ready. Did you send it? We need the survey, the valuation and the approval.',
  exercises: [
    { type:'mcq', question:'Which tone is used for a yes/no question?',
      options:['Falling','Rising','Flat','Fall-rise'],
      answer:1, explanation:'Yes/no questions take a rising tone. Wh-questions take a falling tone.' },
    { type:'mcq', question:'"I didn\'t say HE took the file" (stress on HE) implies:',
      options:['I denied saying it','Someone else took it','He took something else','I only implied it'],
      answer:1, explanation:'Stressing "he" contrasts him with someone else, implying a different person took it.' },
    { type:'mcq', question:'A fall-rise tone on "The report is thorough" suggests:',
      options:['Complete approval','An unspoken reservation or "but"','A question','Anger'],
      answer:1, explanation:'Fall-rise signals polite reservation. Listeners hear an implied "but" even though it is unsaid.' },
    { type:'mcq', question:'Why can a flat tone on a request sound rude?',
      options:['It is too quiet','It sounds like an order rather than a request','It is grammatically wrong','It is too fast'],
      answer:1, explanation:'A slight rise marks a genuine request. Flat or falling makes the same words sound like an instruction.' },
    { type:'mcq', question:'How do you signal that a list is finished?',
      options:['Rise on the last item','Fall on the last item','Pause before the last item','Say "etc."'],
      answer:1, explanation:'Items rise; the final item falls, which tells the listener the list is complete.' },
    { type:'mcq', question:'"The file is ready?" with a rising tone means:',
      options:['A plain statement of fact','A question or expression of surprise','A command','A polite refusal'],
      answer:1, explanation:'A rising tone converts a statement into a question or signals surprise or doubt.' },
    { type:'mcq', question:'Which question type takes a FALLING tone?',
      options:['Did you send it?','Is the file ready?','When did you send it?','Are you coming?'],
      answer:2, explanation:'Wh-questions (when, what, why, who, how) take a falling tone; yes/no questions rise.' }
  ],
  vocabulary: [
    { word:'intonation', meaning:'the rise and fall of the voice in speech', example:'Intonation carries meaning in English.' },
    { word:'pitch', meaning:'how high or low a sound is', example:'Pitch changes the meaning without changing words.' },
    { word:'reservation', meaning:'a doubt that prevents full agreement', example:'Her tone suggested a reservation.' },
    { word:'brusque', meaning:'abrupt to the point of rudeness', example:'A flat tone can sound brusque.' }
  ]
},

/* ------------------------------------------------------------------ 6 */
{
  title: 'Presentations and Public Speaking',
  description: 'Structure and deliver a talk with authority.',
  module: 'Speaking',
  level: 'Advanced',
  cefr: 'C1',
  content:
`STRUCTURE: CONCLUSION FIRST
Professional English audiences expect the answer at the start, not the end.
1. State your recommendation in one sentence.
2. Give three reasons, one at a time.
3. Address the strongest objection.
4. Restate the recommendation.

"My recommendation is to defer the renewal. There are three reasons for this. First, the valuation is four years out of date..."

SIGNPOSTING - tell them where you are
Opening: "I will cover three points today."
Moving on: "That brings me to my second point."
Emphasising: "The critical issue here is..."
Referring back: "As I mentioned earlier..."
Concluding: "To summarise..." / "In conclusion..."

Signposting matters more in speech than in writing, because the listener cannot look back at the previous paragraph.

DELIVERY
Slow down by about twenty percent from your conversational speed. Nervous speakers accelerate, and speed is the first thing that makes an accent hard to follow.

Pause for a full second after each key point. Silence feels much longer to the speaker than to the audience. A pause reads as confidence and gives the listener time to absorb.

Replace fillers with silence. "Um", "you know", "actually" and "basically" dilute authority. A brief silence is always better.

Stress the content words and let the grammar words stay weak. Even stress across every word sounds mechanical and is tiring to follow.

HANDLING QUESTIONS
Buy time honestly: "That is a fair question. Let me address the valuation point first."
Deflect what you cannot answer: "I do not have that figure to hand. May I send it to you this afternoon?" This is far stronger than guessing.
Check you understood: "If I understand you correctly, you are asking whether..."

THE THING THAT MATTERS MOST
Clarity beats accent. A clear, well-structured talk in accented English is more persuasive than a fluent but disorganised one. Do not spend your preparation time worrying about your accent; spend it on structure.`,
  practice_text: 'My recommendation is to defer the renewal. There are three reasons for this. First, the valuation is out of date. That brings me to my second point.',
  exercises: [
    { type:'mcq', question:'Where should your recommendation appear in a professional presentation?',
      options:['At the very end, as a climax','At the beginning','In the middle','Only if asked'],
      answer:1, explanation:'Professional English audiences expect the conclusion first, then the supporting reasons.' },
    { type:'mcq', question:'What should replace filler words like "um"?',
      options:['Faster speech','A brief silence','A longer sentence','An apology'],
      answer:1, explanation:'A short pause reads as confidence; fillers dilute authority.' },
    { type:'mcq', question:'How should you adjust your speed when presenting?',
      options:['Speak faster to fit everything in','Slow down by about twenty percent','Speak as fast as a native speaker','Vary randomly'],
      answer:1, explanation:'Nervous speakers accelerate, and speed is the first thing that makes an accent hard to follow.' },
    { type:'mcq', question:'You are asked a question and do not know the figure. The strongest response is:',
      options:['Guess a plausible number','Say you do not have it to hand and offer to send it','Change the subject','Say the question is not relevant'],
      answer:1, explanation:'Acknowledging the gap and committing to follow up is far stronger, and safer, than guessing.' },
    { type:'fill', question:'Signposting phrase: "That ___ me to my second point."', answer:'brings',
      explanation:'"That brings me to..." is a standard signpost for moving between sections.' },
    { type:'mcq', question:'Why does signposting matter more in speech than in writing?',
      options:['It sounds more formal','The listener cannot look back at what you said before','It fills time','It is grammatically required'],
      answer:1, explanation:'Readers can re-read; listeners cannot, so they need explicit navigation.' },
    { type:'mcq', question:'What matters most for a persuasive presentation?',
      options:['A native-like accent','Clear structure','Long vocabulary','Speaking quickly'],
      answer:1, explanation:'Clarity and structure beat accent. Preparation time is better spent on structure than on accent worry.' }
  ],
  vocabulary: [
    { word:'defer', meaning:'to postpone to a later date', example:'My recommendation is to defer the renewal.' },
    { word:'signpost', meaning:'a phrase telling the audience where you are in your talk', example:'Use signposts between sections.' },
    { word:'filler', meaning:'a meaningless sound or word used while thinking', example:'Replace fillers with a pause.' },
    { word:'persuasive', meaning:'able to convince people', example:'A structured talk is more persuasive.' },
    { word:'authority', meaning:'the quality of being confident and believable', example:'Pauses lend authority.' }
  ]
},

/* ------------------------------------------------------------------ 7 */
{
  title: 'Critical Reading and Inference',
  description: 'Read what the writer implies but does not state.',
  module: 'Reading',
  level: 'Advanced',
  cefr: 'C1',
  content:
`Advanced reading means separating what a text states from what it wants you to conclude.

CLAIM VERSUS EVIDENCE
Every argument has claims and support. Read a paragraph and ask: which sentence is the claim, and what evidence is actually offered? Frequently the evidence supports a narrower claim than the one being made.

"Delays have been reduced significantly." - Reduced from what to what? Measured how? Over what period? A claim without a figure is an assertion, not evidence.

WORD CHOICE REVEALS POSITION
These pairs describe the same event and judge it differently:
"the authority failed to act" versus "the authority did not act"
"the tenant refused" versus "the tenant declined"
"only 40 percent" versus "as many as 40 percent"
"admitted" versus "said"

The first of each pair carries a judgement. Noticing that judgement is the core skill of critical reading.

WHAT IS OMITTED
Omissions are often more revealing than what is present. If a report on delays never identifies a cause, that absence is information. If it gives percentages but never the base number, ask why. "Complaints fell by 50 percent" is unimpressive if there were only two.

HEDGING - the language of uncertainty
may, might, could, appears to, suggests, tends to, is likely to, arguably, to some extent

Hedged statements are not commitments. "The valuation may be outdated" does not assert that it is. Writers hedge to protect themselves, and heavy hedging around a central claim usually indicates weak evidence.

ATTRIBUTION - who says so?
"It is widely believed that..." - by whom?
"Experts agree..." - which experts?
"Studies show..." - which studies, and what did they actually measure?
Unattributed authority is a warning sign.

INFERENCE VERSUS ASSUMPTION
An inference follows from the text. An assumption is something you brought yourself. "The report notes delays beyond the department's control" allows you to infer that the writer disclaims responsibility. It does not allow you to conclude that the delays were in fact outside their control.`,
  practice_text: 'The report notes delays beyond the department\'s control without identifying any cause. Complaints fell by fifty percent, though the base figure is not given.',
  exercises: [
    { type:'mcq', question:'"The authority failed to act" versus "The authority did not act". The difference is:',
      options:['No difference','"Failed" adds a judgement that the action was owed','"Did not" is more critical','Only formality'],
      answer:1, explanation:'"Failed" implies an obligation was breached; "did not" merely reports the absence of action.' },
    { type:'mcq', question:'"Complaints fell by 50 percent." What must you ask?',
      options:['Nothing, it is clear','What the base number was','Who wrote it','When it was published'],
      answer:1, explanation:'A percentage without a base can be trivial. A fall from two to one is also fifty percent.' },
    { type:'mcq', question:'"The valuation may be outdated" is:',
      options:['A firm assertion that it is outdated','A hedged statement that commits to nothing','A question','A denial'],
      answer:1, explanation:'"May" is a hedge. The writer has not asserted that the valuation is outdated.' },
    { type:'mcq', question:'A report on delays never identifies a cause. This absence is:',
      options:['Irrelevant','Itself informative - worth asking about','A formatting issue','Normal and expected'],
      answer:1, explanation:'Omissions are often more revealing than content. A missing cause in a report about causes is significant.' },
    { type:'mcq', question:'What is wrong with "Studies show that delays have reduced"?',
      options:['Nothing','The studies are not identified, so the authority cannot be checked','It is too short','"Reduced" is the wrong word'],
      answer:1, explanation:'Unattributed authority cannot be verified and is a warning sign in critical reading.' },
    { type:'mcq', question:'The text says "delays beyond the department\'s control". You may infer that:',
      options:['The delays were genuinely outside their control','The writer disclaims responsibility for the delays','The department is incompetent','There were no delays'],
      answer:1, explanation:'You can infer the writer\'s stance from the text. Whether the claim is true is a separate question the text does not settle.' },
    { type:'mcq', question:'Heavy hedging around a central claim usually indicates:',
      options:['Careful scholarship','Weak underlying evidence','Strong evidence','Good style'],
      answer:1, explanation:'Writers hedge to protect themselves. Concentrated hedging on the main claim suggests the evidence will not support a firmer statement.' }
  ],
  vocabulary: [
    { word:'infer', meaning:'to conclude something from evidence rather than explicit statement', example:'We can infer that he disclaims responsibility.' },
    { word:'assertion', meaning:'a confident statement made without proof', example:'Without a figure it is an assertion, not evidence.' },
    { word:'hedge', meaning:'to make a statement deliberately less definite', example:'The writer hedges the central claim.' },
    { word:'attribution', meaning:'stating the source of a claim', example:'The claim lacks attribution.' },
    { word:'omission', meaning:'something left out', example:'The omission of any cause is revealing.' }
  ]
},

/* ------------------------------------------------------------------ 8 */
{
  title: 'Argumentative Essay Writing',
  description: 'Build and defend a position in writing.',
  module: 'Writing',
  level: 'Advanced',
  cefr: 'C1',
  content:
`STRUCTURE
1. Introduction ending in a clear thesis.
2. One paragraph per supporting argument, each with concrete evidence.
3. One full paragraph for the strongest counter-argument, answered.
4. Conclusion that restates the thesis in light of what you have shown.

THE THESIS
It must be a contestable claim, not a topic.
Topic, not a thesis: "This essay discusses lease rate indexation."
Thesis: "Lease rates should be indexed annually, because fixed multi-year rates transfer value from the authority to the lessee."

If no reasonable person could disagree with your sentence, it is not a thesis.

EVIDENCE
Each argument paragraph needs something concrete: a figure, a date, a document, a named precedent. "The current system is inefficient" is an opinion. "Fourteen of the forty-one leases renewed in 2024 used rates set before 2019" is evidence.

THE COUNTER-ARGUMENT - the part most writers skip
Give the strongest opposing view a full paragraph, state it fairly, then answer it.

"Critics note that annual indexation would increase administrative cost. That cost is real, but the 2024 review estimated it at under two percent of the additional revenue recovered in the first cycle alone."

Ignoring the obvious objection does not make your case stronger; it tells the reader either that you did not think of it or that you cannot answer it. Addressing it is what distinguishes an advanced writer.

CONCEDING WITHOUT COLLAPSING
"While the administrative burden is genuine, it does not outweigh..."
"Although the data for 2021 is incomplete, the trend across the remaining years is consistent."
Conceding a minor point strengthens your credibility on the major one.

CONCLUSION
Do not summarise; the reader has just read it. Restate the thesis with the weight your evidence has given it, and state the implication: what should now happen.

REGISTER
No contractions. No phrasal verbs where a single verb exists (investigate, not look into). No rhetorical questions. No "I think" - assert the claim and let the evidence carry it.`,
  practice_text: 'This paper argues that lease rates should be indexed annually. Critics note the administrative cost; that cost is recovered within one cycle.',
  exercises: [
    { type:'mcq', question:'Which is a thesis rather than a topic?',
      options:['This essay discusses lease indexation.','Lease indexation is an important subject.','Lease rates should be indexed annually, because fixed rates transfer value to the lessee.','There are many views on lease indexation.'],
      answer:2, explanation:'A thesis makes a contestable claim and gives a reason. The others merely name a subject.' },
    { type:'mcq', question:'How much space should the strongest counter-argument receive?',
      options:['None','A single sentence','A full paragraph, stated fairly and then answered','Only a footnote'],
      answer:2, explanation:'Addressing the strongest objection properly is what distinguishes advanced argumentative writing.' },
    { type:'mcq', question:'Which is evidence rather than opinion?',
      options:['The current system is inefficient.','The system needs urgent reform.','Fourteen of forty-one leases renewed in 2024 used pre-2019 rates.','Everyone agrees the system is poor.'],
      answer:2, explanation:'Concrete figures and dates are evidence. The others are assertions.' },
    { type:'mcq', question:'What should the conclusion do?',
      options:['Summarise each paragraph','Restate the thesis with the weight the evidence gives it, and state the implication','Introduce a new argument','Ask a rhetorical question'],
      answer:1, explanation:'The reader has just read the summary. The conclusion should land the claim and say what follows from it.' },
    { type:'mcq', question:'Why concede a minor opposing point?',
      options:['It weakens your case','It strengthens your credibility on the major point','It is required by grammar','It fills space'],
      answer:1, explanation:'A fair concession shows you have weighed the evidence, which makes your main claim more believable.' },
    { type:'correct', question:'I think the rate isn\'t fair and we should look into it.', answer:'The rate is inequitable and requires investigation.',
      explanation:'Formal register: drop "I think", avoid contractions, and prefer a single verb to a phrasal verb.' },
    { type:'mcq', question:'What happens if you ignore the obvious objection?',
      options:['Your argument looks stronger','The reader concludes you either missed it or cannot answer it','It shortens the essay usefully','Nothing'],
      answer:1, explanation:'Informed readers already know the objection. Silence about it reads as weakness, not strength.' }
  ],
  vocabulary: [
    { word:'thesis', meaning:'the central contestable claim of a piece of writing', example:'State your thesis in the first paragraph.' },
    { word:'concede', meaning:'to admit that a point against you has some force', example:'Conceding a minor point builds credibility.' },
    { word:'counter-argument', meaning:'an argument against your position', example:'Give the counter-argument a full paragraph.' },
    { word:'inequitable', meaning:'unfair', example:'The rate is inequitable.' },
    { word:'precedent', meaning:'an earlier case used as an example or rule', example:'He cited a 2019 precedent.' }
  ]
},

/* ------------------------------------------------------------------ 9 */
{
  title: 'Report Writing and Summarising',
  description: 'Compress complex material without distorting it.',
  module: 'Writing',
  level: 'Advanced',
  cefr: 'C1',
  content:
`A REPORT OPENS WITH FINDINGS, NOT METHOD
The reader wants to know what you found. Method belongs after, for those who wish to check it.

Standard order: Findings / Recommendations / Method / Detail / Annexures.

Write the executive summary LAST, once you know your conclusions. Writing it first produces a summary of your intentions rather than of your findings.

PRESERVE PROPORTION
If half the source material concerns risk, roughly half your summary should. Summarising is compression, not selection of the parts you found interesting. Changing the proportions changes the meaning, even when every individual sentence is accurate.

CUT ADJECTIVES BEFORE FACTS
When you must shorten, remove intensifiers and qualifiers first: very, extremely, significantly, quite, rather, really. Then remove repetition. Only then consider removing content - and if you must remove content, say that you have: "This summary covers the valuation findings only."

DISTINGUISH YOUR VOICE FROM THE SOURCE
"The report states that delays were unavoidable." - the source's claim.
"Delays were unavoidable." - now your claim.
"The report attributes the delays to factors outside the department, though it identifies none." - the source's claim plus your observation, clearly separated.

Blurring these is the most serious fault in summary writing, because it silently converts someone else's assertion into your own.

QUANTIFY WHEREVER POSSIBLE
"Several plots are undervalued" is weak. "Three of eleven plots are undervalued, by between twelve and forty percent" is a finding. Where you cannot quantify, say so explicitly rather than reaching for a vague word.

RECOMMENDATIONS MUST BE ACTIONABLE
Each one states who does what by when.
Weak: "Steps should be taken to improve the valuation process."
Strong: "The Estate Department should commission a fresh valuation of the three plots identified in Annexure B before the March renewal date."

Note that the weak version is in the passive with no actor, which is exactly the evasion covered in the passive voice lesson.`,
  practice_text: 'Findings: three of eleven plots are undervalued. Method: comparison against the 2024 ready reckoner. The report attributes the delay to external factors, though it identifies none.',
  exercises: [
    { type:'mcq', question:'What should a professional report open with?',
      options:['The method','The findings','A literature review','An apology for the delay'],
      answer:1, explanation:'Findings first. Method follows, for readers who want to verify.' },
    { type:'mcq', question:'When should you write the executive summary?',
      options:['First, to plan the report','Last, once you know your conclusions','Halfway through','It is optional'],
      answer:1, explanation:'Writing it first summarises your intentions rather than your findings.' },
    { type:'mcq', question:'Half the source concerns risk. Your summary should:',
      options:['Omit risk to save space','Devote roughly half its length to risk','Mention risk in one line','Cover only the parts you found interesting'],
      answer:1, explanation:'Summarising preserves proportion. Changing the proportions changes the meaning even when each sentence is accurate.' },
    { type:'mcq', question:'You must shorten a report. What goes first?',
      options:['Facts and figures','Intensifiers and qualifiers like "very" and "significantly"','The recommendations','The findings'],
      answer:1, explanation:'Cut adjectives and intensifiers before facts, then repetition, and only then content - declaring it if you do.' },
    { type:'mcq', question:'Which recommendation is actionable?',
      options:['Steps should be taken to improve valuations.','The process needs review.','The Estate Department should commission a fresh valuation of the three plots in Annexure B before the March renewal.','Valuation is important.'],
      answer:2, explanation:'An actionable recommendation states who does what by when. The others are passive and name no actor.' },
    { type:'correct', question:'Several plots are significantly undervalued.', answer:'Three of eleven plots are undervalued by between twelve and forty percent.',
      explanation:'Quantify. "Several" and "significantly" convey no measurable information.' },
    { type:'mcq', question:'Why must you separate your voice from the source\'s?',
      options:['It is a stylistic preference','Blurring them silently converts someone else\'s assertion into your own','It makes the report longer','To avoid repetition'],
      answer:1, explanation:'This is the most serious fault in summary writing: you become responsible for a claim you only reported.' }
  ],
  vocabulary: [
    { word:'findings', meaning:'what an investigation discovered', example:'The findings appear on page one.' },
    { word:'quantify', meaning:'to express as a number or measure', example:'Quantify the shortfall wherever possible.' },
    { word:'actionable', meaning:'clear enough to be acted upon', example:'Each recommendation must be actionable.' },
    { word:'proportion', meaning:'the relative size or share of something', example:'Preserve the proportions of the original.' },
    { word:'commission', meaning:'to formally order a piece of work', example:'The department should commission a valuation.' }
  ]
},

/* ------------------------------------------------------------------ 10 */
{
  title: 'Advanced Idioms and Register',
  description: 'Use idioms without sounding out of place.',
  module: 'Vocabulary',
  level: 'Advanced',
  cefr: 'C1',
  content:
`Every idiom belongs to a register. Using a casual idiom in a formal report weakens it, and using a dated idiom in conversation marks you as a learner working from an old textbook.

CURRENT WORKPLACE IDIOMS - fine in speech and informal email
touch base - make brief contact: "Let us touch base next week."
in the loop - kept informed: "Keep me in the loop."
on the same page - in agreement: "Are we on the same page?"
a ballpark figure - a rough estimate: "Can you give me a ballpark figure?"
the bottom line - the essential point: "The bottom line is that we cannot fund it."
a long shot - unlikely to succeed: "It is a long shot, but worth trying."
cut corners - do something improperly to save time: "They cut corners on the survey."
on the back burner - postponed: "The project is on the back burner."
a grey area - not clearly covered by the rules: "Sub-letting is a grey area."
red tape - excessive bureaucracy: "The delay was caused by red tape."

AVOID - dated, and now marks non-native usage
"raining cats and dogs", "as fit as a fiddle", "a piece of cake" in professional contexts, "at the drop of a hat". These appear in textbooks far more often than in current speech.

IN FORMAL WRITING, USE THE PLAIN VERB
on the back burner becomes postponed or deferred
touch base becomes contact or consult
in the loop becomes informed
cut corners becomes failed to follow procedure
a ballpark figure becomes an approximate estimate
the bottom line becomes the key consideration

So you would say "Keep me in the loop" in a meeting, and write "Please keep me informed of developments" in a letter.

REGISTER MARKERS BEYOND IDIOM
Formal: nevertheless, consequently, with regard to, in the event that, request, purchase, commence, terminate
Neutral: however, so, about, if, ask for, buy, start, end
Informal: but, anyway, kind of, a lot of

Mixing registers in one sentence is the most visible error: "The committee nevertheless reckoned the deal was a bit dodgy" puts formal and slang together and reads as a mistake rather than a style.

THE SAFE RULE
In formal writing, if you are not certain an idiom belongs, use the plain verb. Clear plain English is never wrong; a misplaced idiom always is.`,
  practice_text: 'Keep me in the loop on the valuation. In the report, write: the committee deferred the decision. Sub-letting remains a grey area.',
  exercises: [
    { type:'mcq', question:'"Keep me in the loop" means:',
      options:['Keep me informed','Keep me out of it','Repeat the process','Keep me waiting'],
      answer:0, explanation:'"In the loop" means included in the flow of information.' },
    { type:'mcq', question:'In a formal report, "on the back burner" should become:',
      options:['on the back burner','cooking slowly','deferred','forgotten'],
      answer:2, explanation:'Formal writing prefers the plain verb: deferred or postponed.' },
    { type:'mcq', question:'What is wrong with "The committee nevertheless reckoned the deal was a bit dodgy"?',
      options:['Nothing','It mixes formal and slang registers in one sentence','It is too short','"Nevertheless" is incorrect'],
      answer:1, explanation:'"Nevertheless" is formal while "reckoned" and "dodgy" are slang. Mixing registers reads as an error.' },
    { type:'fill', question:'"Sub-letting is a ___ area" - not clearly covered by the rules.', answer:'grey',
      explanation:'"A grey area" describes something the rules do not clearly settle.' },
    { type:'mcq', question:'"They cut corners on the survey" means they:',
      options:['finished early legitimately','did it improperly to save time','measured the corners','reduced the cost'],
      answer:1, explanation:'"Cut corners" means to omit proper steps, with a negative implication.' },
    { type:'mcq', question:'Which idiom is dated and best avoided in professional English?',
      options:['touch base','the bottom line','as fit as a fiddle','a grey area'],
      answer:2, explanation:'"As fit as a fiddle" is dated and appears far more in textbooks than in current speech.' },
    { type:'mcq', question:'You are unsure whether an idiom suits a formal letter. You should:',
      options:['Use it anyway','Use the plain verb instead','Use two idioms for balance','Put it in quotation marks'],
      answer:1, explanation:'Plain English is never wrong; a misplaced idiom always is.' },
    { type:'correct', question:'We will touch base and sort out the dodgy figures in due course.', answer:'We will consult and resolve the inconsistent figures shortly.',
      explanation:'Formal register: replace the phrasal idioms and slang with plain verbs and precise adjectives.' }
  ],
  vocabulary: [
    { word:'register', meaning:'the level of formality of language', example:'Match the register to the audience.' },
    { word:'bureaucracy', meaning:'complex official procedures', example:'Red tape means excessive bureaucracy.' },
    { word:'inconsistent', meaning:'not matching or not in agreement', example:'The figures are inconsistent.' },
    { word:'terminate', meaning:'to bring to an end (formal)', example:'The authority may terminate the lease.' },
    { word:'commence', meaning:'to begin (formal)', example:'Work will commence in April.' }
  ]
},

/* ------------------------------------------------------------------ 11 */
{
  title: 'Understanding Accents and Dialects',
  description: 'Follow English across its world varieties.',
  module: 'Listening',
  level: 'Advanced',
  cefr: 'C1',
  content:
`English has no single correct accent. Most speakers of English worldwide are not native speakers, and international communication usually happens between two non-native accents.

BRITISH (RECEIVED PRONUNCIATION)
Non-rhotic: the r is not pronounced after a vowel, so "car" sounds like "cah" and "water" like "wawtuh".
The "a" in bath, path, dance and chance is long and back: "bahth".
Final t is often a glottal stop: "butter" can sound like "bu'er".

AMERICAN (GENERAL AMERICAN)
Rhotic: every r is pronounced, so "car" and "water" keep a clear r.
The "a" in bath and dance is flat and front, unlike British.
T between vowels becomes a d sound: "water" sounds like "wader", "better" like "bedder".

AUSTRALIAN
The "i" in "nice" shifts towards "noice". Non-rhotic like British. Heavy use of shortened forms.

INDIAN ENGLISH - a legitimate variety with its own standard
Retroflex t and d. Syllable-timed rather than stress-timed rhythm, which is what makes it sound faster to British and American listeners. Often no distinction between v and w.

VOCABULARY THAT DIFFERS
lift / elevator, flat / apartment, queue / line, petrol / gas, lorry / truck, boot / trunk, mobile / cell phone, holiday / vacation, autumn / fall, bill / check, biscuit / cookie, timetable / schedule, torch / flashlight

SPELLING
British: colour, centre, organise, travelled, licence (noun), programme, analyse
American: color, center, organize, traveled, license, program, analyze
Pick one convention and apply it consistently through a document. Mixing the two within one report is a visible error.

TRAINING METHOD
Work on one unfamiliar accent at a time. Listen with a transcript first, then without. Ten minutes daily on a single accent is far more effective than switching between several.

THE GOAL
Comprehension, not imitation. Your own accent is not a defect to be removed. Clarity, correct word stress and sensible pace matter; sounding British or American does not. Confident, clear Indian English is entirely professional, and increasingly the international norm.`,
  practice_text: 'Compare the vowel in dance and path across British, American and Australian speakers. British English says lift and flat; American English says elevator and apartment.',
  exercises: [
    { type:'mcq', question:'What does "non-rhotic" mean?',
      options:['The r is not pronounced after a vowel','The r is rolled','There are no r sounds at all','The r is doubled'],
      answer:0, explanation:'Non-rhotic accents such as British RP drop the r after a vowel: "car" becomes "cah".' },
    { type:'mcq', question:'In American English, "water" often sounds like:',
      options:['wawtuh','wader','wottah','vater'],
      answer:1, explanation:'American English flaps the t between vowels into a d sound, and pronounces the final r.' },
    { type:'mcq', question:'Which is the British word for "elevator"?',
      options:['escalator','lift','stairs','hoist'],
      answer:1, explanation:'British "lift" equals American "elevator".' },
    { type:'mcq', question:'Which set is consistently British spelling?',
      options:['color, center, organize','colour, centre, organise','colour, center, organise','color, centre, organize'],
      answer:1, explanation:'British convention uses -our, -re and -ise. Consistency within a document matters more than which one you pick.' },
    { type:'mcq', question:'What makes Indian English sound faster to British listeners?',
      options:['Speakers actually talk faster','It is syllable-timed rather than stress-timed','It has more vowels','It uses shorter words'],
      answer:1, explanation:'Syllable-timed rhythm gives each syllable similar length, which stress-timed listeners perceive as speed.' },
    { type:'mcq', question:'What should your goal be when training on accents?',
      options:['Imitating a British accent','Comprehension, while keeping your own accent','Removing your accent entirely','Learning all accents at once'],
      answer:1, explanation:'Comprehension is the goal. Clarity and correct stress matter; your own accent is not a defect.' },
    { type:'mcq', question:'What is the most effective accent-training method?',
      options:['Switch between many accents daily','One accent at a time, with a transcript first and then without','Listen only to native speakers','Read aloud only'],
      answer:1, explanation:'Focused, repeated work on a single accent builds the ear faster than variety.' }
  ],
  vocabulary: [
    { word:'variety', meaning:'a recognised regional form of a language', example:'Indian English is a legitimate variety.' },
    { word:'comprehension', meaning:'the ability to understand', example:'The goal is comprehension, not imitation.' },
    { word:'convention', meaning:'an accepted standard way of doing something', example:'Apply one spelling convention consistently.' },
    { word:'imitation', meaning:'copying the way someone else does something', example:'Comprehension matters more than imitation.' }
  ]
}

];
