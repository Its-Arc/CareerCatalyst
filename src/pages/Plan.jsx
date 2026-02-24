import React, { useState, useEffect } from 'react';
import { callClaude, parseJSONResponse } from '../utils/callClaude';
import { Loader2, AlertCircle, ChevronDown, ChevronUp, Map, Award, Clock, CheckCircle2, BookOpen } from 'lucide-react';

export default function Plan() {
    const [plan, setPlan] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [expandedWeek, setExpandedWeek] = useState(1);

    useEffect(() => {
        const saved = localStorage.getItem('vidyamitra_plan');
        if (saved) {
            try {
                setPlan(JSON.parse(saved));
            } catch (e) { }
        } else {
            generatePlan();
        }
    }, []);

    const generatePlan = async () => {
        const resumeStr = localStorage.getItem('vidyamitra_resume');
        const careerStr = localStorage.getItem('vidyamitra_career');

        if (!resumeStr || !careerStr) {
            setError("Please complete Resume Analysis and Domain Selection first.");
            return;
        }

        setLoading(true);
        setError(null);

        const prompt = `You are an expert career coach. Given the user's resume analysis and target career, generate a structured 12-week learning plan.
User Resume Stats: ${resumeStr}
Target Career: ${careerStr}

Return a JSON object:
{
  "weeklyPlan": [
    { "week": 1, "focus": "<topic>", "tasks": ["<task1>", "<task2>"], "resources": ["<resource1>"] },
    ... (up to week 12)
  ],
  "keyMilestones": ["<milestone1>", ...],
  "estimatedTimePerWeek": "<hours>"
}
Return ONLY the JSON.`;

        try {
            const resp = await callClaude(prompt, "Please generate my personalized 12-week plan.");
            const parsed = parseJSONResponse(resp);
            setPlan(parsed);
            localStorage.setItem('vidyamitra_plan', JSON.stringify(parsed));
            setExpandedWeek(1);
        } catch (err) {
            setError(err.message || "Failed to generate plan.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh] text-center">
                <Loader2 className="w-16 h-16 animate-spin text-primary mb-6" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Crafting Your Path...</h2>
                <p className="text-gray-600 max-w-md">Our AI is analyzing your resume gaps and tailoring a precise 12-week syllabus for your target role.</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-xl mx-auto py-16 text-center">
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-gray-900 mb-2">Unable to load plan</h2>
                <p className="text-red-700 bg-red-50 p-4 rounded-lg mb-6">{error}</p>
                <button onClick={generatePlan} className="bg-primary hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium inline-flex items-center">
                    Try Again
                </button>
            </div>
        );
    }

    if (!plan) return null;

    return (
        <div className="max-w-5xl mx-auto py-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b">
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-2 flex items-center">
                        <Map className="w-8 h-8 text-primary mr-3" />
                        Your 12-Week Roadmap
                    </h2>
                    <p className="text-gray-600">A personalized step-by-step curriculum to land your dream role.</p>
                </div>
                <div className="mt-4 md:mt-0 flex space-x-4">
                    <div className="bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-lg flex items-center">
                        <Clock className="w-5 h-5 text-indigo-500 mr-2" />
                        <span className="text-sm font-semibold text-indigo-900">{plan.estimatedTimePerWeek} / week</span>
                    </div>
                    <button onClick={generatePlan} className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors">
                        Regenerate
                    </button>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">

                {/* Left Col - Weekly Accordion */}
                <div className="md:col-span-2 space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Weekly Curriculum</h3>
                    {plan.weeklyPlan?.map((week) => {
                        const isExpanded = expandedWeek === week.week;
                        return (
                            <div key={week.week} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden text-left transition-all">
                                <button
                                    onClick={() => setExpandedWeek(isExpanded ? null : week.week)}
                                    className={`w-full px-6 py-4 flex items-center justify-between focus:outline-none transition-colors ${isExpanded ? 'bg-indigo-50' : 'hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="flex items-center">
                                        <span className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mr-4 ${isExpanded ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'
                                            }`}>
                                            {week.week}
                                        </span>
                                        <div className="text-left">
                                            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 block mb-1">Week {week.week}</span>
                                            <h4 className="font-bold text-lg text-gray-900 leading-tight">{week.focus}</h4>
                                        </div>
                                    </div>
                                    {isExpanded ? <ChevronUp className="w-6 h-6 text-gray-500" /> : <ChevronDown className="w-6 h-6 text-gray-300" />}
                                </button>

                                {isExpanded && (
                                    <div className="px-6 py-5 border-t border-gray-100 bg-white">
                                        <div className="mb-6">
                                            <h5 className="font-bold text-gray-900 mb-3 text-sm flex items-center border-b pb-2">
                                                <CheckCircle2 className="w-4 h-4 mr-2 text-accent" /> Action Items
                                            </h5>
                                            <ul className="space-y-3">
                                                {week.tasks?.map((task, i) => (
                                                    <li key={i} className="flex items-start text-sm text-gray-700">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5 mr-3 flex-shrink-0"></span>
                                                        {task}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div>
                                            <h5 className="font-bold text-gray-900 mb-3 text-sm flex items-center border-b pb-2">
                                                <BookOpen className="w-4 h-4 mr-2 text-blue-500" /> Learning Resources
                                            </h5>
                                            <ul className="space-y-2">
                                                {week.resources?.map((res, i) => (
                                                    <li key={i} className="text-sm text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-2 rounded-md">
                                                        • {res}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Right Col - Milestones */}
                <div className="md:col-span-1">
                    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 sticky top-24">
                        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                            <Award className="w-6 h-6 text-yellow-500 mr-2" />
                            Key Milestones
                        </h3>
                        <div className="relative border-l-2 border-indigo-200 ml-3 pl-6 space-y-8">
                            {plan.keyMilestones?.map((milestone, i) => (
                                <div key={i} className="relative">
                                    <span className="absolute -left-[35px] top-1 w-5 h-5 rounded-full bg-primary border-4 border-white shadow-sm ring-1 ring-indigo-200"></span>
                                    <p className="text-sm font-medium text-gray-800 pt-1 leading-relaxed">{milestone}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <button className="w-full bg-primary hover:bg-indigo-700 text-white font-medium py-3 rounded-lg shadow transition-colors">
                                Start Week Tracking
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
