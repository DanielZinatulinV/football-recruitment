/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OutUserSchema } from '../models/OutUserSchema';
import type { PaginatedUserSchema } from '../models/PaginatedUserSchema';
import type { UpdateUserSchema } from '../models/UpdateUserSchema';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminService {
    /**
     * Get Pending Teams
     * Get all teams pending approval.
     * @returns OutUserSchema Successful Response
     * @throws ApiError
     */
    public static getPendingTeamsV1AdminTeamsPendingGet(): CancelablePromise<Array<OutUserSchema>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/admin/teams/pending',
        });
    }
    /**
     * Approve Team
     * Approve a team.
     * @param teamId
     * @returns OutUserSchema Successful Response
     * @throws ApiError
     */
    public static approveTeamV1AdminTeamsTeamIdApprovePost(
        teamId: number,
    ): CancelablePromise<OutUserSchema> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/admin/teams/{team_id}/approve',
            path: {
                'team_id': teamId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get All Users
     * Get all users with pagination.
     * @param limit
     * @param offset
     * @returns PaginatedUserSchema Successful Response
     * @throws ApiError
     */
    public static getAllUsersV1AdminUsersGet(
        limit: number = 20,
        offset?: number,
    ): CancelablePromise<PaginatedUserSchema> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/admin/users',
            query: {
                'limit': limit,
                'offset': offset,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get User By Id
     * Get a specific user by ID.
     * @param userId
     * @returns OutUserSchema Successful Response
     * @throws ApiError
     */
    public static getUserByIdV1AdminUsersUserIdGet(
        userId: number,
    ): CancelablePromise<OutUserSchema> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/admin/users/{user_id}',
            path: {
                'user_id': userId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update User
     * Update user information.
     * @param userId
     * @param requestBody
     * @returns OutUserSchema Successful Response
     * @throws ApiError
     */
    public static updateUserV1AdminUsersUserIdPatch(
        userId: number,
        requestBody: UpdateUserSchema,
    ): CancelablePromise<OutUserSchema> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/v1/admin/users/{user_id}',
            path: {
                'user_id': userId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete User
     * Delete a user account (use with caution).
     * @param userId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static deleteUserV1AdminUsersUserIdDelete(
        userId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/v1/admin/users/{user_id}',
            path: {
                'user_id': userId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Activate User
     * Activate a user account.
     * @param userId
     * @returns OutUserSchema Successful Response
     * @throws ApiError
     */
    public static activateUserV1AdminUsersUserIdActivatePost(
        userId: number,
    ): CancelablePromise<OutUserSchema> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/admin/users/{user_id}/activate',
            path: {
                'user_id': userId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Deactivate User
     * Deactivate a user account.
     * @param userId
     * @returns OutUserSchema Successful Response
     * @throws ApiError
     */
    public static deactivateUserV1AdminUsersUserIdDeactivatePost(
        userId: number,
    ): CancelablePromise<OutUserSchema> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/admin/users/{user_id}/deactivate',
            path: {
                'user_id': userId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Revenue Stats
     * Get revenue statistics.
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getRevenueStatsV1AdminRevenueGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/admin/revenue',
        });
    }
    /**
     * Get Platform Stats
     * Get platform statistics.
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getPlatformStatsV1AdminStatsGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/admin/stats',
        });
    }
}
