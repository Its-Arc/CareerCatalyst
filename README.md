# CareerCatalyst - AI-Powered Career Guidance Platform

CareerCatalyst is an intelligent web application designed to help job seekers and students confidently navigate their career paths with personalized AI assistance. By acting as a virtual career counselor, it provides resume feedback, tailors learning paths, and offers mock interview practice.

## 🚀 Features

- **Smart Resume Analysis (ATS)**: Upload your resume or paste the text to get an instant ATS score, identify skill gaps, and receive actionable, AI-driven improvements.
- **Domain & Learning Path Selection**: Choose your target role and get a personalized, AI-generated curriculum and learning plan to bridge your skill gaps.
- **Interactive Mock Interviews**: Practice your interview skills with an interactive AI interviewer that generates domain-specific questions and provides real-time feedback on your answers.
- **Skill Assessment Quizzes**: Test your knowledge with dynamically generated multiple-choice quizzes based on your chosen career domain.
- **Career Progress Dashboard**: Visually track your learning progress, quiz scores, interview performance, and overall readiness in one centralized dashboard.
- **Job Recommendations**: Get curated role descriptions and job recommendations based on your analyzed resume and strengths.

## 🛠️ Tech Stack

- **Frontend**: React.js, Vite, Tailwind CSS, React Router
- **AI Integration**: Groq API (Llama-3.3-70b-versatile) for lightning-fast, high-quality natural language processing and structured data extraction.
- **Data Storage**: LocalStorage for fast, serverless, and private persistence of user data and progress.
- **UI/UX**: Lucide React for modern, scalable iconography.

## ⚙️ Workflow & Architecture

1. **Onboarding**: Users start by providing their resume text.
2. **Analysis Phase**: The application securely sends the resume to the Groq AI API, which analyzes it against ATS standards and returns a structured JSON response detailing an overall score, strengths, and areas for improvement.
3. **Path Generation**: Based on the analysis, users select a target domain. The AI crafts a step-by-step learning plan customized to bridge the user's specific skill gaps.
4. **Preparation Phase**:
   - **Quizzes**: Users take AI-generated quizzes to validate their theoretical knowledge.
   - **Interviews**: Users engage in mock interview scenarios where the AI evaluates the quality, tone, and technical accuracy of their responses.
5. **Progress Tracking**: All activities (quiz scores, interview feedback, resume score) automatically update the user's statistics in `localStorage`, tracking their growth dynamically on the Progress Dashboard.

## 💻 Running Locally

1. Clone the repository: 
   ```bash
   git clone https://github.com/yourusername/careercatalyst.git
   ```
2. Navigate to the project directory:
   ```bash
   cd careercatalyst
   ```
3. Install dependencies: 
   ```bash
   npm install
   ```
4. Create a `.env` file in the root directory and add your Groq API key:
   ```env
   VITE_GROQ_API_KEY=your_groq_api_key_here
   ```
5. Start the development server: 
   ```bash
   npm run dev
   ```

## 🤝 Contributing
Contributions are welcome! Feel free to open an issue or submit a pull request if you'd like to improve the project.
