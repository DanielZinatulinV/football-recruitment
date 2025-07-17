import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { VacanciesService } from '../../api/services/VacanciesService';
import { useAppSelector } from '../../redux/store';

const unique = (arr: string[]) => Array.from(new Set(arr.filter(Boolean)));

const JobSearch: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const [role, setRole] = useState('');
  const [level, setLevel] = useState('');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState('');
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const authStatus = useAppSelector(state => state.auth.authStatus);

  // Получение вакансий с бэкенда
  useEffect(() => {
    const fetchVacancies = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await VacanciesService.listVacanciesV1VacanciesGet(
          role || undefined,
          location || undefined,
          salary ? Number(salary) : undefined,
          undefined, // salaryMax
          level || undefined,
          undefined, // positionType
          20,
          0
        );
        setVacancies(res.items || []);
      } catch (e: any) {
        setError(e?.body?.detail || e?.message || 'Error loading vacancies');
      } finally {
        setLoading(false);
      }
    };
    fetchVacancies();
  }, [role, location, salary, level, keyword]);

  // Для фильтров (title, location, level) — собираем уникальные значения из вакансий
  const titles = useMemo(() => unique(vacancies.map((v: any) => v.title)), [vacancies]);
  const locations = useMemo(() => unique(vacancies.map((v: any) => v.location)), [vacancies]);
  const levels = useMemo(() => unique(vacancies.map((v: any) => v.experience_level)), [vacancies]);

  // Форматирование зарплаты
  const formatSalary = (min: string | null | undefined, max: string | null | undefined) => {
    if (min && max) return `from ${min}$ to ${max}$`;
    if (min) return `from ${min}$`;
    if (max) return `to ${max}$`;
    return '';
  };

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
            {titles.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <select value={level} onChange={e => setLevel(e.target.value)} className="min-w-[110px] rounded border border-black px-3 py-2 text-base bg-white">
            <option value="">All levels</option>
            {levels.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
          <select value={location} onChange={e => setLocation(e.target.value)} className="min-w-[110px] rounded border border-black px-3 py-2 text-base bg-white">
            <option value="">All cities</option>
            {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
          </select>
          <input value={salary} onChange={e => setSalary(e.target.value.replace(/\D/g, ''))} placeholder="Salary from" className="min-w-[100px] rounded border border-black px-3 py-2 text-base bg-white placeholder-gray-600" />
        </form>
      </section>
      {/* Jobs List */}
      <section className="flex flex-col gap-8 px-8 pb-16">
        {loading ? (
          <div className="text-black bg-yellow-300 rounded-xl p-10 text-center font-bold text-lg shadow">Loading vacancies...</div>
        ) : error ? (
          <div className="text-red-600 bg-yellow-100 rounded-xl p-10 text-center font-bold text-lg shadow">{error}</div>
        ) : (
          (() => {
            const activeVacancies = vacancies.filter((v: any) => v.status === 'active');
            if (activeVacancies.length === 0) {
              return (
                <div className="text-black bg-yellow-300 rounded-xl p-10 text-center font-bold text-lg shadow">Vacancies not found</div>
              );
            }
            return activeVacancies
              .filter((v: any) => {
                // Фильтрация по ключевому слову (title, requirements, description)
                if (!keyword) return true;
                const kw = keyword.toLowerCase();
                return (
                  v.title?.toLowerCase().includes(kw) ||
                  v.requirements?.toLowerCase().includes(kw) ||
                  v.description?.toLowerCase().includes(kw)
                );
              })
              .map((job: any) => (
                <div key={job.id} className="bg-white rounded-xl shadow p-8 flex flex-wrap items-center gap-8">
                  <div className="flex-1 min-w-[200px]">
                    <div className="font-bold text-xl text-black mb-1">{job.title}</div>
                    <div className="text-yellow-500 font-semibold mb-1">Team #{job.team_id}</div>
                    <div className="text-gray-700 text-sm mb-2">{job.location} • {job.experience_level} • {formatSalary(job.salary_min, job.salary_max)}</div>
                    <div className="mt-2 text-black">{job.requirements}</div>
                  </div>
                  <div className="text-right min-w-[140px] flex flex-col items-end">
                    <div className="text-gray-400 text-xs mb-2">Published: {job.created_at?.slice(0,10)}</div>
                    {authStatus !== 'authenticated' ? (
                      <button className="rounded px-6 py-2 bg-yellow-300 text-black font-bold shadow hover:bg-yellow-400 transition" onClick={() => navigate('/register')}>Sign up to apply</button>
                    ) : (
                      <button className="rounded px-6 py-2 bg-yellow-300 text-black font-bold shadow hover:bg-yellow-400 transition" onClick={() => navigate(`/jobs/${job.id}`)}>Details</button>
                    )}
                  </div>
                </div>
              ));
          })()
        )}
      </section>
    </div>
  );
};

export default JobSearch; 