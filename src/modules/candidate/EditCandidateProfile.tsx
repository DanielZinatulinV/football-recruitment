import React, { useState, useEffect } from 'react';
import { AuthenticationService } from '../../api/services/AuthenticationService';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../redux/store';
import { setUser } from '../../redux/slices/auth.slice';

const defaultProfile = {
  name: '',
  role: '',
  experience: '',
  location: '',
  subscription: 'Basic',
  qualifications: '',
  cv: '',
};

const EditCandidateProfile: React.FC = () => {
  const [profile, setProfile] = useState(defaultProfile);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const user = useAppSelector(state => state.auth.user);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user) {
      setProfile({
        name: [user.first_name, user.last_name].filter(Boolean).join(' '),
        role: user.position || '',
        experience: user.experience_level || '',
        location: user.location || '',
        subscription: user.is_active ? 'Active' : 'Inactive',
        qualifications: user.qualification || '',
        cv: user.cv_file_path || '',
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCvFile(e.target.files[0]);
      setProfile((prev) => ({ ...prev, cv: e.target.files![0].name }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      // Разбиваем имя на first_name и last_name
      const [first_name, ...rest] = profile.name.trim().split(' ');
      const last_name = rest.join(' ');
      const payload: any = {
        first_name,
        last_name,
        position: profile.role,
        experience_level: profile.experience,
        location: profile.location,
        qualification: profile.qualifications,
        // subscription и cv не отправляем, если не требуется бэкендом
      };
      const updatedUser = await AuthenticationService.updateUserProfileV1AuthProfilePatch(payload);
      dispatch(setUser(updatedUser));
      setSuccess('Profile updated!');
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (e: any) {
      setError(e?.body?.detail || e?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black pt-16 flex items-center justify-center">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl p-10">
        <h2 className="font-extrabold text-3xl mb-8 text-black text-center uppercase">
          Edit <span className="text-yellow-300">Profile</span>
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="text-red-600 font-bold mb-2">{error}</div>}
          {success && <div className="text-green-600 font-bold mb-2">{success}</div>}
          <div>
            <label className="block text-black font-semibold mb-1">Name</label>
            <input name="name" value={profile.name} onChange={handleChange} required className="w-full rounded-lg border border-black px-3 py-2 text-base mt-1 bg-white placeholder-gray-400" placeholder="Enter your name" />
          </div>
          <div>
            <label className="block text-black font-semibold mb-1">Profession</label>
            <input name="role" value={profile.role} onChange={handleChange} required placeholder="e.g. marketer, designer..." className="w-full rounded-lg border border-black px-3 py-2 text-base mt-1 bg-white placeholder-gray-400" />
          </div>
          <div>
            <label className="block text-black font-semibold mb-1">Experience</label>
            <input name="experience" value={profile.experience} onChange={handleChange} required placeholder="e.g. 3 years" className="w-full rounded-lg border border-black px-3 py-2 text-base mt-1 bg-white placeholder-gray-400" />
          </div>
          <div>
            <label className="block text-black font-semibold mb-1">Location</label>
            <input name="location" value={profile.location} onChange={handleChange} required placeholder="City" className="w-full rounded-lg border border-black px-3 py-2 text-base mt-1 bg-white placeholder-gray-400" />
          </div>
          <div>
            <label className="block text-black font-semibold mb-1">Qualifications</label>
            <textarea name="qualifications" value={profile.qualifications} onChange={handleChange} required placeholder="Education, skills, certificates..." className="w-full rounded-lg border border-black px-3 py-2 text-base mt-1 min-h-[60px] bg-white placeholder-gray-400" />
          </div>
          <button type="submit" className="rounded-lg px-6 py-3 bg-yellow-300 text-black font-bold text-base hover:bg-yellow-400 transition w-full" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
        </form>
      </div>
    </div>
  );
};

export default EditCandidateProfile; 