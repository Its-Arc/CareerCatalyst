import React, { useState, useEffect } from 'react';
import { BarChart, Award, CheckCircle, Target, TrendingUp, Presentation } from 'lucide-react';

export default function Progress() {
    const [quizzes, setQuizzes] = useState([]);
    const [interviews, setInterviews] = useState([]);
    const [plan, setPlan] = useState(null);
    const [planProgress, setPlanProgress] = useState({});

    useEffect(() => {
        // Load local storage histories
        const savedQuizzes = JSON.parse(localStorage.getItem('careercatalyst_quiz_history') || '[]');
        setQuizzes(savedQuizzes);

        const savedInterviews = JSON.parse(localStorage.getItem('careercatalyst_interview_history') || '[]');
        setInterviews(savedInterviews);

        const savedPlan = localStorage.getItem('careercatalyst_plan');
        if (savedPlan) {
            try {
                setPlan(JSON.parse(savedPlan));
            } catch (e) { }
        }

        const savedProgress = JSON.parse(localStorage.getItem('careercatalyst_plan_progress') || '{}');
        setPlanProgress(savedProgress);
    }, []);

    const toggleWeek = (weekNum) => {
        const nextProg = { ...planProgress, [weekNum]: !planProgress[weekNum] };
        setPlanProgress(nextProg);
        localStorage.setItem('careercatalyst_plan_progress', JSON.stringify(nextProg));
    };

    // Calculate stats for chart
    const averageQuizScore = quizzes.length > 0
        ? Math.round(quizzes.reduce((acc, q) => acc + (q.score / q.total), 0) / quizzes.length * 100)
        : 0;

    // Bar chart simple simulation - get last 7 quiz percentages
    const chartData = quizzes.slice(-7).map(q => Math.round((q.score / q.total) * 100));

    return (
        <div className="max-w-6xl mx-auto py-8">
            <div className="mb-10 border-b pb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
                    <BarChart className="w-8 h-8 text-primary mr-3" /> Dashboard
                </h2>
                <p className="text-gray-600">Track your learning velocity, completed modules, and quiz scores over time.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">

                {/* Left Column: Stats & Plan */}
                <div className="lg:col-span-1 space-y-8">

                    {/* Quick Stat */}
                    <div className="bg-gradient-to-br from-indigo-500 to-primary text-white p-6 rounded-xl shadow-md">
                        <h3 className="font-medium text-indigo-100 mb-1 flex items-center"><TrendingUp className="w-4 h-4 mr-2" /> Overall Quiz Avg</h3>
                        <div className="text-5xl font-black mb-2">{averageQuizScore}%</div>
                        <p className="text-sm text-indigo-200">Based on {quizzes.length} assessments taken.</p>
                    </div>

                    {/* Plan Checklist */}
                    {plan ? (
                        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                            <h3 className="font-bold text-gray-900 mb-4 pb-3 border-b border-gray-100 flex items-center">
                                <Target className="w-5 h-5 text-accent mr-2" /> 12-Week Roadmap Status
                            </h3>
                            <div className="h-72 overflow-y-auto pr-2 custom-scrollbar space-y-2">
                                {plan.weeklyPlan?.map((week) => {
                                    const isDone = !!planProgress[week.week];
                                    return (
                                        <label key={week.week} className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${isDone ? 'bg-green-50 border-green-200' : 'bg-white border-gray-100 hover:bg-gray-50'
                                            }`}>
                                            <input
                                                type="checkbox"
                                                checked={isDone}
                                                onChange={() => toggleWeek(week.week)}
                                                className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary flex-shrink-0"
                                            />
                                            <div className="ml-3 flex-1 overflow-hidden">
                                                <span className={`block text-xs font-bold uppercase ${isDone ? 'text-green-600' : 'text-gray-500'}`}>Week {week.week}</span>
                                                <span className={`block text-sm font-medium pt-0.5 truncate ${isDone ? 'text-gray-600 line-through' : 'text-gray-900'}`}>{week.focus}</span>
                                            </div>
                                        </label>
                                    )
                                })}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-6 text-center text-sm text-gray-500">
                            No learning plan generated yet.
                        </div>
                    )}
                </div>

                {/* Right Column: Tables and Charts */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Chart */}
                    {chartData.length > 0 && (
                        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                            <h3 className="font-bold text-gray-900 mb-6 flex items-center">
                                <BarChart className="w-5 h-5 text-primary mr-2" /> Recent Quiz Performance
                            </h3>

                            <div className="flex items-end h-48 gap-4 px-2">
                                {chartData.map((val, idx) => (
                                    <div key={idx} className="flex-1 flex flex-col items-center justify-end relative group">
                                        {/* Tooltip */}
                                        <div className="absolute -top-10 bg-gray-900 text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                            {val}%
                                        </div>
                                        <div
                                            className="w-full max-w-[40px] bg-indigo-200 hover:bg-primary transition-colors rounded-t-sm"
                                            style={{ height: `${val}%` }}
                                        ></div>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between text-xs font-medium text-gray-400">
                                <span>Older Quizzes</span>
                                <span>Recent Quizzes</span>
                            </div>
                        </div>
                    )}

                    {/* History Tables */}
                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                        <h3 className="font-bold text-gray-900 mb-4 pb-3 border-b flex items-center">
                            <Award className="w-5 h-5 text-yellow-500 mr-2" /> Quiz History
                        </h3>

                        {quizzes.length === 0 ? (
                            <p className="text-sm text-gray-500 py-4 text-center border-2 border-dashed rounded-lg">No quizzes taken yet.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-bold border-b">
                                        <tr>
                                            <th className="px-4 py-3">Date</th>
                                            <th className="px-4 py-3">Domain</th>
                                            <th className="px-4 py-3 text-center">Score</th>
                                            <th className="px-4 py-3 text-right">Badge</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
                                        {quizzes.slice(-5).reverse().map((q, i) => (
                                            <tr key={i} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 whitespace-nowrap text-gray-500">{new Date(q.date).toLocaleDateString()}</td>
                                                <td className="px-4 py-3">{q.domain}</td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className="bg-indigo-50 text-primary px-2 py-1 rounded-full font-bold">{q.score}/{q.total}</span>
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    {q.badge === 'Beginner' && <span className="text-gray-500 border border-gray-200 px-2 py-1 rounded-md text-xs">Beginner</span>}
                                                    {q.badge === 'Intermediate' && <span className="text-primary border border-indigo-200 px-2 py-1 rounded-md text-xs">Intermediate</span>}
                                                    {q.badge === 'Expert' && <span className="text-orange-600 border border-orange-200 bg-orange-50 px-2 py-1 rounded-md text-xs">Expert</span>}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                        <h3 className="font-bold text-gray-900 mb-4 pb-3 border-b flex items-center">
                            <Presentation className="w-5 h-5 text-accent mr-2" /> Interview History
                        </h3>

                        {interviews.length === 0 ? (
                            <p className="text-sm text-gray-500 py-4 text-center border-2 border-dashed rounded-lg">No mock interviews completed.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-bold border-b">
                                        <tr>
                                            <th className="px-4 py-3">Date</th>
                                            <th className="px-4 py-3">Role</th>
                                            <th className="px-4 py-3 text-center">Avg Score</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
                                        {interviews.slice(-5).reverse().map((int, i) => (
                                            <tr key={i} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 whitespace-nowrap text-gray-500">{new Date(int.date).toLocaleDateString()}</td>
                                                <td className="px-4 py-3 font-semibold text-gray-900">{int.role}</td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className="font-bold text-lg text-primary">{int.averageScore.toFixed(1)}</span> / 10
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
