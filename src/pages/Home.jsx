import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, MessagesSquare, Map } from 'lucide-react';

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center max-w-4xl mx-auto">
            <h1 className="text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
                CareerCatalyst &ndash; Your AI Career Mentor
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl">
                Level up your career with AI-driven resume analysis, personalized learning plans, and intelligent mock interviews.
            </p>

            <Link
                to="/resume"
                className="bg-primary hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105 mb-16 text-lg"
            >
                Start Your Career Journey
            </Link>

            <div className="grid md:grid-cols-3 gap-8 w-full mt-4">
                {/* Feature 1 */}
                <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                    <div className="bg-indigo-100 w-14 h-14 rounded-full flex items-center justify-center mb-6 mx-auto text-primary">
                        <FileText className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-gray-900">Resume Analysis</h3>
                    <p className="text-gray-600 text-sm">
                        Get instant feedback on your resume, uncover skill gaps, and receive a tailored ATS score.
                    </p>
                </div>

                {/* Feature 2 */}
                <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                    <div className="bg-teal-100 w-14 h-14 rounded-full flex items-center justify-center mb-6 mx-auto text-accent">
                        <Map className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-gray-900">Learning Plan</h3>
                    <p className="text-gray-600 text-sm">
                        Generate a personalized 12-week roadmap based on your selected domain and career goals.
                    </p>
                </div>

                {/* Feature 3 */}
                <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                    <div className="bg-indigo-100 w-14 h-14 rounded-full flex items-center justify-center mb-6 mx-auto text-primary">
                        <MessagesSquare className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-gray-900">Mock Interview</h3>
                    <p className="text-gray-600 text-sm">
                        Practice with an AI interviewer and receive actionable feedback to ace your next round.
                    </p>
                </div>
            </div>
        </div>
    );
}
