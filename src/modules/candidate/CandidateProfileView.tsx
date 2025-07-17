import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { CandidatesService } from '../../api/services/CandidatesService';
import type { OutUserSchema } from '../../api/models/OutUserSchema';

const TEAM_SHORTLIST_KEY = "team_shortlist";

const CandidateProfileView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState<OutUserSchema | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shortlist, setShortlist] = useState<number[]>([]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    CandidatesService.getCandidateProfileV1CandidatesCandidateIdGet(Number(id))
      .then(c => setCandidate(c))
      .catch(e => setError(e?.body?.detail || e?.message || 'Кандидат не найден'))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    const sl = localStorage.getItem(TEAM_SHORTLIST_KEY);
    if (sl) setShortlist(JSON.parse(sl));
  }, []);

  const toggleShortlist = (id: number) => {
    setShortlist(prev => {
      let updated;
      if (prev.includes(id)) {
        updated = prev.filter(cid => cid !== id);
      } else {
        updated = [...prev, id];
      }
      localStorage.setItem(TEAM_SHORTLIST_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  if (loading) {
    return <div className="p-10 text-center text-yellow-300">Loading...</div>;
  }
  if (error || !candidate) {
    return <div className="p-10 text-center text-gray-500">{error || 'Кандидат не найден'}</div>;
  }

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="max-w-xl mx-auto px-4">
        <div className="flex gap-2 mb-6">
          <button className="px-5 py-2 rounded-lg bg-black text-yellow-300 font-bold border-2 border-yellow-300 hover:bg-yellow-300 hover:text-black transition" onClick={() => navigate(-1)}>
            ← Назад к поиску
          </button>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-10">
          <h1 className="text-3xl font-extrabold text-black mb-6 uppercase">
            <span className="text-yellow-300">{candidate.first_name} {candidate.last_name}</span>
          </h1>
          <div className="mb-3 text-lg"><b className="text-black">Роль:</b> <span className="text-black font-semibold">{candidate.position || '-'}</span></div>
          <div className="mb-3 text-lg"><b className="text-black">Опыт:</b> <span className="text-black font-semibold">{candidate.experience_level || '-'}</span></div>
          <div className="mb-3 text-lg"><b className="text-black">Локация:</b> <span className="text-black font-semibold">{candidate.location || '-'}</span></div>
          <div className="mb-3 text-lg"><b className="text-black">Квалификация:</b> <span className="text-black font-semibold">{candidate.qualification || '-'}</span></div>
          <div className="mb-3 text-lg"><b className="text-black">Тариф:</b> <span className="text-yellow-400 font-bold uppercase">-</span></div>
          <div className="my-6 p-5 bg-white border-2 border-yellow-300 rounded-xl">
            <b className="text-black">CV:</b> {candidate.cv_file_path ? (
              <a href={candidate.cv_file_path} target="_blank" rel="noopener noreferrer" className="text-yellow-400 underline ml-2">Скачать CV</a>
            ) : (
              <span className="text-gray-400 ml-2">CV не загружено</span>
            )}
          </div>
          <div className="flex gap-4 mt-6">
            <button
              className={`rounded-lg px-6 py-3 font-bold transition border-2 ${shortlist.includes(candidate.id) ? 'bg-yellow-300 text-black border-yellow-400' : 'bg-white text-yellow-400 border-yellow-300 hover:bg-yellow-50'}`}
              onClick={() => toggleShortlist(candidate.id)}
            >
              {shortlist.includes(candidate.id) ? 'В shortlist ✓' : 'В shortlist'}
            </button>
            <button
              className="rounded-lg px-6 py-3 bg-black text-yellow-300 font-bold border-2 border-black hover:bg-yellow-300 hover:text-black transition"
              onClick={() => navigate(`/inbox?user=${candidate.id}`)}
            >
              Отправить сообщение
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfileView; 