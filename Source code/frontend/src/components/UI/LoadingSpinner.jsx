export const LoadingSpinner = () => {
  return (
    <div className="flex items-center gap-2" style={{ color: '#00f3ff' }}>
      <div className="w-4 h-4 border-2 border-neon-cyan/30 border-t-neon-cyan animate-spin rounded-full" />
      <span className="text-xs animate-pulse">PROCESSING...</span>
    </div>
  );
};  