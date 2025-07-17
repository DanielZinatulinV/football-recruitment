import { useEffect, useState } from "react";
import { VacanciesService } from '../../../api/services/VacanciesService';
import { ApplicationsService } from '../../../api/services/ApplicationsService';
import { CandidatesService } from '../../../api/services/CandidatesService';
import type { OutUserSchema } from '../../../api/models/OutUserSchema';
import type { OutApplicationSchema } from '../../../api/models/OutApplicationSchema';
import type { OutVacancySchema } from '../../../api/models/OutVacancySchema';
import type { ApplicationStatus as ApiApplicationStatus } from '../../../api/models/ApplicationStatus';
import type { CreateVacancySchema } from '../../../api/models/CreateVacancySchema';
import type { Vacancy, Application } from '../types/team-dashboard.types';
import { useAppSelector } from '../../../redux/store';
import { VacancyStatus } from '../../../api/models/VacancyStatus';

const TEAM_VACANCIES_KEY = "team_vacancies";
const TEAM_SHORTLIST_KEY = "team_shortlist";

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

export function useTeamDashboardData() {
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
            candidateMap[cid as number] = await CandidatesService.getCandidateProfileV1CandidatesCandidateIdGet(cid);
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

  const handleDeleteVacancy = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this vacancy?")) {
      try {
        await VacanciesService.deleteVacancyV1VacanciesVacancyIdDelete(Number(id));
        const backendVacancies = await VacanciesService.getMyVacanciesV1VacanciesMyVacanciesGet();
        setVacancies(backendVacancies.map(mapOutVacancyToVacancy));
      } catch (err: any) {
        alert('Failed to delete vacancy: ' + (err?.body?.detail || err?.message || 'Unknown error'));
      }
    }
  };

  const handleCloseVacancy = async (id: string) => {
    try {
      await VacanciesService.closeVacancyV1VacanciesVacancyIdClosePost(Number(id));
      const backendVacancies = await VacanciesService.getMyVacanciesV1VacanciesMyVacanciesGet();
      setVacancies(backendVacancies.map(mapOutVacancyToVacancy));
    } catch (err: any) {
      alert('Failed to close vacancy: ' + (err?.body?.detail || err?.message || 'Unknown error'));
    }
  };

  const handleOpenVacancy = async (id: string) => {
    try {
      await VacanciesService.updateVacancyV1VacanciesVacancyIdPut(Number(id), { status: VacancyStatus.ACTIVE });
      const backendVacancies = await VacanciesService.getMyVacanciesV1VacanciesMyVacanciesGet();
      setVacancies(backendVacancies.map(mapOutVacancyToVacancy));
    } catch (err: any) {
      alert('Failed to open vacancy: ' + (err?.body?.detail || err?.message || 'Unknown error'));
    }
  };

  const handleDraftVacancy = async (id: string) => {
    try {
      await VacanciesService.updateVacancyV1VacanciesVacancyIdPut(Number(id), { status: VacancyStatus.DRAFT });
      const backendVacancies = await VacanciesService.getMyVacanciesV1VacanciesMyVacanciesGet();
      setVacancies(backendVacancies.map(mapOutVacancyToVacancy));
    } catch (err: any) {
      alert('Failed to archive vacancy: ' + (err?.body?.detail || err?.message || 'Unknown error'));
    }
  };

  const handleRestoreVacancy = async (id: string) => {
    try {
      await VacanciesService.updateVacancyV1VacanciesVacancyIdPut(Number(id), { status: VacancyStatus.CLOSED });
      const backendVacancies = await VacanciesService.getMyVacanciesV1VacanciesMyVacanciesGet();
      setVacancies(backendVacancies.map(mapOutVacancyToVacancy));
    } catch (err: any) {
      alert('Failed to restore vacancy: ' + (err?.body?.detail || err?.message || 'Unknown error'));
    }
  };

  const handleActivateVacancy = async (id: string) => {
    try {
      await VacanciesService.activateVacancyV1VacanciesVacanciesActivatePost(Number(id));
      const backendVacancies = await VacanciesService.getMyVacanciesV1VacanciesMyVacanciesGet();
      setVacancies(backendVacancies.map(mapOutVacancyToVacancy));
    } catch (err: any) {
      alert('Failed to activate vacancy: ' + (err?.body?.detail || err?.message || 'Unknown error'));
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

  const updateApplicationStatus = async (id: number, status: ApiApplicationStatus) => {
    try {
      await ApplicationsService.updateApplicationStatusV1ApplicationsApplicationIdStatusPatch(id, { status });
      const updated = applications.map(app => app.id === id ? { ...app, status } : app);
      setApplications(updated);
    } catch (err: any) {
      alert('Failed to update application status: ' + (err?.body?.detail || err?.message || 'Unknown error'));
    }
  };

  return {
    user,
    authStatus,
    vacancies,
    setVacancies,
    showCreateVacancy,
    setShowCreateVacancy,
    editVacancy,
    setEditVacancy,
    shortlist,
    setShortlist,
    applications,
    setApplications,
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
  };
} 