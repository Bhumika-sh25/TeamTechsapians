import { create } from 'zustand'

export interface LogEntry {
    timestamp: string;
    source: string;
    message: string;
    type: 'info' | 'error' | 'success';
}

export interface FixEntry {
    id: string;
    file: string;
    type: string;
    line: number;
    message: string;
    status: 'pending' | 'applied' | 'failed';
}

interface AppState {
    teamName: string;
    leaderName: string;
    repoUrl: string;
    isRunning: boolean;
    score: number;
    commits: number;
    startTime: number | null;
    logs: LogEntry[];
    fixes: FixEntry[];
    status: 'idle' | 'running' | 'completed' | 'failed';
    currentIteration: number;
    maxIterations: number;
    setTeamName: (name: string) => void;
    setLeaderName: (name: string) => void;
    setRepoUrl: (url: string) => void;
    startRun: () => void;
    addLog: (log: LogEntry) => void;
    setLogs: (logs: LogEntry[]) => void;
    updateStatus: (status: AppState['status']) => void;
    incrementIteration: () => void;

    branchName: string;
    totalTime: string;
    iterations: string[];
    commitCount: number;
    setBranchName: (name: string) => void;
    setTotalTime: (time: string) => void;
    setIterations: (iters: string[]) => void;
    setCommitCount: (count: number) => void;

    // Standardized Results Fields
    runSummary: {
        repository_url: string;
        team_name: string;
        leader_name: string;
        branch_created: string;
        final_status: string;
        total_time_seconds: number;
    } | null;
    scoreBreakdown: {
        base_score: number;
        speed_bonus: number;
        efficiency_penalty: number;
        final_total_score: number;
    } | null;
    fixesApplied: any[]; // Using any[] for simplicity or define FixEntry[] closer
    ciCdTimeline: any[];
    setRunData: (data: any) => void;
}

export const useStore = create<AppState>((set) => ({
    teamName: '',
    leaderName: '',
    repoUrl: '',
    isRunning: false,
    score: 100,
    commits: 0,
    startTime: null,
    logs: [],
    fixes: [],
    status: 'idle',
    currentIteration: 0,
    maxIterations: 0, // Initialize maxIterations

    // New fields initial state
    branchName: '',
    totalTime: '',
    iterations: [],
    commitCount: 0,

    // Standardized Fields Initial State
    runSummary: null,
    scoreBreakdown: null,
    fixesApplied: [],
    ciCdTimeline: [],

    setTeamName: (name) => set({ teamName: name }),
    setLeaderName: (name) => set({ leaderName: name }),
    setRepoUrl: (url) => set({ repoUrl: url }),

    startRun: () => set({
        isRunning: true,
        startTime: Date.now(),
        status: 'running',
        logs: [],
        // Reset standardized fields
        runSummary: {
            repository_url: '',
            team_name: '',
            leader_name: '',
            branch_created: '',
            final_status: 'RUNNING',
            total_time_seconds: 0
        },
        scoreBreakdown: {
            base_score: 100,
            speed_bonus: 0,
            efficiency_penalty: 0,
            final_total_score: 100
        },
        fixesApplied: [],
        ciCdTimeline: []
    }),

    addLog: (log) => set((state) => ({ logs: [...state.logs, log] })),
    setLogs: (logs) => set({ logs }),
    setFixes: (fixes) => set({ fixes }), // Legacy
    updateStatus: (status) => set({ status, isRunning: status === 'running' }),
    incrementIteration: () => set((state) => ({ currentIteration: state.currentIteration + 1 })),

    // Actions for new fields
    setBranchName: (name) => set({ branchName: name }),
    setTotalTime: (time) => set({ totalTime: time }),
    setIterations: (iters) => set({ iterations: iters }),
    setCommitCount: (count) => set({ commitCount: count }),

    setRunData: (data: any) => set((state) => {
        // Map backend standardized data to store
        // We can just merge the whole object if structure matches, or map fields
        // Backend returns: runs[id] object which matches our schema
        return {
            runSummary: data.run_summary,
            scoreBreakdown: data.score_breakdown,
            fixesApplied: data.fixes_applied,
            ciCdTimeline: data.ci_cd_timeline,
            logs: data.logs || state.logs // Keep or update logs
        };
    })
}));
