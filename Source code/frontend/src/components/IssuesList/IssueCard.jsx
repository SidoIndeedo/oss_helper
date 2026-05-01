export const IssueCard = ({ issue }) => {
  // Extract data safely
  const title = issue.title || 'Untitled Issue';
  const repo = issue.repo || 'unknown/repo';
  const url = issue.url || '#';
  const score = issue.score?.toFixed(2) || '0.00';
  const explanation = issue.explanation || {};

  return (
    <div className="card-retro group">
      <div className="flex justify-between items-start gap-2">
        <h3 className="text-sm font-bold text-neon-cyan truncate">{title}</h3>
        <span className="text-xs bg-neon-cyan/10 px-2 py-0.5 border border-neon-cyan/30">
          {score}
        </span>
      </div>
      <p className="text-xs text-gray-400 mt-1">📦 {repo}</p>
      <div className="mt-3 flex flex-wrap gap-1 text-[10px] text-gray-500">
        {Object.entries(explanation).map(([key, val]) => (
          <span key={key} className="bg-black/30 px-2 py-0.5">
            {key}: {typeof val === 'number' ? val.toFixed(2) : val}
          </span>
        ))}
      </div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block mt-3 text-neon-green/70 hover:text-neon-green text-xs underline-offset-2 hover:underline"
      >
        view issue →
      </a>
    </div>
  );
};