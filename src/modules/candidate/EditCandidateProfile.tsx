import React, { useState, useEffect } from 'react';

const PROFILE_KEY = 'candidate_profile';

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

  useEffect(() => {
    const saved = localStorage.getItem(PROFILE_KEY);
    if (saved) setProfile(JSON.parse(saved));
  }, []);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    alert('Profile updated!');
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen bg-black pt-16 flex items-center justify-center">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl p-10">
        <h2 className="font-extrabold text-3xl mb-8 text-black text-center uppercase">
          Edit <span className="text-yellow-300">Profile</span>
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
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
          <div>
            <label className="block text-black font-semibold mb-1">Subscription Level</label>
            <select name="subscription" value={profile.subscription} onChange={handleChange} className="w-full rounded-lg border border-black px-3 py-2 text-base mt-1 bg-white">
              <option value="Basic">Basic</option>
              <option value="Pro">Pro</option>
            </select>
          </div>
          <div>
            <label className="block text-black font-semibold mb-1">CV (PDF/DOC)</label>
            <input type="file" accept=".pdf,.doc,.docx" onChange={handleCvChange} className="mt-2" />
            {profile.cv && <div className="mt-2 text-sm text-gray-600">Uploaded: {profile.cv}</div>}
          </div>
          <button type="submit" className="rounded-lg px-6 py-3 bg-yellow-300 text-black font-bold text-base hover:bg-yellow-400 transition w-full">Save</button>
        </form>
      </div>
    </div>
  );
};

export default EditCandidateProfile; 