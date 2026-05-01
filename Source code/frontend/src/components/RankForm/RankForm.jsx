import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { ProfileArrayInput } from './ProfileArrayInput';
import { SingleInput } from './SingleInput';

export const RankForm = ({ onRank, loading }) => {
  const [mode, setMode] = useState('profile');

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      profile: [{ name: '', level: 'beginner' }],
      language: '',
      level: '',
    }
  });

  console.log('🔍 Form errors:', errors);
  console.log('🔍 Loading state:', loading);

  const onSubmit = (data) => {
    console.log('✅ Form submitted with data:', data);
    console.log('📌 Current mode:', mode);
    
    if (mode === 'profile') {
      const validProfile = data.profile.filter(skill => skill.name.trim() !== '');
      console.log('📊 Valid profile:', validProfile);
      if (validProfile.length === 0) {
        toast.error('Add at least one skill');
        return;
      }
      console.log('🚀 Calling onRank with profile:', { profile: validProfile });
      onRank({ profile: validProfile });
    } else {
      if (!data.language || !data.level) {
        toast.error('Fill both language and level');
        return;
      }
      console.log('🚀 Calling onRank with single:', { language: data.language, level: data.level });
      onRank({ language: data.language, level: data.level });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card-retro mb-8">
      <div className="flex gap-4 mb-6 border-b border-gray-800">
        <button
          type="button"
          onClick={() => { setMode('profile'); reset(); }}
          className={`px-3 py-1 ${mode === 'profile' ? 'border-neon-cyan text-neon-cyan' : 'border-transparent text-gray-500'}`}
        >
          MULTI-SKILL (PROFILE)
        </button>
        <button
          type="button"
          onClick={() => { setMode('single'); reset({ language: '', level: '' }); }}
          className={`px-3 py-1 ${mode === 'single' ? 'border-neon-cyan text-neon-cyan' : 'border-transparent text-gray-500'}`}
        >
          SINGLE LANGUAGE
        </button>
      </div>

      {mode === 'profile' && (
        <ProfileArrayInput control={control} register={register} errors={errors} />
      )}
      {mode === 'single' && (
        <SingleInput register={register} errors={errors} />
      )}

      <div className="mt-6 flex justify-end">
        <button type="submit" disabled={loading} className="min-w-[120px]">
          {loading ? 'RANKING...' : 'RANK ISSUES'}
        </button>
      </div>
    </form>
  );
};