import { useFieldArray } from 'react-hook-form';

const skillLevels = ['beginner', 'intermediate', 'advanced'];

export const ProfileArrayInput = ({ control, register, errors }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'profile',
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="text-neon-cyan text-sm uppercase tracking-wider">Profile Skills</label>
        <button
          type="button"
          onClick={() => append({ name: '', level: 'beginner' })}
          className="text-xs border border-neon-green/50 px-3 py-1 hover:bg-neon-green/10"
        >
          + ADD SKILL
        </button>
      </div>

      {fields.map((field, index) => (
        <div key={field.id} className="grid grid-cols-2 gap-3 p-3 border border-gray-800">
          <div>
            <input
              {...register(`profile.${index}.name`, { required: 'Skill name required' })}
              placeholder="e.g., javascript, docker"
              className="w-full"
            />
            {errors?.profile?.[index]?.name && (
              <p className="text-neon-magenta text-xs mt-1">{errors.profile[index].name.message}</p>
            )}
          </div>
          <div className="flex gap-2">
            <select {...register(`profile.${index}.level`)} className="flex-1">
              {skillLevels.map(level => (
                <option key={level} value={level}>{level.toUpperCase()}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => remove(index)}
              className="border-neon-magenta/50 text-neon-magenta px-2"
            >
              ✕
            </button>
          </div>
        </div>
      ))}

      {fields.length === 0 && (
        <p className="text-gray-500 text-sm">Add at least one skill</p>
      )}
    </div>
  );
};