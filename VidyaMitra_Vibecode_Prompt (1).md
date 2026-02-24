# VidyaMitra — Antigravity Vibe-Code Prompt

> Paste everything inside the code block below into Antigravity as your starting prompt.

---

```
You are building **VidyaMitra**, an AI-powered career guidance web app (MVP only).
Use a single-page React application with React Router for navigation.
Use Tailwind CSS for all styling. Use localStorage for ALL data persistence — no backend, no database.
Use the Anthropic API (claude-sonnet-4-20250514, max_tokens: 1024) directly from the frontend for all AI features.
The API key will be entered by the user in a settings modal and stored in localStorage.

---

## TECH STACK
- React (Vite)
- React Router v6
- Tailwind CSS
- Anthropic API via fetch() (no SDK)
- localStorage for state persistence

---

## APP STRUCTURE — PAGES & ROUTES

Build the following pages with a persistent top navbar showing the app name and nav links:

1. `/` — **Home / Landing**
2. `/resume` — **Resume Upload & Analysis**
3. `/domain` — **Domain & Job Role Selection**
4. `/plan` — **Personalized Learning Plan**
5. `/quiz` — **Skill Quiz**
6. `/interview` — **Mock Interview**
7. `/progress` — **Learning Progress Dashboard**
8. `/jobs` — **Job Recommendations**
9. `/settings` — **API Key Settings**

---

## DETAILED PAGE SPECS

### 1. Home (`/`)
- Hero section: "VidyaMitra – Your AI Career Mentor"
- Short tagline and a CTA button: "Start Your Career Journey"
- Three feature cards with icons: Resume Analysis, Mock Interview, Learning Plan
- CTA navigates to `/resume`

---

### 2. Resume Upload & Analysis (`/resume`)
- File upload input (accept `.pdf`, `.txt`, `.doc` — read as text using FileReader)
- Textarea fallback: user can paste resume text directly
- "Analyse Resume" button
- On submit: send resume text to Claude API with this system prompt:
  ```
  You are an expert career advisor. Analyse the provided resume. Return a JSON object with:
  {
    "overallScore": <number 0-100>,
    "strengths": [<string>, ...],
    "skillGaps": [<string>, ...],
    "suggestedCourses": [<string>, ...],
    "summary": "<2-3 sentence overall assessment>"
  }
  Return ONLY the JSON, no markdown, no extra text.
  ```
- Parse the JSON response and display:
  - Score as a circular progress indicator (CSS only)
  - Strengths and Skill Gaps as styled tag chips
  - Suggested Courses as a list
  - Summary as a card
- Save parsed result to localStorage key `vidyamitra_resume`
- Show "Proceed to Domain Selection" button after analysis

---

### 3. Domain & Job Role Selection (`/domain`)
- Step 1 — Domain selector: show clickable cards for domains:
  `Software Engineering`, `Data Science`, `Product Management`, `Marketing`, `Finance`, `Design`, `Other`
- Step 2 — After selecting domain, show a searchable list of 6–8 predefined job roles for that domain as clickable chips
- Allow custom job role input if nothing matches
- Save `{ domain, jobRole }` to localStorage key `vidyamitra_career`
- "Generate Learning Plan" button navigates to `/plan`

---

### 4. Personalized Learning Plan (`/plan`)
- Read `vidyamitra_resume` and `vidyamitra_career` from localStorage
- Send to Claude API with this system prompt:
  ```
  You are an expert career coach. Given the user's resume analysis and target career, generate a structured 12-week learning plan.
  Return a JSON object:
  {
    "weeklyPlan": [
      { "week": 1, "focus": "<topic>", "tasks": ["<task1>", "<task2>"], "resources": ["<resource1>"] },
      ...
    ],
    "keyMilestones": ["<milestone1>", ...],
    "estimatedTimePerWeek": "<hours>"
  }
  Return ONLY the JSON.
  ```
- Render the plan as an accordion (one card per week, expandable)
- Show key milestones as a timeline
- Save plan to localStorage key `vidyamitra_plan`

---

### 5. Skill Quiz (`/quiz`)
- Controls at top: Domain dropdown, Difficulty (Easy / Medium / Hard), Number of questions (5 / 10 / 15)
- "Generate Quiz" button — call Claude API:
  ```
  Generate a multiple-choice quiz. Domain: {domain}. Difficulty: {difficulty}. Count: {count}.
  Return JSON:
  {
    "questions": [
      {
        "question": "<question text>",
        "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
        "correctAnswer": "A",
        "explanation": "<why>"
      }
    ]
  }
  Return ONLY the JSON.
  ```
- Show one question at a time with option buttons
- After selecting an answer, highlight correct/wrong and show explanation
- Progress bar at top (Question X of Y)
- Results screen: score, percentage, performance badge (Beginner / Intermediate / Expert)
- Save quiz result to localStorage key `vidyamitra_quiz_history` (append to array)

---

### 6. Mock Interview (`/interview`)
- User selects job role (text input pre-filled from localStorage `vidyamitra_career`)
- "Start Interview" button begins a 5-question AI-driven interview session
- For each question:
  - Call Claude API to generate one behavioural/technical interview question based on job role and previous Q&A context
  - User types their answer in a textarea
  - "Submit Answer" sends the answer to Claude for feedback:
    ```
    You are a senior interviewer. Evaluate this answer for the question asked. Return JSON:
    {
      "score": <1-10>,
      "feedback": "<specific feedback>",
      "improvedAnswer": "<example of a stronger answer>"
    }
    Return ONLY the JSON.
    ```
  - Show score, feedback, and improved answer before moving to next question
- After 5 questions, show overall interview report: average score, top strength, top area to improve
- Save report to localStorage key `vidyamitra_interview_history` (append)

---

### 7. Learning Progress Dashboard (`/progress`)
- Read all history from localStorage: `vidyamitra_quiz_history`, `vidyamitra_interview_history`, `vidyamitra_plan`
- Display:
  - Quiz history table: date, domain, score, badge
  - Interview history table: date, role, average score
  - Learning plan completion: checklist where user can tick off completed weeks (save ticks to localStorage `vidyamitra_plan_progress`)
  - A simple bar chart (CSS/SVG — no chart library needed) showing quiz scores over time

---

### 8. Job Recommendations (`/jobs`)
- Read `vidyamitra_career` and `vidyamitra_resume` from localStorage
- Call Claude API:
  ```
  Based on this resume analysis and target career domain, suggest 6 job roles the user should apply for.
  Return JSON:
  {
    "jobs": [
      {
        "title": "<Job Title>",
        "company": "<Example Company Type>",
        "matchScore": <0-100>,
        "requiredSkills": ["<skill>", ...],
        "applyLink": "https://www.linkedin.com/jobs/search/?keywords=<encoded title>"
      }
    ]
  }
  Return ONLY the JSON.
  ```
- Render as cards with match score badge, required skills chips, and "Apply Now" button (opens applyLink in new tab)

---

### 9. Settings (`/settings`)
- Input field for Anthropic API Key (type=password, toggle show/hide)
- Save to localStorage key `vidyamitra_api_key`
- Show confirmation toast on save
- Brief instructions: "Get your key from platform.openai.com" — link to https://console.anthropic.com/

---

## GLOBAL REQUIREMENTS

### API Helper
Create a single `callClaude(systemPrompt, userMessage)` async utility function used by all pages:
```js
async function callClaude(systemPrompt, userMessage) {
  const apiKey = localStorage.getItem('vidyamitra_api_key');
  if (!apiKey) throw new Error('No API key set. Go to Settings.');
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }]
    })
  });
  const data = await response.json();
  return data.content[0].text;
}
```

### Error Handling
- Wrap all API calls in try/catch
- Show an inline error banner (red) if the API call fails
- Show a loading spinner/skeleton while waiting for AI responses

### UI / UX
- Color palette: Deep Indigo (#4F46E5) primary, Teal (#14B8A6) accent, white background
- All cards should have subtle shadow and rounded corners (rounded-xl)
- Navbar: logo left, nav links right, Settings icon top-right
- Mobile responsive — use Tailwind's responsive prefixes (sm:, md:, lg:)
- Smooth page transitions using React Router's built-in navigation

### JSON Safety
- Always wrap JSON.parse() in try/catch
- Strip any ```json fences from AI responses before parsing: `text.replace(/```json|```/g, '').trim()`

---

## WHAT NOT TO BUILD
- No login/auth system
- No real backend
- No database
- No file storage beyond localStorage
- No payment or subscription features
- Keep it simple and shippable

---

Build this step by step, starting with the project scaffold (Vite + React + Tailwind + React Router), then the API utility, then each page in the order listed above.
```
