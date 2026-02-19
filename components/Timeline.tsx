import React from 'react';
import { useStore } from '../store/useStore';
import { Terminal } from 'lucide-react';

export const Timeline = () => {
    const { logs, ciCdTimeline } = useStore();
    const scrollRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    // Derive current iteration string from timeline
    const iterationDisplay = ciCdTimeline.length > 0 ? ciCdTimeline[ciCdTimeline.length - 1].iteration : "0/5";

    return (
        <div className="bg-card p-6 rounded-lg shadow-md border border-border mt-6 h-[500px] flex flex-col">
            <h2 className="text-xl font-bold mb-4 text-primary flex items-center justify-between">
                <div className="flex items-center">
                    <Terminal className="mr-2" /> Live Agent Feed
                </div>
                <span className="text-xs font-mono bg-secondary px-2 py-1 rounded">
                    Iteration {iterationDisplay}
                </span>
            </h2>
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto bg-black/50 p-4 rounded-md font-mono text-sm space-y-2"
            >
                {logs.length === 0 ? (
                    <span className="text-muted-foreground opacity-50">Waiting for logs...</span>
                ) : (
                    logs.map((log, idx) => (
                        <div key={idx} className="border-l-2 border-primary pl-3 py-1 animate-in fade-in slide-in-from-left-2 duration-300">
                            <span className="text-xs text-muted-foreground block mb-0.5">
                                {typeof log === 'string' ? "LOG" : log.timestamp}
                            </span>
                            <p className="text-foreground whitespace-pre-wrap break-words">
                                {typeof log === 'string' ? log : log.message}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
