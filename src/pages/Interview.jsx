import React, { useState, useEffect } from 'react';
import { callClaude, parseJSONResponse } from '../utils/callClaude';
import { Loader2, MessageSquare, CheckCircle, AlertTriangle, ArrowRight, Play, Briefcase } from 'lucide-react';

export default function Interview() {
    const [role, setRole] = useState('');
    const [isStarted, setIsStarted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [questionCount, setQuestionCount] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState('');
    const [userAnswer, setUserAnswer] = useState('');
    const [feedback, setFeedback] = useState(null);
    const [interviewHistory, setInterviewHistory] = useState([]);
    const [interviewCompleted, setInterviewCompleted] = useState(false);
    const [finalReport, setFinalReport] = useState(null);

    useEffect(() => {
        const savedCareer = localStorage.getItem('careercatalyst_career');
        if (savedCareer) {
            try {
                const parsed = JSON.parse(savedCareer);
                if (parsed.jobRole) setRole(parsed.jobRole);
            } catch (e) { }
        }
    }, []);

    const totalQuestions = 5;

    const generateQuestion = async (contextHist) => {
        setLoading(true);
        setError(null);
        setFeedback(null);
        setUserAnswer('');

        // Build context block from previous answers to avoid repeating topics
        let contextStr = contextHist.length > 0
            ? `\nPrevious questions asked:\n` + contextHist.map((h, i) => `${i + 1}. ${h.question}`).join('\n')
            : '';

        const prompt = `You are a strict but fair senior technical/behavioral interviewer for a ${role} position.
Generate exactly ONE interview question. It can be technical or behavioral. Do not repeat previous topics.${contextStr}
Return ONLY a plain JSON object with no markdown:
{
  "question": "<The exact interview question>"
}`;

        try {
            const resp = await callClaude(prompt, "Please formulate the next interview question.");
            const parsed = parseJSONResponse(resp);
            setCurrentQuestion(parsed.question);
            setQuestionCount((prev) => prev + 1);
        } catch (err) {
            setError(err.message || "Failed to generate question.");
        } finally {
            setLoading(false);
        }
    };

    const startInterview = () => {
        if (!role.trim()) {
            setError("Please enter a job role first.");
            return;
        }
        setIsStarted(true);
        setInterviewHistory([]);
        setQuestionCount(0);
        setInterviewCompleted(false);
        generateQuestion([]);
    };

    const submitAnswer = async () => {
        if (!userAnswer.trim()) {
            setError("Please type an answer to the question.");
            return;
        }

        setLoading(true);
        setError(null);

        const prompt = `You are a senior interviewer evaluating a candidate's answer for a ${role} position.
Question Asked: "${currentQuestion}"
Candidate Answer: "${userAnswer}"

Evaluate this answer. Return a JSON object:
{
  "score": <number from 1 to 10>,
  "feedback": "<specific, actionable feedback on what was good and what was missing>",
  "improvedAnswer": "<an example of a 10/10 stronger answer utilizing the STAR format if behavioral>"
}
Return ONLY the JSON.`;

        try {
            const resp = await callClaude(prompt, "Evaluate candidate answer.");
            const parsed = parseJSONResponse(resp);
            setFeedback(parsed);
            setInterviewHistory(prev => [...prev, {
                question: currentQuestion,
                answer: userAnswer,
                score: parsed.score,
                feedback: parsed.feedback,
                improvedAnswer: parsed.improvedAnswer
            }]);
        } catch (err) {
            setError(err.message || "Failed to evaluate answer.");
        } finally {
            setLoading(false);
        }
    };

    const nextAction = () => {
        if (questionCount < totalQuestions) {
            generateQuestion(interviewHistory);
        } else {
            finishInterview();
        }
    };

    const finishInterview = async () => {
        setLoading(true);
        setError(null);

        const avgScore = interviewHistory.reduce((acc, curr) => acc + curr.score, 0) / totalQuestions;

        const analysisPrompt = `You are a senior tech recruiter. Analyze the candidate's performance across these 5 questions and provide a final summary.
Performance Data: ${JSON.stringify(interviewHistory.map(h => ({ q: h.question, score: h.score, feedback: h.feedback })))}

Return a JSON object:
{
  "topStrength": "<Short phrase describing their best quality>",
  "topAreaToImprove": "<Short phrase on what they need to work on most>"
}
Return ONLY the JSON.`;

        try {
            const resp = await callClaude(analysisPrompt, "Generate final interview report.");
            const parsed = parseJSONResponse(resp);

            const report = {
                role,
                date: new Date().toISOString(),
                averageScore: avgScore,
                topStrength: parsed.topStrength,
                topAreaToImprove: parsed.topAreaToImprove
            };

            setFinalReport(report);
            setInterviewCompleted(true);

            const prevHistory = JSON.parse(localStorage.getItem('careercatalyst_interview_history') || '[]');
            localStorage.setItem('careercatalyst_interview_history', JSON.stringify([...prevHistory, report]));

        } catch (err) {
            setError("Failed to generate final report. Your progress is saved.");
            setInterviewCompleted(true);
        } finally {
            setLoading(false);
        }
    };

    if (interviewCompleted && finalReport) {
        return (
            <div className="max-w-3xl mx-auto py-12 animate-in fade-in zoom-in-95">
                <div className="bg-white p-10 rounded-2xl shadow-xl border border-gray-100 text-center">
                    <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
                    <h2 className="text-3xl font-black text-gray-900 mb-2">Interview Completed</h2>
                    <p className="text-gray-600 mb-8">Here is your customized performance teardown.</p>

                    <div className="flex justify-center mb-8">
                        <div className="bg-indigo-50 border-2 border-indigo-100 p-8 rounded-full w-40 h-40 flex flex-col items-center justify-center">
                            <span className="text-4xl font-extrabold text-primary">{finalReport.averageScore.toFixed(1)}</span>
                            <span className="text-sm font-bold text-indigo-400">/ 10</span>
                            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-800 mt-2">Avg Score</span>
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6 text-left mb-8">
                        <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                            <h4 className="font-bold text-green-800 flex items-center mb-2">
                                <CheckCircle className="w-4 h-4 mr-2" /> Top Strength
                            </h4>
                            <p className="text-green-900 text-sm">{finalReport.topStrength}</p>
                        </div>
                        <div className="bg-orange-50 p-6 rounded-xl border border-orange-100">
                            <h4 className="font-bold text-orange-800 flex items-center mb-2">
                                <AlertTriangle className="w-4 h-4 mr-2" /> Area to Improve
                            </h4>
                            <p className="text-orange-900 text-sm">{finalReport.topAreaToImprove}</p>
                        </div>
                    </div>

                    <button onClick={() => setIsStarted(false)} className="bg-primary hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg">
                        Start Another Interview
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto py-8">
            {!isStarted && (
                <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 text-center max-w-xl mx-auto">
                    <MessageSquare className="w-16 h-16 text-primary mx-auto mb-6" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">AI Mock Interview</h2>
                    <p className="text-gray-600 mb-8">Face 5 tailored questions from our AI interviewer and receive deep, actionable feedback on your answers.</p>

                    <div className="mb-6 text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Target Job Role</label>
                        <div className="relative">
                            <Briefcase className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none text-gray-900"
                                placeholder="e.g. Frontend Developer"
                            />
                        </div>
                    </div>

                    {error && <div className="text-red-500 mb-4 text-sm font-medium">{error}</div>}

                    <button onClick={startInterview} className="w-full bg-primary hover:bg-indigo-700 text-white font-bold py-4 rounded-lg flex justify-center items-center text-lg transition-colors shadow-md">
                        <Play className="w-5 h-5 mr-3 fill-current" /> Initialize Interview
                    </button>
                </div>
            )}

            {isStarted && (
                <div className="animate-in fade-in slide-in-from-bottom-4">
                    <div className="mb-6 flex items-center justify-between">
                        <h3 className="font-bold text-gray-900 text-lg flex items-center">
                            <MessageSquare className="w-5 h-5 text-primary mr-2" />
                            Question {questionCount} of {totalQuestions}
                        </h3>
                        <span className="text-xs font-bold px-3 py-1 bg-gray-100 text-gray-600 rounded-full uppercase tracking-wider">
                            {role} Interview
                        </span>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-6">
                        {loading && !feedback && !currentQuestion ? (
                            <div className="min-h-[150px] flex items-center justify-center text-gray-400">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                <span className="ml-3 font-medium">Formulating question...</span>
                            </div>
                        ) : (
                            <p className="text-xl font-medium text-gray-900 leading-relaxed border-l-4 border-primary pl-4 py-2">
                                "{currentQuestion}"
                            </p>
                        )}
                    </div>

                    {!feedback && currentQuestion && (
                        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 animate-in fade-in">
                            <label className="block text-sm font-semibold text-gray-900 mb-3">Your Answer</label>
                            <textarea
                                value={userAnswer}
                                onChange={(e) => setUserAnswer(e.target.value)}
                                disabled={loading}
                                className="w-full h-40 p-4 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none transition resize-none disabled:opacity-50"
                                placeholder="Type your answer here..."
                            ></textarea>

                            {error && <div className="text-red-500 mt-3 text-sm font-medium flex items-center"><AlertTriangle className="w-4 h-4 mr-1" />{error}</div>}

                            <div className="mt-4 flex justify-end">
                                <button
                                    onClick={submitAnswer}
                                    disabled={loading || !userAnswer.trim()}
                                    className="bg-accent hover:bg-teal-600 text-white font-bold py-2.5 px-6 rounded-lg transition-colors disabled:opacity-60 flex items-center shadow-sm"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit Answer"}
                                </button>
                            </div>
                        </div>
                    )}

                    {feedback && (
                        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-2">
                            <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-b border-gray-200">
                                <h4 className="font-bold text-gray-900">AI Evaluation</h4>
                                <div className="flex items-center text-primary font-black text-xl">
                                    {feedback.score} <span className="text-sm font-medium text-gray-500 ml-1">/ 10</span>
                                </div>
                            </div>
                            <div className="p-6 space-y-6">
                                <div>
                                    <h5 className="font-semibold text-gray-900 mb-2 text-sm uppercase tracking-wide">Feedback</h5>
                                    <p className="text-gray-700 text-sm leading-relaxed">{feedback.feedback}</p>
                                </div>

                                <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                                    <h5 className="font-bold text-indigo-900 mb-2 text-sm flex items-center">
                                        <CheckCircle className="w-4 h-4 mr-2" /> Improved Answer Example
                                    </h5>
                                    <p className="text-indigo-800 text-sm italic">"{feedback.improvedAnswer}"</p>
                                </div>

                                <div className="flex justify-end pt-2">
                                    {loading ? (
                                        <div className="flex items-center text-primary font-medium py-3"><Loader2 className="w-5 h-5 animate-spin mr-2" /> Preparing next step...</div>
                                    ) : (
                                        <button
                                            onClick={nextAction}
                                            className="bg-primary hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg flex items-center shadow transition-colors"
                                        >
                                            {questionCount < totalQuestions ? 'Next Question' : 'Finish Interview'}
                                            <ArrowRight className="w-5 h-5 ml-2" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
