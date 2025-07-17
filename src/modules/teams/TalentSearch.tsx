import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CandidatesService } from '../../api/services/CandidatesService';
import { useAppSelector } from '../../redux/store';

const unique = (arr: string[]) => Array.from(new Set(arr.filter(Boolean)));

const TalentSearch: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const [role, setRole] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [location, setLocation] = useState('');
  const [position, setPosition] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const authStatus = useAppSelector(state => state.auth.authStatus);

  // Получение кандидатов с бэкенда
  useEffect(() => {
    const fetchCandidates = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await CandidatesService.searchCandidatesV1CandidatesGet(
          role || undefined,
          location || undefined,
          experienceLevel || undefined,
          position || undefined,
          20,
          0
        );
        setCandidates(res.items || []);
      } catch (e: any) {
        setError(e?.body?.detail || e?.message || 'Error loading candidates');
      } finally {
        setLoading(false);
      }
    };
    fetchCandidates();
  }, [role, location, experienceLevel, position, keyword]);

  // Для фильтров — собираем уникальные значения из кандидатов
  const roles = useMemo(() => unique(candidates.map((c: any) => c.position)), [candidates]);
  const locations = useMemo(() => unique(candidates.map((c: any) => c.location)), [candidates]);
  const experienceLevels = useMemo(() => unique(candidates.map((c: any) => c.experience_level)), [candidates]);
  const positions = useMemo(() => unique(candidates.map((c: any) => c.position)), [candidates]);

  // Форматирование опыта
  const formatExperience = (years: number | null | undefined) => {
    if (!years) return 'Not specified';
    if (years === 1) return '1 year';
    return `${years} years`;
  };

  return (
    <div className="min-h-screen bg-black pt-16">
      {/* Hero Section */}
      <section className="py-12 px-8">
        <h1 className="text-4xl md:text-5xl font-extrabold uppercase text-white leading-tight mb-8">
          Find <span className="text-yellow-300">Talent</span>
        </h1>
        {/* Filters */}
        <form className="flex flex-wrap gap-4 bg-yellow-300 rounded-xl p-6 mb-10 items-center shadow" onSubmit={e => e.preventDefault()}>
          <input 
            value={keyword} 
            onChange={e => setKeyword(e.target.value)} 
            placeholder="Search by name, skills, or bio" 
            className="flex-1 min-w-[140px] rounded border border-black px-3 py-2 text-base bg-white placeholder-gray-600" 
          />
          <select 
            value={role} 
            onChange={e => setRole(e.target.value)} 
            className="min-w-[120px] rounded border border-black px-3 py-2 text-base bg-white"
          >
            <option value="">All roles</option>
            {roles.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <select 
            value={experienceLevel} 
            onChange={e => setExperienceLevel(e.target.value)} 
            className="min-w-[110px] rounded border border-black px-3 py-2 text-base bg-white"
          >
            <option value="">All levels</option>
            {experienceLevels.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
          <select 
            value={location} 
            onChange={e => setLocation(e.target.value)} 
            className="min-w-[110px] rounded border border-black px-3 py-2 text-base bg-white"
          >
            <option value="">All locations</option>
            {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
          </select>
          <select 
            value={position} 
            onChange={e => setPosition(e.target.value)} 
            className="min-w-[120px] rounded border border-black px-3 py-2 text-base bg-white"
          >
            <option value="">All positions</option>
            {positions.map(pos => <option key={pos} value={pos}>{pos}</option>)}
          </select>
        </form>
      </section>
      
      {/* Candidates List */}
      <section className="flex flex-col gap-8 px-8 pb-16">
        {loading ? (
          <div className="text-black bg-yellow-300 rounded-xl p-10 text-center font-bold text-lg shadow">Loading candidates...</div>
        ) : error ? (
          <div className="text-red-600 bg-yellow-100 rounded-xl p-10 text-center font-bold text-lg shadow">{error}</div>
        ) : (
          (() => {
            const activeCandidates = candidates.filter((c: any) => c.is_active);
            if (activeCandidates.length === 0) {
              return (
                <div className="text-black bg-yellow-300 rounded-xl p-10 text-center font-bold text-lg shadow">No candidates found</div>
              );
            }
            return activeCandidates
              .filter((c: any) => {
                // Фильтрация по ключевому слову (имя, навыки, био)
                if (!keyword) return true;
                const kw = keyword.toLowerCase();
                return (
                  c.first_name?.toLowerCase().includes(kw) ||
                  c.last_name?.toLowerCase().includes(kw) ||
                  c.bio?.toLowerCase().includes(kw) ||
                  c.skills?.toLowerCase().includes(kw) ||
                  c.position?.toLowerCase().includes(kw)
                );
              })
              .map((candidate: any) => (
                <div key={candidate.id} className="bg-white rounded-xl shadow p-8 flex flex-wrap items-center gap-8">
                  <div className="flex-1 min-w-[200px]">
                    <div className="font-bold text-xl text-black mb-1">
                      {candidate.first_name} {candidate.last_name}
                    </div>
                    <div className="text-yellow-500 font-semibold mb-1">{candidate.position || 'Position not specified'}</div>
                    <div className="text-gray-700 text-sm mb-2">
                      {candidate.location || 'Location not specified'} • {candidate.experience_level || 'Experience not specified'} • {formatExperience(candidate.years_of_experience)}
                    </div>
                    <div className="mt-2 text-black">{candidate.bio || candidate.skills || 'No additional information available'}</div>
                    {candidate.skills && (
                      <div className="mt-2 text-sm text-gray-600">
                        <strong>Skills:</strong> {candidate.skills}
                      </div>
                    )}
                  </div>
                  <div className="text-right min-w-[140px] flex flex-col items-end">
                    <div className="text-gray-400 text-xs mb-2">
                      Member since: {candidate.created_at?.slice(0,10)}
                    </div>
                    {authStatus !== 'authenticated' ? (
                      <button 
                        className="rounded px-6 py-2 bg-yellow-300 text-black font-bold shadow hover:bg-yellow-400 transition" 
                        onClick={() => navigate('/register')}
                      >
                        Sign up to contact
                      </button>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <button 
                          className="rounded px-6 py-2 bg-yellow-300 text-black font-bold shadow hover:bg-yellow-400 transition" 
                          onClick={() => navigate(`/team/candidate/${candidate.id}`)}
                        >
                          View Profile
                        </button>
                        <button 
                          className="rounded px-6 py-2 bg-blue-500 text-white font-bold shadow hover:bg-blue-600 transition" 
                          onClick={() => navigate(`/messages/conversation/${candidate.id}`)}
                        >
                          Contact
                        </button>
                      </div>
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

export default TalentSearch;
