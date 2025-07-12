/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { VacancyStatus } from './VacancyStatus';
export type UpdateVacancySchema = {
    title?: (string | null);
    description?: (string | null);
    requirements?: (string | null);
    salary_min?: (number | string | null);
    salary_max?: (number | string | null);
    location?: (string | null);
    position_type?: (string | null);
    experience_level?: (string | null);
    expiry_date?: (string | null);
    status?: (VacancyStatus | null);
};

