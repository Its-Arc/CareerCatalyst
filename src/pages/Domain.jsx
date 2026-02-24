import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, ArrowRight, Target, CheckCircle2 } from 'lucide-react';

const domains = ['Software Engineering', 'Data Science', 'Product Management', 'Marketing', 'Finance', 'Design', 'Other'];

const jobRolesByDomain = {
    'Software Engineering': ['Frontend Developer', 'Backend Developer', 'Full Stack Engineer', 'DevOps Engineer', 'Mobile Developer', 'QA Automation'],
    'Data Science': ['Data Analyst', 'Data Scientist', 'Machine Learning Engineer', 'Data Engineer', 'BI Analyst', 'AI Researcher'],
    'Product Management': ['Product Manager', 'Associate Product Manager', 'Product Owner', 'Technical PM', 'Growth PM'],
    'Marketing': ['Digital Marketer', 'SEO Specialist', 'Content Strategist', 'Social Media Manager', 'Performance Marketer'],
    'Finance': ['Financial Analyst', 'Investment Banker', 'Corporate Finance', 'Fintech Specialist', 'Accountant'],
    'Design': ['UX Designer', 'UI Designer', 'Product Designer', 'Graphic Designer', 'Web Designer'],
    'Other': []
};

export default function Domain() {
    const navigate = useNavigate();
    const [domain, setDomain] = useState('');
    const [jobRole, setJobRole] = useState('');
    const [customRole, setCustomRole] = useState('');

    useEffect(() => {
        const saved = localStorage.getItem('vidyamitra_career');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed.domain) setDomain(parsed.domain);
                if (parsed.jobRole) {
                    if (jobRolesByDomain[parsed.domain]?.includes(parsed.jobRole)) {
                        setJobRole(parsed.jobRole);
                    } else {
                        setJobRole('Custom');
                        setCustomRole(parsed.jobRole);
                    }
                }
            } catch (e) { }
        }
    }, []);

    const handleNext = () => {
        const finalRole = jobRole === 'Custom' ? customRole : jobRole;
        if (!domain || !finalRole) return;

        localStorage.setItem('vidyamitra_career', JSON.stringify({
            domain,
            jobRole: finalRole
        }));
        navigate('/plan');
    };

    return (
        <div className="max-w-4xl mx-auto py-8">
            <div className="mb-10 text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Select Your Path</h2>
                <p className="text-gray-600">Choose your target domain and specific job role to get a tailored learning plan.</p>
            </div>

            <div className="space-y-10">

                {/* Step 1: Domain Selection */}
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                    <div className="flex items-center mb-6 border-b pb-4">
                        <span className="bg-indigo-100 text-primary w-8 h-8 rounded-full flex justify-center items-center font-bold mr-3">1</span>
                        <h3 className="text-xl font-bold text-gray-900">Choose A Domain</h3>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {domains.map(d => (
                            <button
                                key={d}
                                onClick={() => { setDomain(d); setJobRole(''); setCustomRole(''); }}
                                className={`py-4 px-2 text-center rounded-lg border-2 transition-all flex flex-col items-center justify-center h-24 ${domain === d
                                        ? 'border-primary bg-indigo-50 text-primary font-bold shadow-sm'
                                        : 'border-gray-200 text-gray-600 hover:border-indigo-300 hover:bg-gray-50'
                                    }`}
                            >
                                {domain === d && <CheckCircle2 className="w-5 h-5 mb-1 text-primary" />}
                                <span className="text-sm">{d}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Step 2: Job Role Selection */}
                {domain && (
                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 animate-in fade-in slide-in-from-bottom-5">
                        <div className="flex items-center mb-6 border-b pb-4">
                            <span className="bg-teal-100 text-teal-800 w-8 h-8 rounded-full flex justify-center items-center font-bold mr-3">2</span>
                            <h3 className="text-xl font-bold text-gray-900">Select Specific Role</h3>
                        </div>

                        <div className="flex flex-wrap gap-3 mb-6">
                            {jobRolesByDomain[domain]?.map(role => (
                                <button
                                    key={role}
                                    onClick={() => setJobRole(role)}
                                    className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${jobRole === role
                                            ? 'bg-accent text-white border-transparent shadow-sm'
                                            : 'bg-white text-gray-700 border-gray-300 hover:border-accent hover:text-accent'
                                        }`}
                                >
                                    {role}
                                </button>
                            ))}
                            <button
                                onClick={() => setJobRole('Custom')}
                                className={`px-4 py-2 rounded-full border border-dashed text-sm font-medium transition-colors ${jobRole === 'Custom'
                                        ? 'bg-gray-800 text-white border-transparent shadow-sm'
                                        : 'bg-white text-gray-700 border-gray-400 hover:border-gray-800 hover:text-gray-900'
                                    }`}
                            >
                                Other Custom Role
                            </button>
                        </div>

                        {jobRole === 'Custom' && (
                            <div className="mb-6 slide-in-from-top-2 animate-in fade-in">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Type your exact role title</label>
                                <div className="relative">
                                    <Briefcase className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        value={customRole}
                                        onChange={(e) => setCustomRole(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                                        placeholder="e.g. Prompt Engineer, Cloud Architect..."
                                    />
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end pt-4 border-t">
                            <button
                                onClick={handleNext}
                                disabled={!jobRole || (jobRole === 'Custom' && !customRole.trim())}
                                className="bg-primary hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-lg shadow-md transition-colors flex items-center"
                            >
                                Generate Learning Plan <Target className="w-5 h-5 ml-2" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
