export const ErrorAlert = ({ message }) => {
  if (!message) return null;
  return (
    <div className="border-l-4 border-neon-magenta bg-card-bg p-3 my-4">
      <p className="text-neon-magenta text-sm">⚠️ {message}</p>
    </div>
  );
};