# Official course map - learn-communication-with-phoebe

Six sessions, 45 minutes each, one running artifact: **the message that keeps failing**.

You are Daybreak's data lead. The subscription redesign is three weeks late and you have to tell
the founder. Same message, rebuilt six times - audience, listening, structure, written, spoken,
and the version where it is bad news and somebody disagrees with you.

Daybreak is the coffee-subscription brand from `learn-sql-with-phoebe`,
`learn-system-design-with-phoebe` and `learn-product-design-with-phoebe`. The redesign that is
late is the one designed in the product-design course, which makes this the third course on the
same running company.

Written and verified 2026-08-26.

---

## What this course is NOT

| If the question is | The course is |
|---|---|
| How do I use AI to draft the writing that fills my week? | `learn-ai-writing-with-phoebe` |
| How do I document software properly? | `learn-tech-writing-with-phoebe` |
| How do I build a deck that carries a talk? | `learn-ai-ppt-with-phoebe` |
| How do I design learning that changes behaviour? | `learn-course-design-with-phoebe` |
| **How do I say a thing to a person so that they act on it?** | **this course** |

Deliberately AI-agnostic. Every judgement here - who the reader is, what you actually want, what
to cut, when to shut up - is one a drafting tool cannot make for you.

---

## Session coverage

Legend: ✓ taught in full · ◐ touched, with the depth pointed elsewhere

### Session 1 - The ask
| Source | | Covered |
|---|---|---|
| Audience before content | ✓ | who reads it, what they already know, what they are afraid of, what they can actually authorise |
| The ask, stated as an action | ✓ | "what do you want them to DO" - and the discovery that most updates contain no ask at all |
| The one-sentence test | ✓ | if you had one sentence and they read nothing else, what is it |
| Reader cost | ✓ | every message spends somebody's attention. Sizing that spend before writing |
| Choosing the channel | ◐ | email, chat, meeting, document. Named as a decision with consequences, not taught in depth |

### Session 2 - Listening first
| Source | | Covered |
|---|---|---|
| You cannot structure a message for someone you have not heard | ✓ | the failure mode where a technically perfect update answers a question nobody asked |
| The two-question move | ✓ | "what would you do with that?" and "what are you worried about?" - asked before drafting |
| Listening to understand rather than to reply | ✓ | the three-second pause, and not preparing your answer during their sentence |
| What silence is doing | ✓ | reading a non-reply: too long, no ask, wrong person, or a decision already made elsewhere |
| Reflecting back | ✓ | "so what I am hearing is" as a correction mechanism rather than a therapy cliche |
| Formal user or stakeholder research | ◐ | `learn-product-design-with-phoebe` session 2 for interview method |

### Session 3 - Structure
| Source | | Covered |
|---|---|---|
| The ask goes first | ✓ | BLUF, and the inverted pyramid borrowed from newsrooms |
| The buried lede, measured | ✓ | your ask is in sentence N of M, and every sentence before it is a chance to stop reading |
| Three structures worth knowing | ✓ | ask-context-detail for a decision; situation-complication-question-answer for a case; what-so-what-now-what for an update |
| Structure survives the medium | ✓ | the same skeleton works in an email, a document and out loud, which is why it is worth having one |
| Halfway scorecard | ✓ | grades the artifact mid-build |
| Long-form document craft | ◐ | `learn-tech-writing-with-phoebe` |

### Session 4 - The written version · **the scorer lands here**
| Source | | Covered |
|---|---|---|
| Sentence length | ✓ | one idea per sentence. Measured live as words per sentence |
| Passive voice, and when it is evasion | ✓ | "it was determined" hides the person, and on a delay it reads as avoiding blame |
| Corporate abstraction | ✓ | a named list, counted live in your own text, listed back to you by name |
| Specifics over adjectives | ✓ | "looking challenging" is not a status; dates and numbers are, and the widget counts them |
| Length as a cost | ✓ | words as a spend on the reader's attention |
| The surprise | ✓ | splitting long sentences without moving the ask pushes the ask FURTHER down. Measured: sentence 4 of 4 becomes sentence 9 of 9 |
| Grammar and style reference | ◐ | this session teaches the six things that actually move the number, not a style guide |

### Session 5 - The spoken version
| Source | | Covered |
|---|---|---|
| The same skeleton, out loud | ✓ | what survives the translation from page to room, and what has to be cut |
| Opening line | ✓ | the spoken equivalent of the ask-first rule, and why "so, some context first" loses the room |
| Handling the interruption | ✓ | the interruption is usually the real question. Answer it rather than defending your agenda |
| Silence, deliberately | ✓ | the pause after a number, and after a request |
| Nerves, treated as physiology | ✓ | what actually helps, honestly stated - preparation of the first 30 seconds beats calming techniques |
| Presenting from slides | ◐ | `learn-ai-ppt-with-phoebe` owns deck craft and assertion-evidence |

### Session 6 - Bad news and disagreement
| Source | | Covered |
|---|---|---|
| Delivering bad news upward | ✓ | early, specific, with the ask and the options, and without the padding that reads as evasion |
| The three things a bad-news message must contain | ✓ | what happened, what it means for them, what you want from them |
| Disagreeing without damage | ✓ | disagree with the position, name the shared goal, and offer the test that would settle it |
| Receiving the pushback | ✓ | the two questions from `learn-product-design-with-phoebe` session 6, applied to a conversation rather than a critique |
| The repair | ✓ | what to do after it went badly, which is the session people most want and least expect |
| Final scorecard | ✓ | ship-or-not on the message you have been building |
| Formal negotiation | ◐ | `learn-negotiation-with-phoebe`, planned in the same bucket |

---

## The scorer: `assets/comm-live.js`

Two modes over one set of measurement functions.

- **The Daybreak message** - real text, assembled from paragraph variants as levers toggle. The
  words on screen genuinely change and every figure is computed from them.
- **Paste your own** - same functions, same numbers, no levers, because nothing here can honestly
  rewrite a message it has never seen. Nothing leaves the browser.

**Measured, not modelled:** words per sentence · passive-voice hits (heuristic, and the page says
so) · corporate abstraction hits, listed back by name from a fixed list of 30 · specifics (dates,
weekdays, months, numbers) · total words · **which sentence the ask is in, out of how many**.

**Modelled:** the weighting of those six into a score out of 100. The rubric:

| Row | Points | Full marks at |
|---|---|---|
| Where the ask is | 30 | sentence 1 or 2 |
| Sentence length | 20 | 15 words per sentence or fewer |
| Active voice | 15 | zero passive hits |
| Plain words | 15 | zero abstraction hits |
| Specifics | 10 | three or more dates/numbers |
| Length | 10 | 120 words or fewer |

**The ladder, verified 2026-08-26. These are the numbers the session pages quote.**

| Lever added | Score | Ask position | Words/sentence | Passive | Jargon | Specifics | Words |
|---|---|---|---|---|---|---|---|
| the message as sent | 5/100 | 4 of 4 | 40.8 | 8 | 9 | 0 | 163 |
| + put the ask first | 35/100 | 1 of 4 | 40.8 | 8 | 9 | 0 | 163 |
| + delete the opener | 45/100 | 1 of 3 | 39.0 | 7 | 4 | 0 | 117 |
| + one idea per sentence | 59/100 | 1 of 6 | 18.3 | 7 | 3 | 0 | 110 |
| + say who did what | 69/100 | 1 of 5 | 19.6 | 3 | 2 | 0 | 98 |
| + plain words | 84/100 | 1 of 4 | 17.3 | 2 | 1 | 5 | 69 |
| + dates and numbers | **100/100** | 1 of 6 | 9.5 | 0 | 0 | 7 | 57 |
| **+ "give them the full picture"** | **64/100** | **4 of 9** | 16.1 | 1 | 0 | 9 | 145 |

The abstractions the widget finds by name in the original: *circle back, going forward, holistic,
ecosystem, workstream, state of play, knock-on, as you will be aware, at this moment in time.*

### The two teaching moves this scorer exists for

1. **Ask position is worth 30 points and costs one cut-and-paste.** Moving one paragraph takes the
   message from 5 to 35 without changing a single word. Nothing else on the board is that cheap.
2. **The counter-intuitive one, and it is measured rather than asserted.** Splitting long
   sentences *on its own* takes the message from 5 to 19 and moves the ask from **sentence 4 of 4
   to sentence 9 of 9**. More sentences before the ask means more places to stop reading. Clarity
   work that ignores position can make a message worse, and the widget proves it rather than
   claiming it.

### The anti-lever

"Add background so they have the full picture" is the most reasonable-sounding request in
professional life. It inserts a genuinely accurate, genuinely relevant paragraph - and because it
goes in front of everything, the finished 100-point message falls to 64 with the ask back in
sentence 4 of 9. Nothing is penalised for being thorough. The ask simply moved, and that is
measured.

Same shape as the detector anti-lever in `learn-ai-education-with-phoebe` and the brighten-it-up
anti-lever in `learn-product-design-with-phoebe`: a toggle the learner is expected to reach for,
which teaches by failing honestly.

---

## Honest limits, stated on the pages

- The passive-voice detector is a **regex heuristic** over a fixed participle list, allowing one
  adverb between the be-verb and the participle. It will miss some passives and occasionally flag
  a false one. The page says so where the number appears.
- The abstraction list is **30 entries, chosen not derived**. It is a starting point for noticing,
  not a standard.
- Daybreak, the founder and the message are a **teaching scenario**. The measurement code is real;
  the situation is written.
- The score is a rubric, not a finding about your career. Two people can write a 70 and an 85 and
  the 70 can be the better message for its reader.

Certificates, videos and graded assessments stay with the official providers.
