import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';

import Home from './pages/Home';
import Resume from './pages/Resume';
import Domain from './pages/Domain';
import Plan from './pages/Plan';
import Quiz from './pages/Quiz';
import Interview from './pages/Interview';
import Progress from './pages/Progress';
import Jobs from './pages/Jobs';
import Settings from './pages/Settings';

function App() {
    return (
        <Router>
            <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-sans">
                <Navbar />
                <main className="flex-1 w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/resume" element={<Resume />} />
                        <Route path="/domain" element={<Domain />} />
                        <Route path="/plan" element={<Plan />} />
                        <Route path="/quiz" element={<Quiz />} />
                        <Route path="/interview" element={<Interview />} />
                        <Route path="/progress" element={<Progress />} />
                        <Route path="/jobs" element={<Jobs />} />
                        <Route path="/settings" element={<Settings />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
