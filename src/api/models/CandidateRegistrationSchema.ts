/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserRole } from './UserRole';
export type CandidateRegistrationSchema = {
    first_name: string;
    last_name: string;
    email: string;
    role: UserRole;
    password: string;
    birthdate?: (string | null);
    position?: (string | null);
    experience_level?: (string | null);
    qualification?: (string | null);
    location?: (string | null);
};

