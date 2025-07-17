import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CreateVacancyForm from "./components/CreateVacancyForm";
import CandidateFilters from "./components/CandidateFilters";
import CandidateCard from "./components/CandidateCard";
import VacancyCard from "./components/VacancyCard";
import ApplicationCard from "./components/ApplicationCard";
import { mockCandidates, uniquePositions, uniqueLocations, minExp, maxExp } from "./utils/candidateMock";
import type { Vacancy, Candidate, Application } from "./types/team-dashboard.types";
import { useTeamDashboardData } from "./hooks/useTeamDashboardData";

const TeamDashboard = () => {
  const navigate = useNavigate();
  const {
    user,
    authStatus,
    vacancies,
    showCreateVacancy,
    setShowCreateVacancy,
    editVacancy,
    setEditVacancy,
    shortlist,
    applications,
    applicationsLoading,
    applicationsError,
    handleAddVacancy,
    handleSaveVacancy,
    handleDeleteVacancy,
    toggleShortlist,
    updateApplicationStatus,
    handleCloseVacancy,
    handleOpenVacancy,
    handleDraftVacancy,
    handleRestoreVacancy,
    handleActivateVacancy,
  } = useTeamDashboardData();

  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      navigate('/login');
    }
  }, [authStatus, navigate]);

  const [candidateFilters, setCandidateFilters] = useState<{
    name: string;
    position: string;
    experienceRange: [number, number];
    location: string;
    skills: string;
  }>({
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
              {vacancies.map(vac => (
                <VacancyCard
                  key={vac.id}
                  vacancy={vac}
                  onEdit={v => { setEditVacancy(v); setShowCreateVacancy(true); }}
                  onClose={handleCloseVacancy}
                  onOpen={handleOpenVacancy}
                  onDraft={handleDraftVacancy}
                  onRestore={handleRestoreVacancy}
                  onActivate={handleActivateVacancy}
                />
              ))}
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

      {/* Accepted Candidates Section */}
      <section className="bg-white py-12 px-8">
        <h2 className="text-3xl font-bold text-black mb-8 uppercase">Accepted Candidates</h2>
        {applicationsLoading ? (
          <div className="text-gray-700 mb-4">Loading accepted candidates...</div>
        ) : (
          (() => {
            const accepted = applications.filter(app => app.status === 'accepted');
            if (accepted.length === 0) {
              return <div className="text-gray-700 mb-4">No accepted candidates yet.</div>;
            }
            return (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-xl shadow">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left">Name</th>
                      <th className="px-4 py-2 text-left">Vacancy</th>
                      <th className="px-4 py-2 text-left">Experience</th>
                      <th className="px-4 py-2 text-left">Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accepted.map(app => (
                      <tr key={app.id} className="border-t">
                        <td className="px-4 py-2">{app.candidate?.first_name} {app.candidate?.last_name}</td>
                        <td className="px-4 py-2">{app.vacancy?.role}</td>
                        <td className="px-4 py-2">{app.candidate?.experience_level || '-'}</td>
                        <td className="px-4 py-2">{app.candidate?.location || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })()
        )}
      </section>

      {/* Divider */}
      <div className="w-full h-6 bg-black" style={{ transform: 'skewY(3deg)' }}></div>

      {/* Search Candidates Section */}
      <section className="bg-black py-12 px-8">
        <h2 className="text-3xl font-bold text-yellow-300 mb-8 uppercase">Search Candidates</h2>
          <CandidateFilters
            filters={candidateFilters}
            onChange={update => setCandidateFilters(f => ({ ...f, ...update }))}
            uniquePositions={uniquePositions}
            uniqueLocations={uniqueLocations}
            minExp={minExp}
            maxExp={maxExp}
          />
          <div className="flex flex-col gap-5">
            {filteredCandidates.length === 0 ? (
            <div className="text-gray-700 bg-white rounded-xl p-10 text-center">No candidates found</div>
            ) : (
              filteredCandidates.map(c => (
                <CandidateCard
                  key={c.id}
                  candidate={c}
                  inShortlist={shortlist.includes(c.id)}
                  onToggleShortlist={toggleShortlist}
                />
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
              <ApplicationCard
                key={app.id}
                application={app}
                onStatusChange={updateApplicationStatus}
                onProfile={candidateId => navigate(`/team/candidate/${candidateId}`)}
              />
            ))}
            </div>
          )}
        </section>
    </div>
  );
};

export default TeamDashboard; 