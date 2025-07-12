import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCookie } from '../../shared/utils/cookie-helper.util';

const PROFILE_KEY = 'candidate_profile';
const APPLICATIONS_KEY = 'candidate_applications';

type Application = {
  id: number;
  position: string;
  company: string;
  date: string;
  status: 'Pending' | 'Accepted' | 'Declined';
};

const defaultProfile = {
  name: 'Anna Smirnova',
  role: 'Marketer',
  experience: '3 years',
  location: 'Saint Petersburg',
  subscription: 'Pro',
  qualifications: 'Higher education, experience in sports projects',
  cv: 'CV_Anna_Smirnova.pdf',
};

const defaultApplications: Application[] = [
  {
    id: 1,
    position: 'Marketer',
    company: 'FC Digital United',
    date: '2024-06-01',
    status: 'Pending',
  },
  {
    id: 2,
    position: 'Designer',
    company: 'FC Creative Stars',
    date: '2024-05-28',
    status: 'Accepted',
  },
  {
    id: 3,
    position: 'Event Manager',
    company: 'FC Event Pro',
    date: '2024-05-20',
    status: 'Declined',
  },
];

const getApplications = (): Application[] => {
  const saved = localStorage.getItem(APPLICATIONS_KEY);
  if (saved) return JSON.parse(saved);
  return defaultApplications;
};

const AddApplicationForm: React.FC<{ onAdd: (app: Application) => void }> = ({ onAdd }) => {
  const [position, setPosition] = useState('');
  const [company, setCompany] = useState('');
  const [status, setStatus] = useState<'Pending' | 'Accepted' | 'Declined'>('Pending');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!position || !company) return;
    const newApp: Application = {
      id: Date.now(),
      position,
      company,
      date: new Date().toISOString().slice(0, 10),
      status,
    };
    onAdd(newApp);
    setPosition('');
    setCompany('');
    setStatus('Pending');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-2 mb-4 items-center">
      <input value={position} onChange={e => setPosition(e.target.value)} placeholder="Position" className="rounded border border-black px-3 py-2 text-base" />
      <input value={company} onChange={e => setCompany(e.target.value)} placeholder="Company" className="rounded border border-black px-3 py-2 text-base" />
      <select value={status} onChange={e => setStatus(e.target.value as any)} className="rounded border border-black px-3 py-2 text-base">
        <option value="Pending">Pending</option>
        <option value="Accepted">Accepted</option>
        <option value="Declined">Declined</option>
      </select>
      <button type="submit" className="rounded px-5 py-2 bg-yellow-300 text-black font-bold shadow hover:bg-yellow-400 transition">Add Application</button>
    </form>
  );
};

const CandidateDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(defaultProfile);
  const [applications, setApplications] = useState<Application[]>(getApplications());

  useEffect(() => {
    const saved = localStorage.getItem(PROFILE_KEY);
    if (saved) setProfile(JSON.parse(saved));
    setApplications(getApplications());
  }, []);

  const handleAddApplication = (app: Application) => {
    const updated = [app, ...applications];
    setApplications(updated);
    localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-black pt-16">
      {/* Hero Section */}
      <section className="relative bg-cover bg-center h-72 flex items-center" style={{ backgroundImage: "url('/assets/football.svg')" }}>
        <div className="absolute inset-0 bg-black bg-opacity-70"></div>
        <div className="relative z-10 px-8">
          <h1 className="text-4xl md:text-6xl font-extrabold uppercase text-white leading-tight">
            Unlock<br />
            <span className="text-yellow-300">Your Potential</span><br />
            in Sport
          </h1>
          <p className="mt-4 text-lg text-white max-w-xl">
            Welcome to your candidate dashboard. Here you can track your applications, update your profile, and find the best jobs in sport.
          </p>
          <button className="mt-6 bg-yellow-300 text-black font-bold px-8 py-3 rounded hover:bg-yellow-400 transition" onClick={() => navigate('/candidate/profile/edit')}>
            Update Profile
          </button>
        </div>
      </section>
      {/* Divider */}
      <div className="w-full h-6 bg-yellow-300" style={{ transform: 'skewY(-3deg)' }}></div>

      {/* Stats Section */}
      <section className="bg-yellow-300 py-12 px-8">
        <h2 className="text-3xl font-bold text-black mb-8 uppercase">Your Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded shadow p-8 text-center">
            <div className="text-4xl font-extrabold text-black">{applications.length}</div>
            <div className="text-lg text-gray-700 mt-2">Applications</div>
          </div>
          <div className="bg-white rounded shadow p-8 text-center">
            <div className="text-4xl font-extrabold text-black">2</div>
            <div className="text-lg text-gray-700 mt-2">Interviews</div>
          </div>
          <div className="bg-white rounded shadow p-8 text-center">
            <div className="text-4xl font-extrabold text-black">1</div>
            <div className="text-lg text-gray-700 mt-2">Offers</div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="w-full h-6 bg-black" style={{ transform: 'skewY(3deg)' }}></div>

      {/* Profile Section */}
      <section className="bg-black py-12 px-8">
        <h2 className="text-3xl font-bold text-yellow-300 mb-8 uppercase">Candidate Profile</h2>
        <div className="flex flex-wrap gap-10 items-center">
          <div className="space-y-2 text-white text-lg">
              <div><b>Name:</b> {profile.name}</div>
              <div><b>Profession:</b> {profile.role}</div>
              <div><b>Experience:</b> {profile.experience}</div>
              <div><b>Location:</b> {profile.location}</div>
              <div><b>Qualifications:</b> {profile.qualifications}</div>
              <div><b>Subscription:</b> {profile.subscription}</div>
            <div><b>CV:</b> <a href="#" className="text-yellow-300 underline">{profile.cv}</a></div>
            </div>
          <button className="rounded px-6 py-3 bg-yellow-300 text-black font-bold hover:bg-yellow-400 transition" onClick={() => navigate('/candidate/profile/edit')}>
            Edit Profile
          </button>
          </div>
        </section>

      {/* Divider */}
      <div className="w-full h-6 bg-yellow-300" style={{ transform: 'skewY(-3deg)' }}></div>

      {/* Applications Section */}
      <section className="bg-yellow-300 py-12 px-8">
        <h2 className="text-3xl font-bold text-black mb-8 uppercase">My Applications</h2>
          <AddApplicationForm onAdd={handleAddApplication} />
          {applications.length === 0 ? (
          <div className="text-gray-700 mb-4">You have not applied to any jobs yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                <tr className="bg-black">
                  <th className="p-3 text-yellow-300 text-left">Position</th>
                  <th className="p-3 text-yellow-300 text-left">Company</th>
                  <th className="p-3 text-yellow-300 text-left">Date</th>
                  <th className="p-3 text-yellow-300 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app: Application) => (
                  <tr key={app.id} className="bg-white border-b border-yellow-200">
                    <td className="p-3 text-black font-semibold">{app.position}</td>
                    <td className="p-3 text-black">{app.company}</td>
                    <td className="p-3 text-black">{app.date}</td>
                    <td className="p-3">
                      {app.status === 'Pending' && <span className="text-yellow-500 font-bold">Pending</span>}
                      {app.status === 'Accepted' && <span className="text-green-600 font-bold">Accepted</span>}
                      {app.status === 'Declined' && <span className="text-red-600 font-bold">Declined</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

      {/* Divider */}
      <div className="w-full h-6 bg-black" style={{ transform: 'skewY(3deg)' }}></div>

        {/* Job Search Section */}
      <section className="bg-black py-12 px-8">
        <h2 className="text-3xl font-bold text-yellow-300 mb-8 uppercase">Featured Jobs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Example card */}
          <div className="bg-white rounded shadow p-8">
            <h3 className="text-xl font-bold text-black">Business Development Manager</h3>
            <p className="text-gray-700 mt-2">Football Club "Example"</p>
            <button className="mt-4 bg-yellow-300 text-black font-bold px-6 py-2 rounded hover:bg-yellow-400 transition" onClick={() => navigate('/jobs')}>
              More Details
            </button>
          </div>
          {/* ...other cards */}
        </div>
        </section>
    </div>
  );
};

export default CandidateDashboard; 