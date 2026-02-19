import { useStore } from '../store/useStore';

export const useRunStatus = () => {
    const { status, isRunning, startTime, totalTime, logs } = useStore();

    const getStatusColor = () => {
        switch (status) {
            case 'completed': return 'text-green-500 bg-green-500/10';
            case 'failed': return 'text-red-500 bg-red-500/10';
            case 'running': return 'text-yellow-500 bg-yellow-500/10';
            default: return 'text-muted-foreground bg-gray-500/10';
        }
    };

    const getStatusLabel = () => {
        return status === 'completed' ? 'PASSED' : status.toUpperCase();
    };

    const getElapsedTime = () => {
        if (totalTime) return totalTime;
        if (!startTime || !isRunning) return '0s';

        const seconds = Math.floor((Date.now() - startTime) / 1000);
        return `${seconds}s`;
    };

    const lastLogMessage = logs.length > 0 ? logs[logs.length - 1].message : 'Initializing...';

    return {
        status,
        isRunning,
        statusColor: getStatusColor(),
        statusLabel: getStatusLabel(),
        elapsedTime: getElapsedTime(),
        lastLogMessage
    };
};
