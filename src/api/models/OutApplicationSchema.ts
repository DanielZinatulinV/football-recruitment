/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApplicationStatus } from './ApplicationStatus';
export type OutApplicationSchema = {
    vacancy_id: number;
    cover_letter?: (string | null);
    additional_notes?: (string | null);
    id: number;
    candidate_id: number;
    status: ApplicationStatus;
    created_at: string;
    updated_at: string;
};

