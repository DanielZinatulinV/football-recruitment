/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { VacancyStatus } from './VacancyStatus';
export type OutVacancySchema = {
    title: string;
    description: string;
    requirements: string;
    location: string;
    position_type: string;
    experience_level: string;
    expiry_date: string;
    id: number;
    salary_min?: (string | null);
    salary_max?: (string | null);
    status: VacancyStatus;
    team_id: number;
    created_at: string;
    updated_at: string;
};

