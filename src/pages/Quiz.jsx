import React, { useState } from 'react';
import { callClaude, parseJSONResponse } from '../utils/callClaude';
import { Loader2, Award, ArrowRight, RefreshCcw } from 'lucide-react';

export default function Quiz() {
    const [domain, setDomain] = useState('Software Engineering');
    const [difficulty, setDifficulty] = useState('Medium');
    const [count, setCount] = useState(5);

    const [quizData, setQuizData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [currentIdx, setCurrentIdx] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [score, setScore] = useState(0);
    const [isAnswersRevealed, setIsAnswersRevealed] = useState(false);
    const [quizFinished, setQuizFinished] = useState(false);

    const generateQuiz = async () => {
        setLoading(true);
        setError(null);
        setQuizData(null);
        setCurrentIdx(0);
        setScore(0);
        setQuizFinished(false);
        setSelectedOption(null);
        setIsAnswersRevealed(false);

        const prompt = `Generate a multiple-choice quiz. Domain: ${domain}. Difficulty: ${difficulty}. Count: ${count}.
Return JSON:
{
  "questions": [
    {
      "question": "<question text>",
      "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
      "correctAnswer": "A",
      "explanation": "<short explanation>"
    }
  ]
}
Return ONLY the JSON.`;

        try {
            const resp = await callClaude(prompt, "Start Quiz Generation");
            const parsed = parseJSONResponse(resp);
            setQuizData(parsed.questions || []);
        } catch (err) {
            setError(err.message || "Failed to generate quiz.");
        } finally {
            setLoading(false);
        }
    };

    const handleSelectOption = (index) => {
        if (isAnswersRevealed) return;
        const isCorrect = "ABCD"[index] === quizData[currentIdx].correctAnswer.charAt(0);
        setSelectedOption(index);
        setIsAnswersRevealed(true);
        if (isCorrect) setScore(score + 1);
    };

    const nextQuestion = () => {
        if (currentIdx + 1 < quizData.length) {
            setCurrentIdx(currentIdx + 1);
            setSelectedOption(null);
            setIsAnswersRevealed(false);
        } else {
            finishQuiz();
        }
    };

    const finishQuiz = () => {
        setQuizFinished(true);
        const finalScore = score + (isAnswersRevealed && "ABCD"[selectedOption] === quizData[currentIdx].correctAnswer.charAt(0) ? 0 : 0); // score was already updated directly on select
        const percentage = Math.round((score / quizData.length) * 100);
        let badge = 'Beginner';
        if (percentage > 85) badge = 'Expert';
        else if (percentage >= 60) badge = 'Intermediate';

        const historyRecord = {
            date: new Date().toISOString(),
            domain,
            difficulty,
            score: score,
            total: quizData.length,
            badge
        };

        const prevHistory = JSON.parse(localStorage.getItem('vidyamitra_quiz_history') || '[]');
        localStorage.setItem('vidyamitra_quiz_history', JSON.stringify([...prevHistory, historyRecord]));
    };

    if (quizFinished) {
        const percentage = Math.round((score / quizData.length) * 100);
        let badge = 'Beginner';
        if (percentage > 85) badge = 'Expert';
        else if (percentage >= 60) badge = 'Intermediate';

        return (
            <div className="max-w-2xl mx-auto py-16 text-center animate-in zoom-in-95 duration-500">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-10">
                    <Award className={`w-24 h-24 mx-auto mb-6 ${percentage > 85 ? 'text-yellow-500' : percentage >= 60 ? 'text-primary' : 'text-gray-400'}`} />
                    <h2 className="text-4xl font-black text-gray-900 mb-2">Quiz Completed!</h2>
                    <p className="text-xl text-gray-600 mb-8">You scored {score} out of {quizData.length}</p>

                    <div className="flex justify-center space-x-6 mb-10">
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex-1">
                            <span className="block text-sm text-gray-500 font-medium mb-1">Percentage</span>
                            <span className="block text-3xl font-bold text-gray-900">{percentage}%</span>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex-1">
                            <span className="block text-sm text-gray-500 font-medium mb-1">Skill Badge</span>
                            <span className={`block text-2xl font-bold ${percentage > 85 ? 'text-yellow-600' : 'text-primary'}`}>{badge}</span>
                        </div>
                    </div>

                    <button onClick={() => { setQuizData(null); setQuizFinished(false); }} className="bg-primary hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg transition-colors inline-flex items-center">
                        <RefreshCcw className="w-5 h-5 mr-3" />
                        Take Another Quiz
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto py-8">
            {!quizData && !loading && (
                <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                        <Award className="w-6 h-6 mr-3 text-primary" /> Skill Assessment
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Domain</label>
                            <select value={domain} onChange={e => setDomain(e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary outline-none">
                                <option>Software Engineering</option>
                                <option>Data Science</option>
                                <option>Product Management</option>
                                <option>Marketing</option>
                                <option>Finance</option>
                                <option>Design</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                            <select value={difficulty} onChange={e => setDifficulty(e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary outline-none">
                                <option>Easy</option>
                                <option>Medium</option>
                                <option>Hard</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Questions</label>
                            <select value={count} onChange={e => setCount(e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary outline-none">
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="15">15</option>
                            </select>
                        </div>
                    </div>

                    {error && <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg mb-6">{error}</div>}

                    <button onClick={generateQuiz} className="w-full bg-primary hover:bg-indigo-700 text-white font-bold py-4 rounded-lg shadow-md transition-colors text-lg">
                        Generate Quiz
                    </button>
                </div>
            )}

            {loading && (
                <div className="flex flex-col flex-1 items-center justify-center p-16 text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
                    <h3 className="text-xl font-bold text-gray-900">Generating Assessment...</h3>
                </div>
            )}

            {quizData && (
                <div className="animate-in fade-in duration-300">
                    {/* Progress Bar */}
                    <div className="mb-6 flex items-center justify-between">
                        <span className="text-sm font-bold tracking-widest text-gray-500 uppercase">Question {currentIdx + 1} of {quizData.length}</span>
                        <span className="text-sm font-bold tracking-widest text-primary uppercase">Score: {score}</span>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
                        <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: `${((currentIdx + 1) / quizData.length) * 100}%` }}></div>
                    </div>

                    <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
                        <h3 className="text-xl font-medium text-gray-900 mb-6 leading-relaxed">
                            {quizData[currentIdx].question}
                        </h3>

                        <div className="space-y-3 mb-8">
                            {quizData[currentIdx].options.map((opt, i) => {
                                let optClass = "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 bg-white";

                                if (isAnswersRevealed) {
                                    const isCorrectOpt = "ABCD"[i] === quizData[currentIdx].correctAnswer.charAt(0);
                                    const isSelectedOpt = selectedOption === i;

                                    if (isCorrectOpt) {
                                        optClass = "border-green-500 bg-green-50 text-green-900 shadow-sm";
                                    } else if (isSelectedOpt && !isCorrectOpt) {
                                        optClass = "border-red-400 bg-red-50 text-red-900 opacity-60";
                                    } else {
                                        optClass = "border-gray-200 opacity-50";
                                    }
                                }

                                return (
                                    <button
                                        key={i}
                                        onClick={() => handleSelectOption(i)}
                                        disabled={isAnswersRevealed}
                                        className={`w-full text-left p-4 rounded-lg border-2 font-medium transition-all ${optClass}`}
                                    >
                                        {opt}
                                    </button>
                                );
                            })}
                        </div>

                        {isAnswersRevealed && (
                            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg mb-6 animate-in slide-in-from-bottom-2 fade-in">
                                <h4 className="font-bold text-blue-900 text-sm mb-1 text-uppercase tracking-wider">Explanation</h4>
                                <p className="text-sm text-blue-800 leading-relaxed">{quizData[currentIdx].explanation}</p>
                            </div>
                        )}

                        {isAnswersRevealed && (
                            <div className="flex justify-end pt-4 border-t border-gray-100">
                                <button
                                    onClick={nextQuestion}
                                    className="bg-primary hover:bg-indigo-700 text-white font-medium px-6 py-2.5 rounded-lg flex items-center transition-colors shadow-sm"
                                >
                                    {currentIdx + 1 === quizData.length ? 'Finish Quiz' : 'Next Question'}
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
