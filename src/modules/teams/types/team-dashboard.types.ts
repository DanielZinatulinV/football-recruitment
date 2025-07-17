export type Vacancy = {
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

export type Candidate = {
  id: number;
  firstName: string;
  lastName: string;
  position: string;
  experience: string;
  location: string;
  skills: string;
  selectedPlan: string;
};

export type Application = {
  id: number;
  candidate?: {
    first_name?: string;
    last_name?: string;
  };
  candidate_id: number;
  vacancy?: Vacancy;
  vacancy_id: number;
  status: string;
}; 