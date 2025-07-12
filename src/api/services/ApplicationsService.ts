/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApplicationStatusUpdateSchema } from '../models/ApplicationStatusUpdateSchema';
import type { CreateApplicationSchema } from '../models/CreateApplicationSchema';
import type { OutApplicationSchema } from '../models/OutApplicationSchema';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ApplicationsService {
    /**
     * Apply To Vacancy
     * Apply to a vacancy.
     * @param requestBody
     * @returns OutApplicationSchema Successful Response
     * @throws ApiError
     */
    public static applyToVacancyV1ApplicationsPost(
        requestBody: CreateApplicationSchema,
    ): CancelablePromise<OutApplicationSchema> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/applications',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get My Applications
     * Get all applications for the current candidate.
     * @returns OutApplicationSchema Successful Response
     * @throws ApiError
     */
    public static getMyApplicationsV1ApplicationsMyApplicationsGet(): CancelablePromise<Array<OutApplicationSchema>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/applications/my-applications',
        });
    }
    /**
     * Get Pending Applications
     * Get all pending applications for the current team's vacancies.
     * @returns OutApplicationSchema Successful Response
     * @throws ApiError
     */
    public static getPendingApplicationsV1ApplicationsPendingGet(): CancelablePromise<Array<OutApplicationSchema>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/applications/pending',
        });
    }
    /**
     * Get Applications For Vacancy
     * Get all applications for a specific vacancy.
     * @param vacancyId
     * @returns OutApplicationSchema Successful Response
     * @throws ApiError
     */
    public static getApplicationsForVacancyV1ApplicationsVacancyVacancyIdGet(
        vacancyId: number,
    ): CancelablePromise<Array<OutApplicationSchema>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/applications/vacancy/{vacancy_id}',
            path: {
                'vacancy_id': vacancyId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Application Status
     * Update application status (accept/decline).
     * @param applicationId
     * @param requestBody
     * @returns OutApplicationSchema Successful Response
     * @throws ApiError
     */
    public static updateApplicationStatusV1ApplicationsApplicationIdStatusPatch(
        applicationId: number,
        requestBody: ApplicationStatusUpdateSchema,
    ): CancelablePromise<OutApplicationSchema> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/v1/applications/{application_id}/status',
            path: {
                'application_id': applicationId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Application
     * Get a specific application.
     * @param applicationId
     * @returns OutApplicationSchema Successful Response
     * @throws ApiError
     */
    public static getApplicationV1ApplicationsApplicationIdGet(
        applicationId: number,
    ): CancelablePromise<OutApplicationSchema> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/applications/{application_id}',
            path: {
                'application_id': applicationId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Withdraw Application
     * Withdraw an application.
     * @param applicationId
     * @returns void
     * @throws ApiError
     */
    public static withdrawApplicationV1ApplicationsApplicationIdDelete(
        applicationId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/v1/applications/{application_id}',
            path: {
                'application_id': applicationId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
