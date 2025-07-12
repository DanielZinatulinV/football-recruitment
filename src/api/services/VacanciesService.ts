/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateVacancySchema } from '../models/CreateVacancySchema';
import type { OutVacancySchema } from '../models/OutVacancySchema';
import type { PaginatedVacancySchema } from '../models/PaginatedVacancySchema';
import type { UpdateVacancySchema } from '../models/UpdateVacancySchema';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class VacanciesService {
    /**
     * Create Vacancy
     * Create a new vacancy.
     * @param requestBody
     * @returns OutVacancySchema Successful Response
     * @throws ApiError
     */
    public static createVacancyV1VacanciesPost(
        requestBody: CreateVacancySchema,
    ): CancelablePromise<OutVacancySchema> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/vacancies',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * List Vacancies
     * List all active vacancies with optional filters.
     * @param role Filter by role/position
     * @param location Filter by location
     * @param salaryMin Minimum salary
     * @param salaryMax Maximum salary
     * @param experienceLevel Filter by experience level
     * @param positionType Filter by position type
     * @param limit
     * @param offset
     * @returns PaginatedVacancySchema Successful Response
     * @throws ApiError
     */
    public static listVacanciesV1VacanciesGet(
        role?: (string | null),
        location?: (string | null),
        salaryMin?: (number | null),
        salaryMax?: (number | null),
        experienceLevel?: (string | null),
        positionType?: (string | null),
        limit: number = 20,
        offset?: number,
    ): CancelablePromise<PaginatedVacancySchema> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/vacancies',
            query: {
                'role': role,
                'location': location,
                'salary_min': salaryMin,
                'salary_max': salaryMax,
                'experience_level': experienceLevel,
                'position_type': positionType,
                'limit': limit,
                'offset': offset,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get My Vacancies
     * Get all vacancies for the current team.
     * @returns OutVacancySchema Successful Response
     * @throws ApiError
     */
    public static getMyVacanciesV1VacanciesMyVacanciesGet(): CancelablePromise<Array<OutVacancySchema>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/vacancies/my-vacancies',
        });
    }
    /**
     * Get Vacancy
     * Get a specific vacancy.
     * @param vacancyId
     * @returns OutVacancySchema Successful Response
     * @throws ApiError
     */
    public static getVacancyV1VacanciesVacancyIdGet(
        vacancyId: number,
    ): CancelablePromise<OutVacancySchema> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/vacancies/{vacancy_id}',
            path: {
                'vacancy_id': vacancyId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Vacancy
     * Update a vacancy.
     * @param vacancyId
     * @param requestBody
     * @returns OutVacancySchema Successful Response
     * @throws ApiError
     */
    public static updateVacancyV1VacanciesVacancyIdPut(
        vacancyId: number,
        requestBody: UpdateVacancySchema,
    ): CancelablePromise<OutVacancySchema> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/v1/vacancies/{vacancy_id}',
            path: {
                'vacancy_id': vacancyId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Vacancy
     * Delete a vacancy.
     * @param vacancyId
     * @returns void
     * @throws ApiError
     */
    public static deleteVacancyV1VacanciesVacancyIdDelete(
        vacancyId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/v1/vacancies/{vacancy_id}',
            path: {
                'vacancy_id': vacancyId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Close Vacancy
     * Close a vacancy.
     * @param vacancyId
     * @returns OutVacancySchema Successful Response
     * @throws ApiError
     */
    public static closeVacancyV1VacanciesVacancyIdClosePost(
        vacancyId: number,
    ): CancelablePromise<OutVacancySchema> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/vacancies/{vacancy_id}/close',
            path: {
                'vacancy_id': vacancyId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
