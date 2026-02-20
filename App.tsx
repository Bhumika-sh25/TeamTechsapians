import React, { useEffect } from 'react';
import { InputSection } from './components/InputSection';
import { RunSummary } from './components/RunSummary';
import { ScorePanel } from './components/ScorePanel';
import { Timeline } from './components/Timeline';
import { FixesTable } from './components/FixesTable';
import { Activity } from 'lucide-react';

function App() {
  useEffect(() => {
   fetch("https://teamtechsapians.onrender.com/api/login")
      .then(res => res.json())
      .then(data => {
        console.log("Backend Response:", data);
      })
      .catch(err => {
        console.error("Error connecting to backend:", err);
      });
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground p-8 font-sans">
      <header className="mb-8 flex items-center justify-between border-b border-border pb-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-2 gradient-text">
              CI/CD Healing Agent
            </h1>
            <p className="text-sm text-muted-foreground">
              AI-powered continuous integration & repair
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono text-muted-foreground block">
              SYSTEM_STATUS: ONLINE
            </span>
            <span className="text-xs font-mono text-green-400 block">
              v1.2.4-stable
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <InputSection />
          <RunSummary />
          <FixesTable />
          <ScorePanel />
        </div>
        <div className="lg:col-span-1">
          <Timeline />
        </div>
      </main>
    </div>
  );
}

export default App;
