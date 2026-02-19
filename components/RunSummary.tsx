import { GitBranch, Activity } from 'lucide-react';
import { useStore } from '../store/useStore';

export const RunSummary = () => {
    const { repoUrl, status, runSummary } = useStore();

    // Use branchName from store (backend generated) if available, else derive it or show placeholder
    const displayedBranchName = runSummary?.branch_created || 'Waiting...';
    const displayedRepo = runSummary?.repository_url || repoUrl || 'N/A';

    return (
        <div className="bg-card p-6 rounded-lg shadow-md border border-border mt-6">
            <h2 className="text-xl font-bold mb-4 text-primary flex items-center">
                <Activity className="mr-2" /> Mission Status
            </h2>
            <div className="space-y-3">
                <div className="flex justify-between items-center bg-background/50 p-3 rounded">
                    <span className="text-muted-foreground text-sm">Target Repo</span>
                    <span className="font-mono text-sm text-foreground truncate max-w-[200px]">{displayedRepo}</span>
                </div>
                <div className="flex justify-between items-center bg-background/50 p-3 rounded">
                    <span className="text-muted-foreground text-sm">Active Branch</span>
                    <span className="font-mono text-sm text-sky-400">{displayedBranchName}</span>
                </div>
                <div className="flex justify-between items-center bg-background/50 p-3 rounded">
                    <span className="text-muted-foreground text-sm">CI/CD Status</span>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${status === 'completed' ? 'bg-green-500/20 text-green-500' :
                        status === 'failed' ? 'bg-red-500/20 text-red-500' :
                            status === 'running' ? 'bg-yellow-500/20 text-yellow-500' :
                                'bg-gray-500/20 text-gray-500'
                        }`}>
                        {status === 'completed' ? 'PASSED' : (status?.toUpperCase() || 'IDLE')}
                    </span>
                </div>
            </div>
        </div>
    );
};
