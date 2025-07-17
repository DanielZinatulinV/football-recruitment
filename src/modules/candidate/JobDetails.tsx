import { useParams, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { ApplicationsService } from '../../api/services/ApplicationsService';
import { VacanciesService } from '../../api/services/VacanciesService';
import { useAppSelector } from '../../redux/store';


const formatSalary = (min: string | null | undefined, max: string | null | undefined) => {
  if (min && max) return `from ${min}$ to ${max}$`;
  if (min) return `from ${min}$`;
  if (max) return `to ${max}$`;
  return '';
};

const JobDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applyLoading, setApplyLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [applyError, setApplyError] = useState<string | null>(null);
  const authStatus = useAppSelector(state => state.auth.authStatus);
  const user = useAppSelector(state => state.auth.user);
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      setError(null);
      try {
        const vacancy = await VacanciesService.getVacancyV1VacanciesVacancyIdGet(Number(id));
        setJob(vacancy);
      } catch (e: any) {
        setError(e?.body?.detail || e?.message || 'Vacancy not found');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  // Проверяем, откликался ли пользователь на эту вакансию
  useEffect(() => {
    if (authStatus !== 'authenticated' || !user) {
      setAlreadyApplied(false);
      return;
    }
    ApplicationsService.getMyApplicationsV1ApplicationsMyApplicationsGet()
      .then(apps => {
        setAlreadyApplied(apps.some((a: any) => a.vacancy_id === Number(id)));
      })
      .catch(() => setAlreadyApplied(false));
  }, [authStatus, user, id]);

  const handleApply = async () => {
    setApplyLoading(true);
    setApplyError(null);
    setSuccess(null);
    try {
      await ApplicationsService.applyToVacancyV1ApplicationsPost({
        vacancy_id: Number(id),
      });
      setSuccess('You have successfully applied for this job!');
      setAlreadyApplied(true);
    } catch (e: any) {
      setApplyError(e?.body?.detail || e?.message || 'Error while applying.');
    } finally {
      setApplyLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-yellow-300 text-xl">Loading...</div>;
  }
  if (error || !job) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white text-xl">{error || 'Vacancy not found'}</div>;
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
        <div className="text-yellow-400 font-bold text-lg mb-2">Team #{job.team_id}</div>
        <div className="text-gray-700 text-base mb-2">{job.location} • {job.experience_level} • {formatSalary(job.salary_min, job.salary_max)}</div>
        <div className="text-gray-400 text-sm mb-4">Published: {job.created_at?.slice(0,10)}</div>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-black mb-2">Requirements</h2>
          <div className="text-black mb-2">{job.requirements}</div>
          <h2 className="text-xl font-bold text-black mb-2 mt-4">Description</h2>
          <div className="text-black mb-2">{job.description}</div>
        </div>
        {/* --- Новая форма отклика --- */}
        <div className="flex flex-col md:flex-row gap-4 mt-8">
          {success && <div className="text-green-600 font-bold mb-2">{success}</div>}
          {applyError && <div className="text-red-600 font-bold mb-2">{applyError}</div>}
          {authStatus !== 'authenticated' ? (
            <button
              className="rounded-lg px-8 py-3 bg-yellow-300 text-black font-bold border-2 border-yellow-300 hover:bg-yellow-400 transition text-lg w-full md:w-auto"
              onClick={() => navigate('/login')}
            >
              Sign in to apply
            </button>
          ) : alreadyApplied ? (
            <button
              className="rounded-lg px-8 py-3 bg-gray-300 text-gray-500 font-bold border-2 border-gray-300 text-lg w-full md:w-auto cursor-not-allowed"
              disabled
            >
              Already applied
            </button>
          ) : (
            <button
              className="rounded-lg px-8 py-3 bg-yellow-300 text-black font-bold border-2 border-yellow-300 hover:bg-yellow-400 transition text-lg w-full md:w-auto disabled:opacity-60"
              onClick={handleApply}
              disabled={applyLoading}
            >
              {applyLoading ? 'Applying...' : 'Apply'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetails; 