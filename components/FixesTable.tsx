import React from 'react';
import { useStore } from '../store/useStore';
import type { FixEntry } from '../store/useStore';
import { CheckCircle, XCircle, FileCode, Wrench } from 'lucide-react';

export const FixesTable = () => {
    const { fixesApplied } = useStore();

    if (!fixesApplied || fixesApplied.length === 0) {
        return (
            <div className="bg-card p-6 rounded-lg shadow-md border border-border mt-6">
                <h2 className="text-xl font-bold mb-4 text-primary flex items-center">
                    <Wrench className="mr-2" /> Fixes Applied
                </h2>
                <div className="text-center text-muted-foreground py-8">
                    No fixes applied yet. Waiting for analysis...
                </div>
            </div>
        );
    }

    return (
        <div className="bg-card p-6 rounded-lg shadow-md border border-border mt-6">
            <h2 className="text-xl font-bold mb-4 text-primary flex items-center">
                <Wrench className="mr-2" /> Fixes Applied
            </h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-border">
                            <th className="pb-2 text-sm font-semibold text-muted-foreground">File</th>
                            <th className="pb-2 text-sm font-semibold text-muted-foreground">Type</th>
                            <th className="pb-2 text-sm font-semibold text-muted-foreground">Line</th>
                            <th className="pb-2 text-sm font-semibold text-muted-foreground">Message</th>
                            <th className="pb-2 text-sm font-semibold text-muted-foreground">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {fixesApplied.map((fix, index) => (
                            <tr key={index} className="hover:bg-secondary/20 transition-colors">
                                <td className="py-3 text-sm font-mono text-foreground">{fix.file}</td>
                                <td className="py-3 text-sm">
                                    <span className="bg-red-500/10 text-red-500 px-2 py-1 rounded text-xs font-bold border border-red-500/20">
                                        {fix.bug_type}
                                    </span>
                                </td>
                                <td className="py-3 text-sm font-mono text-muted-foreground">{fix.line_number}</td>
                                <td className="py-3 text-sm text-foreground max-w-xs truncate" title={fix.commit_message}>
                                    {fix.commit_message}
                                </td>
                                <td className="py-3 text-sm">
                                    <span className="flex items-center text-green-500">
                                        <CheckCircle size={14} className="mr-1" /> {fix.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
