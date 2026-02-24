import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Settings, User, BookOpen, Navigation, CheckCircle, BarChart2, Briefcase, Award } from 'lucide-react';

export default function Navbar() {
    const location = useLocation();

    const links = [
        { name: 'Home', path: '/', icon: <BookOpen className="w-4 h-4 mr-1" /> },
        { name: 'Resume', path: '/resume', icon: <User className="w-4 h-4 mr-1" /> },
        { name: 'Domain', path: '/domain', icon: <Navigation className="w-4 h-4 mr-1" /> },
        { name: 'Plan', path: '/plan', icon: <CheckCircle className="w-4 h-4 mr-1" /> },
        { name: 'Quiz', path: '/quiz', icon: <Award className="w-4 h-4 mr-1" /> },
        { name: 'Interview', path: '/interview', icon: <BookOpen className="w-4 h-4 mr-1" /> },
        { name: 'Jobs', path: '/jobs', icon: <Briefcase className="w-4 h-4 mr-1" /> },
        { name: 'Progress', path: '/progress', icon: <BarChart2 className="w-4 h-4 mr-1" /> },
    ];

    return (
        <nav className="bg-primary text-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="flex items-center text-xl font-bold tracking-tight">
                        <span className="text-accent mr-1">vidya</span>mitra
                    </Link>

                    <div className="hidden md:flex space-x-1 overflow-x-auto">
                        {links.map((link) => {
                            const isActive = location.pathname === link.path;
                            return (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-indigo-700 text-white' : 'text-indigo-100 hover:bg-indigo-600 hover:text-white'
                                        }`}
                                >
                                    {link.icon}
                                    {link.name}
                                </Link>
                            );
                        })}
                    </div>

                    <div className="flex items-center">
                        <Link
                            to="/settings"
                            className={`p-2 rounded-full transition-colors ${location.pathname === '/settings' ? 'bg-indigo-700 text-white' : 'text-indigo-100 hover:bg-indigo-600'
                                }`}
                            title="Settings"
                        >
                            <Settings className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Mobile navigation row (scrollable) */}
            <div className="md:hidden border-t border-indigo-700 bg-indigo-800 overflow-x-auto">
                <div className="flex px-2 py-2 w-max space-x-2">
                    {links.map((link) => {
                        const isActive = location.pathname === link.path;
                        return (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`flex items-center px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${isActive ? 'bg-indigo-600 text-white' : 'text-indigo-100'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}
