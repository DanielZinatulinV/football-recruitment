import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../redux/store';
import { ApplicationsService } from '../../api/services/ApplicationsService';
import { VacanciesService } from '../../api/services/VacanciesService';
import { CandidatesService } from '../../api/services/CandidatesService';

const CandidateDashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = useAppSelector(state => state.auth.user);
  const authStatus = useAppSelector(state => state.auth.authStatus);
  const [applications, setApplications] = useState<any[]>([]);
  const [vacancyMap, setVacancyMap] = useState<Record<number, any>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [featuredJobs, setFeaturedJobs] = useState<any[]>([]);
  const featuredRef = useRef<HTMLDivElement>(null);
  const [cvUploading, setCvUploading] = useState(false);
  const [cvError, setCvError] = useState<string | null>(null);
  const [cvSuccess, setCvSuccess] = useState<string | null>(null);
  const dispatch = useAppSelector(state => state.auth.user) ? useAppSelector : null;
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (authStatus !== 'authenticated' || !user) return;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Получаем отклики кандидата
        const apps = await ApplicationsService.getMyApplicationsV1ApplicationsMyApplicationsGet();
        setApplications(apps);
        // Получаем инфо о вакансиях для каждой заявки
        const vacancyIds = Array.from(new Set(apps.map((a: any) => a.vacancy_id)));
        const vacancyMapTemp: Record<number, any> = {};
        await Promise.all(
          vacancyIds.map(async (vid) => {
            try {
              const v = await VacanciesService.getVacancyV1VacanciesVacancyIdGet(vid);
              vacancyMapTemp[vid] = v;
            } catch {}
          })
        );
        setVacancyMap(vacancyMapTemp);
        // Получаем все вакансии для Featured Jobs
        const allVacancies = await VacanciesService.listVacanciesV1VacanciesGet();
        let filtered = allVacancies.items;
        if (user.position) {
          filtered = filtered.filter((v: any) => v.position_type && v.position_type.toLowerCase() === user.position.toLowerCase());
        }
        setFeaturedJobs(filtered.slice(0, 5));
      } catch (e: any) {
        setError(e?.body?.detail || e?.message || 'Error loading data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, authStatus]);

  // Форматирование статуса
  const formatStatus = (status: string) => {
    if (status === 'pending') return <span className="text-yellow-500 font-bold">Pending</span>;
    if (status === 'accepted') return <span className="text-green-600 font-bold">Accepted</span>;
    if (status === 'declined') return <span className="text-red-600 font-bold">Declined</span>;
    if (status === 'withdrawn') return <span className="text-gray-500 font-bold">Withdrawn</span>;
    return status;
  };

  // Форматирование даты
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  // Форматирование имени
  const getFullName = (u: any) => {
    if (!u) return '';
    return [u.first_name, u.last_name].filter(Boolean).join(' ');
  };

  // Форматирование профиля
  const profile = user
    ? {
        name: getFullName(user),
        role: user.position || '',
        experience: user.experience_level || '',
        location: user.location || '',
        subscription: user.is_active ? 'Active' : 'Inactive',
        qualifications: user.qualification || '',
        cv: user.cv_file_path || '',
      }
    : null;

  // --- CV upload handler ---
  const handleCvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setCvError(null);
    setCvSuccess(null);
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    if (!['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
      setCvError('Only PDF, DOC, DOCX files are allowed.');
      return;
    }
    setCvUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      await CandidatesService.uploadCvV1CandidatesUploadCvPost({ file });
      setCvSuccess('CV uploaded successfully!');
      window.location.reload(); // или можно обновить профиль через redux
    } catch (e: any) {
      setCvError(e?.body?.detail || e?.message || 'Failed to upload CV');
    } finally {
      setCvUploading(false);
    }
  };

  if (authStatus !== 'authenticated') {
    return <div className="min-h-screen bg-black flex items-center justify-center text-yellow-300 text-xl">Loading...</div>;
  }

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
            <div className="text-4xl font-extrabold text-black">3</div>
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
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-yellow-300 mb-12 uppercase text-center">Candidate Profile</h2>
          {!user ? (
            <div className="text-red-500 text-center">Not authenticated</div>
          ) : profile ? (
            <div className="bg-black/80 rounded-2xl p-8 shadow-2xl border border-yellow-300/20">
              {/* Profile Header */}
              <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 mb-8">
                {/* Avatar/Initial Circle */}
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 bg-yellow-300 rounded-full flex items-center justify-center">
                    <span className="text-3xl font-bold text-black">
                      {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
                    </span>
                  </div>
                </div>
                
                {/* Main Profile Info */}
                <div className="flex-grow text-center lg:text-left">
                  <h3 className="text-2xl font-bold text-white mb-2">{profile.name || 'Unknown User'}</h3>
                  <p className="text-yellow-300 text-lg mb-1">{profile.role || 'No profession specified'}</p>
                  <p className="text-gray-300">{profile.location || 'Location not specified'}</p>
                </div>
                
                {/* Action Button */}
                <div className="flex-shrink-0">
                  <button 
                    className="bg-yellow-300 text-black font-bold px-6 py-3 rounded-lg hover:bg-yellow-400 transition-all duration-200 transform hover:scale-105 shadow-lg"
                    onClick={() => navigate('/candidate/profile/edit')}
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
              
              {/* Profile Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-black/80 rounded-lg p-4 border border-yellow-300/10">
                  <div className="text-yellow-300 text-sm font-semibold mb-1">Experience</div>
                  <div className="text-white text-lg">{profile.experience || 'Not specified'}</div>
                </div>
                
                <div className="bg-black/80 rounded-lg p-4 border border-yellow-300/10">
                  <div className="text-yellow-300 text-sm font-semibold mb-1">Qualifications</div>
                  <div className="text-white text-lg">{profile.qualifications || 'Not specified'}</div>
                </div>
                
                <div className="bg-black/80 rounded-lg p-4 border border-yellow-300/10">
                  <div className="text-yellow-300 text-sm font-semibold mb-1">Subscription</div>
                  <div className="text-white text-lg">
                    <span className={`inline-flex items-center px-2 py-1 rounded text-sm font-medium ${
                      profile.subscription === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {profile.subscription}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* CV Section */}
              <div className="bg-black/80 rounded-lg p-6 border border-yellow-300/20">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-300/20 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-yellow-300 font-semibold">CV Document</div>
                      <div className="text-gray-300 text-sm">
                        {profile.cv ? (
                          <a href={profile.cv} className="text-yellow-300 hover:text-yellow-400 underline" target="_blank" rel="noopener noreferrer">
                            Download Current CV
                          </a>
                        ) : (
                          'No CV uploaded yet'
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center gap-2">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      id="cv-upload"
                      style={{ display: 'none' }}
                      onChange={handleCvUpload}
                      disabled={cvUploading}
                      ref={fileInputRef}
                    />
                    <button
                      type="button"
                      className="bg-yellow-300 text-black font-semibold px-4 py-2 rounded-lg hover:bg-yellow-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={cvUploading}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {cvUploading ? 'Uploading...' : (profile.cv ? 'Update CV' : 'Upload CV')}
                    </button>
                    {cvError && <div className="text-red-400 text-sm text-center">{cvError}</div>}
                    {cvSuccess && <div className="text-green-400 text-sm text-center">{cvSuccess}</div>}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {/* Divider */}
      <div className="w-full h-6 bg-yellow-300" style={{ transform: 'skewY(-3deg)' }}></div>

      {/* Applications Section */}
      <section className="bg-yellow-300 py-12 px-8">
        <h2 className="text-3xl font-bold text-black mb-8 uppercase">My Applications</h2>
        {loading ? (
          <div className="text-black">Loading applications...</div>
        ) : error ? (
          <div className="text-red-600 bg-yellow-100 rounded-xl p-6 text-center font-bold text-lg shadow">{error}</div>
        ) : applications.length === 0 ? (
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
                {applications.map((app: any) => {
                  const vacancy = vacancyMap[app.vacancy_id];
                  return (
                    <tr key={app.id} className="bg-white border-b border-yellow-200">
                      <td className="p-3 text-black font-semibold">{vacancy ? vacancy.title : '...'}</td>
                      <td className="p-3 text-black">{vacancy ? (vacancy.club_name || `Team #${vacancy.id}`) : '...'}</td>
                      <td className="p-3 text-black">{formatDate(app.created_at)}</td>
                      <td className="p-3">{formatStatus(app.status)}</td>
                    </tr>
                  );
                })}
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
      {featuredJobs.length === 0 ? (
        <div className="text-gray-400 bg-white rounded-xl p-10 text-center">No suitable jobs found</div>
      ) : (
        <div className="relative">
          <button
            type="button"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-yellow-300 text-black rounded-full w-10 h-10 flex items-center justify-center shadow hover:bg-yellow-400 transition"
            style={{ left: '-20px' }}
            onClick={() => {
              if (featuredRef.current) featuredRef.current.scrollBy({ left: -320, behavior: 'smooth' });
            }}
            aria-label="Scroll left"
          >&lt;</button>
          <div
            ref={featuredRef}
            className="flex gap-6 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-yellow-300 scrollbar-track-yellow-100"
            style={{ scrollBehavior: 'smooth' }}
          >
            {featuredJobs.map((job: any) => (
              <div key={job.id} className="min-w-[300px] max-w-[320px] bg-white rounded-xl shadow p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-black mb-2 truncate">{job.title}</h3>
                  <p className="text-gray-700 mb-2">{job.club_name || `Team #${job.team_name}`}</p>
                  <p className="text-gray-500 text-sm mb-4 truncate">{job.requirements}</p>
                </div>
                <button
                  className="mt-auto bg-yellow-300 text-black font-bold px-6 py-2 rounded hover:bg-yellow-400 transition"
                  onClick={() => navigate(`/jobs/${job.id}`)}
                >
                  More Details
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-yellow-300 text-black rounded-full w-10 h-10 flex items-center justify-center shadow hover:bg-yellow-400 transition"
            style={{ right: '-20px' }}
            onClick={() => {
              if (featuredRef.current) featuredRef.current.scrollBy({ left: 320, behavior: 'smooth' });
            }}
            aria-label="Scroll right"
          >&gt;</button>
        </div>
      )}
        </section>
    </div>
  );
};

export default CandidateDashboard; 