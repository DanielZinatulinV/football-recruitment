import { useParams, useNavigate } from 'react-router-dom';
import React from 'react';

const mockJobs = [
  {
    id: 1,
    title: 'Marketer',
    company: 'FC Digital United',
    level: 'Middle',
    location: 'Moscow',
    salary: 90000,
    requirements: 'Experience in digital marketing, SMM knowledge, analytics',
    date: '2024-06-01',
    contact: 'hr@digitalunited.com',
    description: 'We are looking for a talented marketer to join our digital team. You will be responsible for SMM, analytics, and campaign management.'
  },
  {
    id: 2,
    title: 'Designer',
    company: 'FC Creative Stars',
    level: 'Junior',
    location: 'Saint Petersburg',
    salary: 70000,
    requirements: 'Figma, Adobe, project portfolio',
    date: '2024-05-28',
    contact: 'jobs@creativestars.com',
    description: 'Join our creative team as a junior designer. Portfolio required. Work on branding and matchday graphics.'
  },
  {
    id: 3,
    title: 'Event Manager',
    company: 'FC Event Pro',
    level: 'Senior',
    location: 'Kazan',
    salary: 120000,
    requirements: 'Organizing sports events, communications',
    date: '2024-05-20',
    contact: 'events@eventpro.com',
    description: 'Lead the organization of major sports events. Experience in event management and communication skills required.'
  },
  {
    id: 4,
    title: 'Copywriter',
    company: 'FC Media Team',
    level: 'Middle',
    location: 'Moscow',
    salary: 80000,
    requirements: 'Portfolio of texts, experience in sports theme',
    date: '2024-05-18',
    contact: 'media@fcteam.com',
    description: 'Write engaging copy for our media team. Sports experience is a plus.'
  },
];

const JobDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const job = mockJobs.find(j => String(j.id) === String(id));

  if (!job) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white text-xl">Vacancy not found</div>;
  }

  return (
    <div className="min-h-screen bg-black pt-16 pb-16">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-10 mt-10">
        <button className="mb-6 px-5 py-2 rounded-lg bg-black text-yellow-300 font-bold border-2 border-yellow-300 hover:bg-yellow-300 hover:text-black transition" onClick={() => navigate(-1)}>
          ← Back to jobs
        </button>
        <h1 className="text-3xl font-extrabold text-black mb-2 uppercase">
          {job.title}
        </h1>
        <div className="text-yellow-400 font-bold text-lg mb-2">{job.company}</div>
        <div className="text-gray-700 text-base mb-2">{job.location} • {job.level} • {job.salary.toLocaleString()}₽</div>
        <div className="text-gray-400 text-sm mb-4">Posted: {job.date}</div>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-black mb-2">Requirements</h2>
          <div className="text-black mb-2">{job.requirements}</div>
          <h2 className="text-xl font-bold text-black mb-2 mt-4">Description</h2>
          <div className="text-black mb-2">{job.description}</div>
        </div>
        <div className="flex flex-col md:flex-row gap-4 mt-8">
          <button className="rounded-lg px-8 py-3 bg-yellow-300 text-black font-bold border-2 border-yellow-300 hover:bg-yellow-400 transition text-lg w-full md:w-auto">Apply</button>
        </div>
      </div>
    </div>
  );
};

export default JobDetails; 