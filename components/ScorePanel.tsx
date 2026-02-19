import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Trophy, Clock } from 'lucide-react';

export const ScorePanel = () => {
    const { scoreBreakdown, isRunning, startTime } = useStore();
    const [elapsedTime, setElapsedTime] = useState(0);

    useEffect(() => {
        let interval: any;
        if (isRunning && startTime) {
            interval = setInterval(() => {
                setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRunning, startTime]);

    // Backend should ideally calculate score, but prompt implies frontend calculation for display
    // Base 100, +10 if < 5 mins (300s), -2 per commit > 20
    // We'll approximate for now or use the store's score if updated by backend
    // Use backend score if available, otherwise calculate locally for 'live' feel or show 100
    const finalScore = scoreBreakdown?.final_total_score ?? 100;
    const baseScore = scoreBreakdown?.base_score ?? 100;
    const speedBonus = scoreBreakdown?.speed_bonus ?? 0;
    const penalty = scoreBreakdown?.efficiency_penalty ?? 0;

    // For live tracking before backend returns final score, we can approximate
    // But honestly, sticking to backend's data is safest if it updates progressively.
    // If not, we show 100 until done.

    const displayScore = finalScore;

    return (
        <div className="bg-card p-6 rounded-lg shadow-md border border-border mt-6">
            <h2 className="text-xl font-bold mb-4 text-primary flex items-center">
                <Trophy className="mr-2 text-yellow-500" /> Performance Score
            </h2>

            <div className="flex items-center justify-between mb-2">
                <span className="text-4xl font-bold text-foreground">{displayScore}</span>
                <span className="text-sm text-muted-foreground">/ 110 Possible</span>
            </div>

            <div className="w-full bg-secondary rounded-full h-4 mb-6">
                <div
                    className="bg-yellow-500 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${(displayScore / 110) * 100}%` }}
                ></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Clock size={16} />
                    <span>Duration: {Math.floor(elapsedTime / 60)}m {elapsedTime % 60}s</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Trophy size={16} className="text-blue-400" />
                    <span>Bonus: +{speedBonus} | Pen: -{penalty}</span>
                </div>
            </div>
        </div>
    );
};
