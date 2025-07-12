/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserRole } from './UserRole';
export type OutUserSchema = {
    first_name: string;
    last_name: string;
    email: string;
    role: UserRole;
    id: number;
    is_active: boolean;
    is_approved: boolean;
    email_verified?: boolean;
    created_at: string;
    updated_at: string;
    birthdate?: (string | null);
    position?: (string | null);
    experience_level?: (string | null);
    qualification?: (string | null);
    location?: (string | null);
    cv_file_path?: (string | null);
    club_name?: (string | null);
    contact_phone?: (string | null);
    logo_file_path?: (string | null);
};

