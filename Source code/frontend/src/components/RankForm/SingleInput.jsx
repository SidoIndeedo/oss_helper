const skillLevels = ['beginner', 'intermediate', 'advanced'];
const commonLanguages = ['javascript', 'python', 'go', 'rust', 'java', 'c#', 'docker', 'kubernetes', 'react'];

export const SingleInput = ({ register, errors }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-neon-cyan text-sm uppercase tracking-wider mb-1">Language</label>
        <input
          {...register('language', { required: 'Language is required' })}
          list="languages-list"
          placeholder="e.g., python, javascript"
          className="w-full"
        />
        <datalist id="languages-list">
          {commonLanguages.map(lang => <option key={lang} value={lang} />)}
        </datalist>
        {errors.language && <p className="text-neon-magenta text-xs mt-1">{errors.language.message}</p>}
      </div>
      <div>
        <label className="block text-neon-cyan text-sm uppercase tracking-wider mb-1">Level</label>
        <select {...register('level', { required: 'Level is required' })} className="w-full">
          <option value="">Select level</option>
          {skillLevels.map(level => (
            <option key={level} value={level}>{level.toUpperCase()}</option>
          ))}
        </select>
        {errors.level && <p className="text-neon-magenta text-xs mt-1">{errors.level.message}</p>}
      </div>
    </div>
  );
};