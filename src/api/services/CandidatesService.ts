/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Body_upload_cv_v1_candidates_upload_cv_post } from '../models/Body_upload_cv_v1_candidates_upload_cv_post';
import type { OutUserSchema } from '../models/OutUserSchema';
import type { PaginatedUserSchema } from '../models/PaginatedUserSchema';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CandidatesService {
    /**
     * Search Candidates
     * Search and browse candidates.
     * @param role Filter by role/position
     * @param location Filter by location
     * @param experienceLevel Filter by experience level
     * @param position Filter by position
     * @param limit
     * @param offset
     * @returns PaginatedUserSchema Successful Response
     * @throws ApiError
     */
    public static searchCandidatesV1CandidatesGet(
        role?: (string | null),
        location?: (string | null),
        experienceLevel?: (string | null),
        position?: (string | null),
        limit: number = 20,
        offset?: number,
    ): CancelablePromise<PaginatedUserSchema> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/candidates',
            query: {
                'role': role,
                'location': location,
                'experience_level': experienceLevel,
                'position': position,
                'limit': limit,
                'offset': offset,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Candidates With Active Memberships
     * Get candidates with active memberships (premium feature).
     * @returns OutUserSchema Successful Response
     * @throws ApiError
     */
    public static getCandidatesWithActiveMembershipsV1CandidatesWithMembershipsGet(): CancelablePromise<Array<OutUserSchema>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/candidates/with-memberships',
        });
    }
    /**
     * Get Candidate Profile
     * Get detailed candidate profile.
     * @param candidateId
     * @returns OutUserSchema Successful Response
     * @throws ApiError
     */
    public static getCandidateProfileV1CandidatesCandidateIdGet(
        candidateId: number,
    ): CancelablePromise<OutUserSchema> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/candidates/{candidate_id}',
            path: {
                'candidate_id': candidateId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Candidate Cv
     * Get candidate CV file (if uploaded).
     * @param candidateId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getCandidateCvV1CandidatesCandidateIdCvGet(
        candidateId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/candidates/{candidate_id}/cv',
            path: {
                'candidate_id': candidateId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Search Candidates By Position
     * Search candidates by specific position.
     * @param positionName
     * @param limit
     * @returns OutUserSchema Successful Response
     * @throws ApiError
     */
    public static searchCandidatesByPositionV1CandidatesSearchByPositionPositionNameGet(
        positionName: string,
        limit: number = 20,
    ): CancelablePromise<Array<OutUserSchema>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/candidates/search/by-position/{position_name}',
            path: {
                'position_name': positionName,
            },
            query: {
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Featured Candidates
     * Get featured candidates (with premium memberships).
     * @param limit
     * @returns OutUserSchema Successful Response
     * @throws ApiError
     */
    public static getFeaturedCandidatesV1CandidatesFeaturedGet(
        limit: number = 10,
    ): CancelablePromise<Array<OutUserSchema>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/candidates/featured',
            query: {
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Upload Cv
     * Upload CV file for the current candidate.
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    public static uploadCvV1CandidatesUploadCvPost(
        formData: Body_upload_cv_v1_candidates_upload_cv_post,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/candidates/upload-cv',
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Download Cv
     * Download a candidate's CV file.
     * @param candidateId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static downloadCvV1CandidatesDownloadCvCandidateIdGet(
        candidateId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/candidates/download-cv/{candidate_id}',
            path: {
                'candidate_id': candidateId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get My Cv
     * Get current candidate's CV information.
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getMyCvV1CandidatesMyCvGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/candidates/my-cv',
        });
    }
    /**
     * Delete My Cv
     * Delete current candidate's CV file.
     * @returns any Successful Response
     * @throws ApiError
     */
    public static deleteMyCvV1CandidatesMyCvDelete(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/v1/candidates/my-cv',
        });
    }
}
