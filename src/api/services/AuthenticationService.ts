/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Body_login_v1_auth_login_post } from '../models/Body_login_v1_auth_login_post';
import type { CandidateRegistrationSchema } from '../models/CandidateRegistrationSchema';
import type { OutUserSchema } from '../models/OutUserSchema';
import type { TeamRegistrationSchema } from '../models/TeamRegistrationSchema';
import type { Token } from '../models/Token';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthenticationService {
    /**
     * Register Candidate
     * Register a new candidate.
     * @param requestBody
     * @returns OutUserSchema Successful Response
     * @throws ApiError
     */
    public static registerCandidateV1AuthRegisterCandidatePost(
        requestBody: CandidateRegistrationSchema,
    ): CancelablePromise<OutUserSchema> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/auth/register-candidate',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Register Team
     * Register a new team.
     * @param requestBody
     * @returns OutUserSchema Successful Response
     * @throws ApiError
     */
    public static registerTeamV1AuthRegisterTeamPost(
        requestBody: TeamRegistrationSchema,
    ): CancelablePromise<OutUserSchema> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/auth/register-team',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Login
     * Login user with email and password.
     * @param formData
     * @returns Token Successful Response
     * @throws ApiError
     */
    public static loginV1AuthLoginPost(
        formData: Body_login_v1_auth_login_post,
    ): CancelablePromise<Token> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/auth/login',
            formData: formData,
            mediaType: 'application/x-www-form-urlencoded',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Users Me
     * Get current user information.
     * @returns OutUserSchema Successful Response
     * @throws ApiError
     */
    public static readUsersMeV1AuthMeGet(): CancelablePromise<OutUserSchema> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/auth/me',
        });
    }
    /**
     * Verify Email
     * Verify email code and activate user.
     * @param email
     * @param code
     * @returns any Successful Response
     * @throws ApiError
     */
    public static verifyEmailV1AuthVerifyEmailPost(
        email: string,
        code: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/auth/verify-email',
            query: {
                'email': email,
                'code': code,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
