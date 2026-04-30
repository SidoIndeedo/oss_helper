import { IssueCard } from './IssueCard';

export const IssuesList = ({ issues, loading, error }) => {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block w-8 h-8 border-2 border-neon-cyan/30 border-t-neon-cyan animate-spin rounded-full" />
        <p className="mt-2 text-neon-cyan text-sm">FETCHING RANKED ISSUES...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-neon-magenta">
        <p>⚠️ {error}</p>
      </div>
    );
  }

  if (issues.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>⌨️ No issues to display. Submit a request above.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-neon-cyan text-sm uppercase tracking-wider">
          RANKED ISSUES ({issues.length})
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {issues.map((issue, idx) => (
          <IssueCard key={idx} issue={issue} />
        ))}
      </div>
    </div>
  );
};