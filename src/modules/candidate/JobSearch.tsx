import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

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
  },
];

const unique = (arr: string[]) => Array.from(new Set(arr));

const JobSearch: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const [role, setRole] = useState('');
  const [level, setLevel] = useState('');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState('');
  const navigate = useNavigate();

  const filteredJobs = useMemo(() => {
    return mockJobs.filter(job => {
      const matchesKeyword = keyword === '' || job.title.toLowerCase().includes(keyword.toLowerCase()) || job.company.toLowerCase().includes(keyword.toLowerCase()) || job.requirements.toLowerCase().includes(keyword.toLowerCase());
      const matchesRole = role === '' || job.title === role;
      const matchesLevel = level === '' || job.level === level;
      const matchesLocation = location === '' || job.location === location;
      const matchesSalary = salary === '' || job.salary >= Number(salary);
      return matchesKeyword && matchesRole && matchesLevel && matchesLocation && matchesSalary;
    });
  }, [keyword, role, level, location, salary]);

  return (
    <div className="min-h-screen bg-black pt-16">
      {/* Hero Section */}
      <section className="py-12 px-8">
        <h1 className="text-4xl md:text-5xl font-extrabold uppercase text-white leading-tight mb-8">
          Find <span className="text-yellow-300">Jobs</span>
        </h1>
        {/* Filters */}
        <form className="flex flex-wrap gap-4 bg-yellow-300 rounded-xl p-6 mb-10 items-center shadow" onSubmit={e => e.preventDefault()}>
          <input value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="Keyword" className="flex-1 min-w-[140px] rounded border border-black px-3 py-2 text-base bg-white placeholder-gray-600" />
          <select value={role} onChange={e => setRole(e.target.value)} className="min-w-[120px] rounded border border-black px-3 py-2 text-base bg-white">
            <option value="">All professions</option>
            {unique(mockJobs.map(j => j.title)).map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <select value={level} onChange={e => setLevel(e.target.value)} className="min-w-[110px] rounded border border-black px-3 py-2 text-base bg-white">
            <option value="">All levels</option>
            {unique(mockJobs.map(j => j.level)).map(l => <option key={l} value={l}>{l}</option>)}
          </select>
          <select value={location} onChange={e => setLocation(e.target.value)} className="min-w-[110px] rounded border border-black px-3 py-2 text-base bg-white">
            <option value="">All cities</option>
            {unique(mockJobs.map(j => j.location)).map(loc => <option key={loc} value={loc}>{loc}</option>)}
          </select>
          <input value={salary} onChange={e => setSalary(e.target.value.replace(/\D/g, ''))} placeholder="Salary from" className="min-w-[100px] rounded border border-black px-3 py-2 text-base bg-white placeholder-gray-600" />
        </form>
      </section>
      {/* Jobs List */}
      <section className="flex flex-col gap-8 px-8 pb-16">
        {filteredJobs.length === 0 ? (
          <div className="text-black bg-yellow-300 rounded-xl p-10 text-center font-bold text-lg shadow">No jobs found</div>
        ) : (
          filteredJobs.map(job => (
            <div key={job.id} className="bg-white rounded-xl shadow p-8 flex flex-wrap items-center gap-8">
              <div className="flex-1 min-w-[200px]">
                <div className="font-bold text-xl text-black mb-1">{job.title}</div>
                <div className="text-yellow-500 font-semibold mb-1">{job.company}</div>
                <div className="text-gray-700 text-sm mb-2">{job.location} • {job.level} • {job.salary.toLocaleString()}₽</div>
                <div className="mt-2 text-black">{job.requirements}</div>
              </div>
              <div className="text-right min-w-[140px] flex flex-col items-end">
                <div className="text-gray-400 text-xs mb-2">Posted: {job.date}</div>
                <button className="rounded px-6 py-2 bg-yellow-300 text-black font-bold shadow hover:bg-yellow-400 transition" onClick={() => navigate(`/jobs/${job.id}`)}>More Details</button>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default JobSearch; 