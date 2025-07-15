import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateVacancyForm from "./components/CreateVacancyForm";
import { Range } from "react-range";
import type { OutUserSchema } from '../../api';
import { OpenAPI } from '../../api/core/OpenAPI';
import { VacanciesService } from '../../api/services/VacanciesService';
import { ApplicationsService } from '../../api/services/ApplicationsService';
import { CandidatesService } from '../../api/services/CandidatesService';
import type { OutApplicationSchema } from '../../api/models/OutApplicationSchema';
import type { OutVacancySchema } from '../../api/models/OutVacancySchema';
import type { ApplicationStatus as ApiApplicationStatus } from '../../api/models/ApplicationStatus';
import type { CreateVacancySchema } from '../../api/models/CreateVacancySchema';
import type { UpdateVacancySchema } from '../../api/models/UpdateVacancySchema';
import { useAppSelector } from '../../redux/store';

const TEAM_PROFILE_KEY = "team_profile";
const TEAM_VACANCIES_KEY = "team_vacancies";
const TEAM_SHORTLIST_KEY = "team_shortlist";
const TEAM_APPLICATIONS_KEY = "team_applications";

const defaultProfile = {
  email: "",
  teamName: "",
  website: "",
  location: "",
  description: "",
  logo: null,
};

type Vacancy = {
  id: string;
  role: string;
  requirements: string;
  salaryFrom?: string;
  salaryTo?: string;
  location?: string;
  anyLocation?: boolean;
  expiry: string;
  description?: string;
  experience_level?: string;
  status?: string;
};

function mapOutVacancyToVacancy(v: any): Vacancy {
  return {
    id: String(v.id ?? v.vacancy_id ?? Date.now()),
    role: v.title || v.role || '',
    requirements: v.requirements || '',
    salaryFrom: v.salary_min ? String(v.salary_min) : '',
    salaryTo: v.salary_max ? String(v.salary_max) : '',
    location: v.location || '',
    anyLocation: v.location === 'Remote',
    expiry: v.expiry_date || v.expiry || '',
    description: v.description || '',
    experience_level: v.experience_level || '',
    status: v.status || 'active',
  };
}

// Мок-данные кандидатов
export const mockCandidates: Array<{
  id: number;
  firstName: string;
  lastName: string;
  position: string;
  experience: string;
  location: string;
  skills: string;
  selectedPlan: string;
}> = [
  {
    id: 1,
    firstName: 'Анна',
    lastName: 'Смирнова',
    position: 'Маркетолог',
    experience: '3',
    location: 'Санкт-Петербург',
    skills: 'SMM, Digital, Аналитика',
    selectedPlan: 'pro',
  },
  {
    id: 2,
    firstName: 'Иван',
    lastName: 'Петров',
    position: 'Дизайнер',
    experience: '2',
    location: 'Москва',
    skills: 'Figma, Adobe, UI/UX',
    selectedPlan: 'basic',
  },
  {
    id: 3,
    firstName: 'Мария',
    lastName: 'Кузнецова',
    position: 'Event Manager',
    experience: '5',
    location: 'Казань',
    skills: 'Организация мероприятий, коммуникации',
    selectedPlan: 'pro',
  },
];

// Получаем уникальные значения для select
const uniquePositions = Array.from(new Set(mockCandidates.map(c => c.position)));
const uniqueLocations = Array.from(new Set(mockCandidates.map(c => c.location)));
const minExp = Math.min(...mockCandidates.map(c => Number(c.experience)));
const maxExp = Math.max(...mockCandidates.map(c => Number(c.experience)));

type ApplicationStatus = ApiApplicationStatus;
type Application = OutApplicationSchema & {
  candidate?: OutUserSchema;
  vacancy?: Vacancy;
};

const TeamDashboard = () => {
  const navigate = useNavigate();
  const user = useAppSelector(state => state.auth.user);
  const authStatus = useAppSelector(state => state.auth.authStatus);
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [showCreateVacancy, setShowCreateVacancy] = useState(false);
  const [editVacancy, setEditVacancy] = useState<Vacancy | null>(null);
  const [shortlist, setShortlist] = useState<number[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [applicationsLoading, setApplicationsLoading] = useState(true);
  const [applicationsError, setApplicationsError] = useState<string | null>(null);

  useEffect(() => {
    if (authStatus !== 'authenticated' || !user) return;
    // Загрузка вакансий команды с backend
    VacanciesService.getMyVacanciesV1VacanciesMyVacanciesGet()
      .then(vacs => setVacancies(vacs.map(mapOutVacancyToVacancy)))
      .catch(() => setVacancies([]));
    // Загрузка откликов на вакансии команды
    const fetchApplications = async () => {
      setApplicationsLoading(true);
      setApplicationsError(null);
      try {
        // Получаем все отклики на вакансии команды
        const backendApps = await ApplicationsService.getPendingApplicationsV1ApplicationsPendingGet();
        // Получаем вакансии для сопоставления
        const backendVacancies = await VacanciesService.getMyVacanciesV1VacanciesMyVacanciesGet();
        // Для каждого отклика подгружаем кандидата
        const candidateIds = Array.from(new Set(backendApps.map(a => a.candidate_id)));
        const candidateMap: Record<number, OutUserSchema> = {};
        await Promise.all(candidateIds.map(async (cid) => {
          try {
            candidateMap[cid] = await CandidatesService.getCandidateProfileV1CandidatesCandidateIdGet(cid);
          } catch {}
        }));
        // Для каждой заявки сопоставляем кандидата и вакансию
        const apps: Application[] = backendApps.map(app => ({
          ...app,
          candidate: candidateMap[app.candidate_id],
          vacancy: backendVacancies.find(v => v.id === app.vacancy_id) ? mapOutVacancyToVacancy(backendVacancies.find(v => v.id === app.vacancy_id)) : undefined,
        }));
        setApplications(apps);
      } catch (err: any) {
        setApplicationsError(err?.body?.detail || err?.message || 'Failed to load applications');
      } finally {
        setApplicationsLoading(false);
      }
    };
    fetchApplications();
    // Остальной localStorage для shortlist пока оставляем
    const sl = localStorage.getItem(TEAM_SHORTLIST_KEY);
    if (sl) setShortlist(JSON.parse(sl));
  }, [authStatus, user]);

  const handleAddVacancy = async (vac: CreateVacancySchema) => {
    try {
      await VacanciesService.createVacancyV1VacanciesPost(vac);
      const backendVacancies = await VacanciesService.getMyVacanciesV1VacanciesMyVacanciesGet();
      setVacancies(backendVacancies.map(mapOutVacancyToVacancy));
    } catch (err: any) {
      alert('Failed to create vacancy: ' + (err?.body?.detail || err?.message || 'Unknown error'));
    }
  };

  const handleSaveVacancy = async (vac: Vacancy) => {
    try {
      await VacanciesService.updateVacancyV1VacanciesVacancyIdPut(
        Number(vac.id),
        {
          title: vac.role,
          description: vac.description ?? '',
          requirements: vac.requirements,
          location: vac.location,
          position_type: vac.role,
          experience_level: vac.experience_level ?? '',
          expiry_date: vac.expiry,
          salary_min: vac.salaryFrom ? Number(vac.salaryFrom) : null,
          salary_max: vac.salaryTo ? Number(vac.salaryTo) : null,
          status: vac.status as any ?? 'active',
        }
      );
      const backendVacancies = await VacanciesService.getMyVacanciesV1VacanciesMyVacanciesGet();
      setVacancies(backendVacancies.map(mapOutVacancyToVacancy));
    } catch (err: any) {
      alert('Failed to update vacancy: ' + (err?.body?.detail || err?.message || 'Unknown error'));
    }
  };

  const handleDeleteVacancy = (id: string) => {
    if (window.confirm("Are you sure you want to delete this vacancy?")) {
      const updated = vacancies.filter(v => v.id !== id);
      setVacancies(updated);
      localStorage.setItem(TEAM_VACANCIES_KEY, JSON.stringify(updated));
    }
  };

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

  const updateApplicationStatus = async (id: number, status: ApplicationStatus) => {
    try {
      await ApplicationsService.updateApplicationStatusV1ApplicationsApplicationIdStatusPatch(id, { status });
      const updated = applications.map(app => app.id === id ? { ...app, status } : app);
      setApplications(updated);
    } catch (err: any) {
      alert('Failed to update application status: ' + (err?.body?.detail || err?.message || 'Unknown error'));
    }
  };

  const [candidateFilters, setCandidateFilters] = useState({
    name: '',
    position: '',
    experienceRange: [minExp, maxExp],
    location: '',
    skills: '',
  });

  const filteredCandidates = mockCandidates.filter(c => {
    const matchesName = candidateFilters.name === '' || (`${c.firstName} ${c.lastName}`.toLowerCase().includes(candidateFilters.name.toLowerCase()));
    const matchesPosition = candidateFilters.position === '' || c.position === candidateFilters.position;
    const exp = Number(c.experience);
    const matchesExperience = exp >= candidateFilters.experienceRange[0] && exp <= candidateFilters.experienceRange[1];
    const matchesLocation = candidateFilters.location === '' || c.location === candidateFilters.location;
    const matchesSkills = candidateFilters.skills === '' || (c.skills && c.skills.toLowerCase().includes(candidateFilters.skills.toLowerCase()));
    return matchesName && matchesPosition && matchesExperience && matchesLocation && matchesSkills;
  });

  return (
    <div className="min-h-screen bg-black pt-16">
      {/* Hero Section */}
      <section className="relative bg-cover bg-center h-72 flex items-center" style={{ backgroundImage: "url('/assets/football.svg')" }}>
        <div className="absolute inset-0 bg-black bg-opacity-70"></div>
        <div className="relative z-10 px-8">
          <h1 className="text-4xl md:text-6xl font-extrabold uppercase text-white leading-tight">
            Manage<br />
            <span className="text-yellow-300">Your Team</span><br />
            in Sport
          </h1>
          <p className="mt-4 text-lg text-white max-w-xl">
            Welcome to your team dashboard. Here you can manage your club profile, post vacancies, and find the best candidates in sport.
          </p>
          <button className="mt-6 bg-yellow-300 text-black font-bold px-8 py-3 rounded hover:bg-yellow-400 transition" onClick={() => navigate('/team/profile/edit')}>
            Edit Profile
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
            <div className="text-4xl font-extrabold text-black">{vacancies.length}</div>
            <div className="text-lg text-gray-700 mt-2">Vacancies</div>
          </div>
          <div className="bg-white rounded shadow p-8 text-center">
            <div className="text-4xl font-extrabold text-black">{filteredCandidates.length}</div>
            <div className="text-lg text-gray-700 mt-2">Candidates</div>
          </div>
          <div className="bg-white rounded shadow p-8 text-center">
            <div className="text-4xl font-extrabold text-black">{applications.length}</div>
            <div className="text-lg text-gray-700 mt-2">Applications</div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="w-full h-6 bg-black" style={{ transform: 'skewY(3deg)' }}></div>

      {/* Team Profile Section */}
      <section className="bg-black py-12 px-8">
        <h2 className="text-3xl font-bold text-yellow-300 mb-8 uppercase">Team Profile</h2>
        {authStatus === 'pending' ? (
          <div className="text-yellow-300 text-lg font-bold">Loading profile...</div>
        ) : !user ? (
          <div className="text-red-500 text-lg font-bold">Not authenticated</div>
        ) : user.role !== 'team' ? (
          <div className="text-red-500 text-lg font-bold">Not a team user.</div>
        ) : (
          <div className="flex flex-wrap gap-10 items-center">
            <div className="space-y-2 text-white text-lg">
              <div><b>Team Name:</b> {user.club_name || (user.first_name + ' ' + user.last_name)}</div>
              <div><b>Email:</b> {user.email}</div>
              <div><b>Location:</b> {user.location || '-'}</div>
              <div><b>Contact Phone:</b> {user.contact_phone || '-'}</div>
              <div><b>Status:</b> {user.is_active ? 'Active' : 'Inactive'}</div>
              <div><b>Approved:</b> {user.is_approved ? 'Yes' : 'No'}</div>
              <div><b>Email Verified:</b> {user.email_verified ? 'Yes' : 'No'}</div>
            </div>
            {/* Логотип, если есть */}
            {user.logo_file_path && (
              <div className="ml-auto">
                <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                  <img src={user.logo_file_path} alt="Logo" className="object-cover w-full h-full" />
                </div>
              </div>
            )}
            <button className="rounded px-6 py-3 bg-yellow-300 text-black font-bold hover:bg-yellow-400 transition" onClick={() => navigate('/team/profile/edit')}>
              Edit Profile
            </button>
          </div>
        )}
        </section>

      {/* Divider */}
      <div className="w-full h-6 bg-yellow-300" style={{ transform: 'skewY(-3deg)' }}></div>

      {/* Vacancies Section */}
      <section className="bg-yellow-300 py-12 px-8">
        <h2 className="text-3xl font-bold text-black mb-8 uppercase">Vacancies</h2>
        <button className="rounded px-6 py-3 bg-black text-yellow-300 font-bold hover:bg-yellow-400 hover:text-black transition mb-6" onClick={() => setShowCreateVacancy(true)}>Create Vacancy</button>
          {vacancies.length === 0 ? (
          <div className="text-gray-700 mb-4">No vacancies yet.</div>
          ) : (
            <div className="flex flex-col gap-4 mb-4">
              {vacancies.map(vac => {
                let salaryStr = "";
                if (vac.salaryFrom && vac.salaryTo) salaryStr = `from ${vac.salaryFrom} to ${vac.salaryTo}`;
                else if (vac.salaryFrom) salaryStr = `from ${vac.salaryFrom}`;
                else if (vac.salaryTo) salaryStr = `to ${vac.salaryTo}`;
                let locationStr = vac.anyLocation ? "Any location (Remote)" : (vac.location || "");
                return (
                <div key={vac.id} className="bg-white border rounded-lg p-4 flex flex-col md:flex-row md:items-center gap-2">
                    <div className="flex-1">
                      <div className="font-semibold text-lg">{vac.role}</div>
                      <div className="text-gray-600 text-sm">{vac.requirements}</div>
                      <div className="text-gray-500 text-xs mt-1">{salaryStr && <>Salary: {salaryStr} | </>}{locationStr && <>Location: {locationStr} | </>}Expiry: {vac.expiry}</div>
                    </div>
                    <div className="flex gap-2">
                    <button className="px-3 py-1 rounded bg-yellow-300 text-black text-sm font-bold hover:bg-yellow-400 transition" onClick={() => { setEditVacancy(vac); setShowCreateVacancy(true); }}>Edit</button>
                      <button className="px-3 py-1 rounded bg-red-500 text-white text-sm hover:bg-red-600" onClick={() => handleDeleteVacancy(vac.id)}>Delete</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {showCreateVacancy && (
            <CreateVacancyForm
              onClose={() => { setShowCreateVacancy(false); setEditVacancy(null); }}
              onAdd={handleAddVacancy}
              onSave={handleSaveVacancy}
              vacancy={editVacancy || undefined}
            />
          )}
        </section>

      {/* Divider */}
      <div className="w-full h-6 bg-black" style={{ transform: 'skewY(3deg)' }}></div>

      {/* Search Candidates Section */}
      <section className="bg-black py-12 px-8">
        <h2 className="text-3xl font-bold text-yellow-300 mb-8 uppercase">Search Candidates</h2>
          <form className="flex flex-wrap gap-4 mb-6 items-center" onSubmit={e => e.preventDefault()}>
          <input value={candidateFilters.name} onChange={e => setCandidateFilters(f => ({ ...f, name: e.target.value }))} placeholder="Name" className="flex-1 min-w-[140px] rounded-lg border border-black px-3 py-2 text-base" />
          <select value={candidateFilters.position} onChange={e => setCandidateFilters(f => ({ ...f, position: e.target.value }))} className="min-w-[120px] rounded-lg border border-black px-3 py-2 text-base">
              <option value="">Role</option>
              {uniquePositions.map(pos => <option key={pos} value={pos}>{pos}</option>)}
            </select>
          <select value={candidateFilters.location} onChange={e => setCandidateFilters(f => ({ ...f, location: e.target.value }))} className="min-w-[110px] rounded-lg border border-black px-3 py-2 text-base">
              <option value="">Location</option>
              {uniqueLocations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
            </select>
            <div className="flex flex-col min-w-[170px]">
            <label className="text-xs text-gray-400 mb-1">Experience (years)</label>
              <Range
                step={1}
                min={minExp}
                max={maxExp}
                values={candidateFilters.experienceRange}
                onChange={vals => setCandidateFilters(f => ({ ...f, experienceRange: vals }))}
                renderTrack={({ props, children }) => (
                <div {...props} className="h-2 w-full rounded bg-yellow-200 flex items-center" style={{ margin: '0 8px' }}>
                  <div className="h-2 rounded bg-yellow-400" style={{ width: `${((candidateFilters.experienceRange[1] - candidateFilters.experienceRange[0]) / (maxExp - minExp) * 100) || 0}%`, marginLeft: `${((candidateFilters.experienceRange[0] - minExp) / (maxExp - minExp) * 100) || 0}%` }} />
                    {children}
                  </div>
                )}
                renderThumb={({ props, index }) => {
                  const { key, ...rest } = props;
                  return (
                  <div key={key} {...rest} className="w-5 h-5 bg-yellow-400 rounded-full shadow border-2 border-white flex items-center justify-center focus:outline-none" style={{ ...rest.style }}>
                    <span className="text-xs text-black select-none">{candidateFilters.experienceRange[index]}</span>
                    </div>
                  );
                }}
              />
            </div>
          <input value={candidateFilters.skills} onChange={e => setCandidateFilters(f => ({ ...f, skills: e.target.value }))} placeholder="Skills" className="min-w-[110px] rounded-lg border border-black px-3 py-2 text-base" />
          </form>
          <div className="flex flex-col gap-5">
            {filteredCandidates.length === 0 ? (
            <div className="text-gray-700 bg-white rounded-xl p-10 text-center">No candidates found</div>
            ) : (
              filteredCandidates.map(c => (
              <div key={c.id} className="bg-white rounded-xl shadow-sm p-6 flex flex-wrap items-center gap-6">
                  <div className="flex-1 min-w-[200px]">
                  <div className="font-semibold text-lg text-black">{c.firstName} {c.lastName}</div>
                  <div className="text-yellow-400 font-medium">{c.position}</div>
                    <div className="text-gray-500 text-sm">{c.location} • {c.experience} years • {c.selectedPlan === 'pro' ? 'Pro' : 'Basic'} plan</div>
                  <div className="mt-2 text-black">Skills: {c.skills}</div>
                  </div>
                  <div className="flex flex-col gap-2 text-right min-w-[140px]">
                    <button
                    className={`rounded-lg px-5 py-2 font-semibold transition border-2 ${shortlist.includes(c.id) ? 'bg-yellow-300 text-black border-yellow-400' : 'bg-white text-yellow-400 border-yellow-300 hover:bg-yellow-50'}`}
                      onClick={() => toggleShortlist(c.id)}
                    >
                    {shortlist.includes(c.id) ? 'In shortlist ✓' : 'Add to shortlist'}
                    </button>
                    <button
                    className="rounded-lg px-5 py-2 bg-yellow-300 text-black font-bold hover:bg-yellow-400 transition"
                      onClick={() => navigate(`/team/candidate/${c.id}`)}
                    >
                    Profile
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

      {/* Divider */}
      <div className="w-full h-6 bg-yellow-300" style={{ transform: 'skewY(-3deg)' }}></div>

      {/* Applications Section */}
      <section className="bg-yellow-300 py-12 px-8">
        <h2 className="text-3xl font-bold text-black mb-8 uppercase">Applications</h2>
        {applicationsLoading ? (
          <div className="text-gray-700 mb-4">Loading applications...</div>
        ) : applicationsError ? (
          <div className="text-red-500 mb-4">{applicationsError}</div>
        ) : applications.length === 0 ? (
          <div className="text-gray-700 mb-4">No applications yet.</div>
          ) : (
            <div className="flex flex-col gap-4 mb-4">
            {applications.map(app => (
              <div key={app.id} className="bg-white border rounded-lg p-4 flex flex-col md:flex-row md:items-center gap-2">
                    <div className="flex-1">
                  <div className="font-semibold text-lg text-black">{app.candidate ? `${app.candidate.first_name} ${app.candidate.last_name}` : `Candidate #${app.candidate_id}`}</div>
                  <div className="text-yellow-400 font-medium">Vacancy: {app.vacancy ? app.vacancy.role : app.vacancy_id}</div>
                      <div className="text-gray-500 text-xs mt-1">Status: <span className={
                    app.status === 'pending' ? 'text-yellow-400' : app.status === 'accepted' ? 'text-green-600' : app.status === 'declined' ? 'text-red-500' : 'text-gray-400'
                      }>{app.status}</span></div>
                    </div>
                    <div className="flex gap-2">
                      <button
                    className="px-3 py-1 rounded bg-yellow-300 text-black text-sm font-bold hover:bg-yellow-400 transition"
                    onClick={() => navigate(`/team/candidate/${app.candidate_id}`)}
                      >Profile</button>
                      {app.status === 'pending' && (
                        <>
                          <button
                            className="px-3 py-1 rounded bg-green-600 text-white text-sm hover:bg-green-700"
                        onClick={() => updateApplicationStatus(app.id, 'accepted' as ApplicationStatus)}
                          >Accept</button>
                          <button
                            className="px-3 py-1 rounded bg-red-500 text-white text-sm hover:bg-red-600"
                        onClick={() => updateApplicationStatus(app.id, 'declined' as ApplicationStatus)}
                          >Decline</button>
                        </>
                      )}
                    </div>
                  </div>
            ))}
            </div>
          )}
        </section>
    </div>
  );
};

export default TeamDashboard; 