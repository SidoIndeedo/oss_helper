import { useEffect, useState } from 'react';
import { RankForm } from '../components/RankForm/RankForm';
import { IssuesList } from '../components/IssuesList/IssuesList';
import { useRankIssues } from '../hooks/useRankIssues';
import { healthCheck } from '../services/api';

export default function HomePage() {
  const { loading, error, issues, rank } = useRankIssues();
  const [backendStatus, setBackendStatus] = useState(null);

  useEffect(() => {
    healthCheck()
      .then(() => setBackendStatus(true))
      .catch(() => setBackendStatus(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <header className="mb-8 text-center border-b border-neon-cyan/20 pb-4">
        <h1 className="text-3xl font-mono font-bold neon-text tracking-wider">
          OSS HELPER <span className="text-neon-magenta animate-pulse">⟁</span> RANK
        </h1>
        <div className="flex justify-center gap-4 mt-2 text-xs">
          {backendStatus === true && (
            <span className="text-neon-green">⚡ BACKEND ONLINE</span>
          )}
          {backendStatus === false && (
            <span className="text-neon-magenta">⚠️ BACKEND OFFLINE</span>
          )}
          <span className="text-gray-500">API: /api/rank</span>
        </div>
        <p className="text-gray-400 text-sm mt-2 max-w-xl mx-auto">
          Submit your tech stack or a single language + level — get back ranked OSS issues.
        </p>
      </header>

      <RankForm onRank={rank} loading={loading} />

      <IssuesList issues={issues} loading={loading} error={error} />
    </div>
  );
}