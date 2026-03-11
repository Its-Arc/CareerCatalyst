import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { callClaude, parseJSONResponse } from '../utils/callClaude';

export default function Resume() {
    const navigate = useNavigate();
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);

    useEffect(() => {
        const saved = localStorage.getItem('careercatalyst_resume');
        if (saved) {
            try {
                setResult(JSON.parse(saved));
            } catch (e) {
                // invalid JSON in storage, ignore
            }
        }
    }, []);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // For MVP, if it's a txt file, we can read it easily.
        // PDF/Doc extraction natively in browser is tough, so we fallback to reading as text and hope.
        const reader = new FileReader();
        reader.onload = (event) => {
            setText(event.target.result);
        };
        reader.readAsText(file);
    };

    const handleAnalyze = async () => {
        if (!text.trim()) {
            setError("Please paste your resume text or upload a file first.");
            return;
        }

        setLoading(true);
        setError(null);

        const systemPrompt = `You are an expert career advisor. Analyse the provided resume. Return a JSON object with:
{
  "overallScore": <number 0-100>,
  "strengths": [<string>, ...],
  "skillGaps": [<string>, ...],
  "suggestedCourses": [<string>, ...],
  "summary": "<2-3 sentence overall assessment>"
}
Return ONLY the JSON, no markdown, no extra text.`;

        try {
            const responseText = await callClaude(systemPrompt, `Resume:\n${text}`);
            const parsed = parseJSONResponse(responseText);
            setResult(parsed);
            localStorage.setItem('careercatalyst_resume', JSON.stringify(parsed));
        } catch (err) {
            setError(err.message || "Failed to analyze resume.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-8">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Resume Analysis</h2>
                <p className="text-gray-600">Upload your resume to uncover your strengths, skill gaps, and get personalized recommendations.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Left Col - Input */}
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col h-full">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Upload Resume File</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition relative">
                            <Upload className="w-8 h-8 text-indigo-400 mb-2" />
                            <span className="text-sm text-gray-600 font-medium">Click to upload .txt (or basic .doc/.pdf)</span>
                            <input
                                type="file"
                                accept=".txt,.pdf,.doc,.docx"
                                onChange={handleFileUpload}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                        </div>
                    </div>

                    <div className="mb-4 flex-1 flex flex-col">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Or Paste Resume Text</label>
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="w-full flex-1 min-h-[250px] p-4 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition resize-none text-sm"
                            placeholder="John Doe&#10;Software Engineer&#10;&#10;Experience...&#10;Skills..."
                        ></textarea>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-start text-sm">
                            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <button
                        onClick={handleAnalyze}
                        disabled={loading}
                        className="w-full bg-primary hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Analyzing...</>
                        ) : (
                            <><FileText className="w-5 h-5 mr-2" /> Analyse Resume</>
                        )}
                    </button>
                </div>

                {/* Right Col - Results */}
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Analysis Results</h3>

                    {!result ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 h-64">
                            <FileText className="w-12 h-12 mb-3 opacity-20" />
                            <p>Your analysis results will appear here.</p>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col space-y-6">

                            {/* Score Indicator */}
                            <div className="flex items-center space-x-6">
                                <div className="relative w-24 h-24 flex items-center justify-center bg-indigo-50 rounded-full border-[6px] border-indigo-100">
                                    {/* Fake circular progress with border for MVP */}
                                    <div className="text-3xl font-bold text-primary">{result.overallScore}</div>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">ATS Competitiveness</h4>
                                    <p className="text-sm text-gray-600">Score out of 100</p>
                                </div>
                            </div>

                            {/* Summary Card */}
                            <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-800 italic border-l-4 border-primary">
                                "{result.summary}"
                            </div>

                            {/* Strengths & Gaps */}
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2 text-sm">Strengths</h4>
                                <div className="flex flex-wrap gap-2">
                                    {result.strengths?.map((s, i) => (
                                        <span key={i} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                            {s}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2 text-sm">Skill Gaps to Fill</h4>
                                <div className="flex flex-wrap gap-2">
                                    {result.skillGaps?.map((g, i) => (
                                        <span key={i} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                                            {g}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Courses */}
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2 text-sm">Suggested Courses / Topics</h4>
                                <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                                    {result.suggestedCourses?.map((c, i) => (
                                        <li key={i}>{c}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="pt-4 mt-auto border-t">
                                <button
                                    onClick={() => navigate('/domain')}
                                    className="w-full bg-accent hover:bg-teal-600 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center shadow-md"
                                >
                                    Proceed to Domain Selection <ArrowRight className="w-5 h-5 ml-2" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
