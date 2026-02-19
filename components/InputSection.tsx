import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Play, Loader2 } from 'lucide-react';

export const InputSection = () => {
    const {
        repoUrl, teamName, leaderName, isRunning,
        setRepoUrl, setTeamName, setLeaderName, startRun,
        updateStatus, addLog
    } = useStore();

    const handleRun = async () => {
        if (!repoUrl || !teamName || !leaderName) return;

        startRun();

        // Use environment variable for API URL, fallback to localhost
        const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

        try {
            const response = await fetch(`${API_URL}/trigger-agent`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    github_url: repoUrl,
                    team_name: teamName,
                    leader_name: leaderName
                })
            });

            if (!response.ok) throw new Error('Failed to start run');

            const data = await response.json();

            // Poll for status
            const interval = setInterval(async () => {
                try {
                    const statusRes = await fetch(`${API_URL}/status/${data.run_id}`);
                    const statusData = await statusRes.json();

                    // Use new unified setter
                    useStore.getState().setRunData(statusData);

                    // Check status from standardized field
                    const finalStatus = statusData.run_summary?.final_status;

                    if (finalStatus === 'PASSED') {
                        updateStatus('completed');
                        clearInterval(interval);
                    } else if (finalStatus === 'FAILED') {
                        updateStatus('failed');
                        clearInterval(interval);
                    }
                } catch (e) {
                    console.error("Polling error", e);
                }
            }, 2000);

        } catch (error) {
            console.error('Error starting run:', error);
            updateStatus('idle'); // Reset on error
        }
    };

    return (
        <div className="bg-card p-6 rounded-lg shadow-md border border-border">
            <h2 className="text-xl font-bold mb-4 text-primary">Mission Configuration</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1 text-muted-foreground">GitHub Repository URL</label>
                    <input
                        type="text"
                        value={repoUrl}
                        onChange={(e) => setRepoUrl(e.target.value)}
                        className="w-full bg-input text-foreground border rounded p-2 focus:ring-2 focus:ring-primary outline-none"
                        placeholder="https://github.com/..."
                        disabled={isRunning}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1 text-muted-foreground">Team Name</label>
                    <input
                        type="text"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        className="w-full bg-input text-foreground border rounded p-2 focus:ring-2 focus:ring-primary outline-none"
                        placeholder="e.g. Kepler Force"
                        disabled={isRunning}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1 text-muted-foreground">Team Leader</label>
                    <input
                        type="text"
                        value={leaderName}
                        onChange={(e) => setLeaderName(e.target.value)}
                        className="w-full bg-input text-foreground border rounded p-2 focus:ring-2 focus:ring-primary outline-none"
                        placeholder="e.g. Sarah Connor"
                        disabled={isRunning}
                    />
                </div>
            </div>
            <div className="mt-4 flex justify-end">
                <button
                    onClick={handleRun}
                    disabled={isRunning || !repoUrl || !teamName || !leaderName}
                    className={`relative overflow-hidden flex items-center justify-center px-8 py-3 rounded-lg font-bold transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${isRunning
                        ? 'bg-secondary text-secondary-foreground cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg hover:shadow-cyan-500/25'
                        }`}
                >
                    {isRunning && (
                        <div className="absolute inset-0 bg-white/10 animate-pulse-fast"></div>
                    )}
                    <span className="relative flex items-center z-10">
                        {isRunning ? (
                            <>
                                <Loader2 className="animate-spin mr-2 h-5 w-5" />
                                <span className="tracking-wide">INITIALIZING PROTOCOLS...</span>
                            </>
                        ) : (
                            <>
                                <Play className="mr-2 h-5 w-5 fill-current" />
                                <span className="tracking-wide">INITIATE DEVOPS AGENT</span>
                            </>
                        )}
                    </span>
                </button>
            </div>
        </div>
    );
};
