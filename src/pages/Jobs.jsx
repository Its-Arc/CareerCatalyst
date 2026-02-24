import React, { useState, useEffect } from 'react';
import { callClaude, parseJSONResponse } from '../utils/callClaude';
import { Loader2, Briefcase, ExternalLink, MapPin, Building, Search, Flame } from 'lucide-react';

export default function Jobs() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        const resumeStr = localStorage.getItem('vidyamitra_resume');
        const careerStr = localStorage.getItem('vidyamitra_career');

        if (!resumeStr || !careerStr) {
            setError("Please complete Resume Analysis and Domain Selection first.");
            return;
        }

        setLoading(true);
        setError(null);

        const prompt = `Based on this resume analysis and target career domain, suggest 6 real-world job roles the user should apply for right now. 
Resume Stats: ${resumeStr}
Target Plan: ${careerStr}

Return a JSON object:
{
  "jobs": [
    {
      "title": "<Job Title>",
      "company": "<Example Company Type or Name like 'Mid-size Fintech' or 'Google'>",
      "matchScore": <0-100>,
      "requiredSkills": ["<skill>", ...],
      "applyLink": "https://www.linkedin.com/jobs/search/?keywords=<URL encoded exact title>"
    }
  ]
}
Return ONLY the JSON.`;

        try {
            const resp = await callClaude(prompt, "Find suitable job matches.");
            const parsed = parseJSONResponse(resp);
            setJobs(parsed.jobs || []);
        } catch (err) {
            setError(err.message || "Failed to fetch job recommendations.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                <div className="relative mb-6">
                    <Search className="w-16 h-16 text-primary animate-pulse" />
                    <Loader2 className="w-6 h-6 absolute bottom-0 right-0 animate-spin text-accent" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Scouring the Market...</h2>
                <p className="text-gray-600">Matching your skill profile against top industry roles.</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto py-8">
            <div className="flex justify-between items-end mb-8 border-b pb-6">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
                        <Briefcase className="w-8 h-8 text-primary mr-3" /> Job Recommendations
                    </h2>
                    <p className="text-gray-600">AI-curated roles that perfectly align with your resume strengths and career goals.</p>
                </div>

                {error ? (
                    <div className="text-red-600 text-sm font-medium bg-red-50 px-4 py-2 rounded-lg">{error}</div>
                ) : (
                    <button onClick={fetchJobs} className="flex items-center text-sm font-medium text-primary hover:text-indigo-800 bg-indigo-50 px-4 py-2 rounded-lg transition-colors">
                        <Search className="w-4 h-4 mr-2" /> Find New Matches
                    </button>
                )}
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map((job, idx) => (
                    <div key={idx} className="bg-white rounded-xl shadow-sm hover:shadow-xl border border-gray-200 transition-all duration-300 flex flex-col hover:-translate-y-1">
                        <div className="p-6 flex-1 flex flex-col">
                            <div className="flex justify-between items-start mb-4">
                                <div className="bg-indigo-50 p-3 rounded-lg text-primary">
                                    <Briefcase className="w-6 h-6" />
                                </div>
                                {job.matchScore >= 85 && (
                                    <span className="flex items-center text-xs font-bold bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                                        <Flame className="w-3 h-3 mr-1" /> Top Match
                                    </span>
                                )}
                            </div>

                            <h3 className="font-bold text-xl text-gray-900 mb-1 leading-tight">{job.title}</h3>
                            <p className="text-sm text-gray-500 font-medium flex items-center mb-6">
                                <Building className="w-4 h-4 mr-1.5 opacity-70" /> {job.company}
                            </p>

                            <div className="mb-6 flex-1">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Core Skills</h4>
                                <div className="flex flex-wrap gap-2">
                                    {job.requiredSkills.map((skill, sIdx) => (
                                        <span key={sIdx} className="bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-md font-medium border border-gray-200">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-100 flex items-center mb-1">
                                <div className="flex-1">
                                    <span className="block text-xs font-semibold text-gray-500 mb-1">Match Score</span>
                                    <div className="flex items-center">
                                        <div className="w-full bg-gray-200 rounded-full h-1.5 mr-3">
                                            <div
                                                className={`h-1.5 rounded-full ${job.matchScore >= 85 ? 'bg-green-500' : job.matchScore >= 60 ? 'bg-yellow-400' : 'bg-red-400'}`}
                                                style={{ width: `${job.matchScore}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-sm font-bold text-gray-900">{job.matchScore}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <a
                            href={job.applyLink}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-auto bg-gray-50 hover:bg-primary hover:text-white text-primary font-bold py-4 text-center border-t border-gray-200 rounded-b-xl flex justify-center items-center transition-colors"
                        >
                            Apply Now <ExternalLink className="w-4 h-4 ml-2" />
                        </a>
                    </div>
                ))}
            </div>

            {!loading && jobs.length === 0 && !error && (
                <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <p className="text-gray-500">No jobs found. Update your domain or resume to see new matches.</p>
                </div>
            )}
        </div>
    );
}
