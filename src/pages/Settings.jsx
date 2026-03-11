import React, { useState, useEffect } from 'react';
import { Save, Eye, EyeOff, KeyRound } from 'lucide-react';

export default function Settings() {
    const [apiKey, setApiKey] = useState('');
    const [showKey, setShowKey] = useState(false);
    const [toast, setToast] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('careercatalyst_api_key');
        if (saved) setApiKey(saved);
    }, []);

    const handleSave = () => {
        localStorage.setItem('careercatalyst_api_key', apiKey.trim());
        setToast(true);
        setTimeout(() => setToast(false), 3000);
    };

    return (
        <div className="max-w-2xl mx-auto py-8">
            <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
                <div className="flex items-center mb-6 text-primary">
                    <KeyRound className="w-6 h-6 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900">API Settings</h2>
                </div>

                <p className="text-gray-600 mb-6">
                    careercatalyst runs securely in your browser and requires an Anthropic API Key to power its AI features.
                    Your key is saved locally in your browser and is never stored on our servers.
                </p>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Anthropic API Key
                    </label>
                    <div className="relative">
                        <input
                            type={showKey ? 'text' : 'password'}
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="sk-ant-..."
                            className="w-full pr-12 pl-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                        />
                        <button
                            onClick={() => setShowKey(!showKey)}
                            className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                        >
                            {showKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        Get your key from <a href="https://console.anthropic.com/" target="_blank" rel="noreferrer" className="text-primary hover:underline">console.anthropic.com</a>
                    </p>
                </div>

                <div className="flex items-center">
                    <button
                        onClick={handleSave}
                        className="flex items-center bg-primary hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        Save Key
                    </button>

                    {toast && (
                        <span className="ml-4 text-sm text-green-600 font-medium flex items-center bg-green-50 px-3 py-1 rounded-full animate-pulse">
                            ✓ Saved successfully
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
