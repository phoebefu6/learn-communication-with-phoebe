# learn-communication-with-phoebe

**Six sessions, 45 minutes each, one message you rebuild in every single one of them.**

Live: https://phoebefu6.github.io/learn-communication-with-phoebe/

You are Daybreak's data lead. The subscription redesign is three weeks late and you have to tell
the founder. You have sent three updates. None got a reply. Then she said "why is this the first
I am hearing about this" in front of eight people.

The updates were accurate, professional and complete. None of them contained a sentence telling
her what to do.

Deliberately AI-agnostic. Every judgement here is one a drafting tool cannot make for you.

## Sessions

1. The ask - the reader, the ask, the one-sentence test
2. Listening first - the two questions, and reading a non-reply
3. Structure - ask first, three skeletons, the buried lede
4. **The written version** - the clarity scorer
5. The spoken version - opening line, interruptions, silence
6. Bad news and disagreement - the version this course was built for

## The clarity scorer

`assets/comm-live.js`. Two modes over one set of measurement functions: the Daybreak message,
with levers that genuinely rewrite the text, and **paste your own**, which has no levers because
nothing here can honestly rewrite a message it has never seen. Nothing leaves the browser and
there is no model call anywhere in it.

**Measured:** words per sentence · passive-voice hits (a stated heuristic) · corporate
abstractions, reported back by name from a fixed list of 30 · dates and numbers · total words ·
**which sentence your ask is in, out of how many.**

**Modelled:** the weighting of those six into a score out of 100. Rubric in the source map.

The ladder, verified in-browser: **5 → 35 → 45 → 59 → 69 → 84 → 100**, ask position going from
sentence 4 of 4 to sentence 1 of 6, and 163 words down to 57.

Two teaching moves it exists for:

- **Ask position is worth 30 points and costs one cut-and-paste.** 5 to 35 without a single word
  rewritten.
- **The splitting trap, measured rather than asserted.** Splitting long sentences *on its own*
  scores 19 and moves the ask from sentence 4 of 4 to **sentence 9 of 9** - more sentences above
  the ask means more places to stop reading. Structure before style.

**The anti-lever:** "add background so they have the full picture" takes the finished 100-point
message to **64**, with the ask back in sentence 4 of 9. The paragraph it adds is accurate,
relevant and well written. It just goes in front of the ask, and the measurement notices.

## Structure

```
index.html                        landing, mindmap, paths
courses/01..06-*.html             the six sessions
assets/style.css                  editorial-bold, deep petrol + signal orange
assets/app.js                     accordions, quizzes, passport, widget kit
assets/mindmap.js                 radial knowledge map
assets/comm-live.js               the clarity scorer
materials/official-course-map.md  source map, the full rubric, and the honest limits
materials/widget-kit.md           markup contracts for the interactive components
```

Static HTML, no build step:

```bash
python3 -m http.server 8000
```

by Phoebe Fu · part of [Learn with Phoebe](https://phoebefu6.github.io/learn-with-phoebe/)
