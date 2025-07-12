/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreatePaymentIntentSchema } from '../models/CreatePaymentIntentSchema';
import type { OutMembershipSchema } from '../models/OutMembershipSchema';
import type { PaymentConfirmationSchema } from '../models/PaymentConfirmationSchema';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class MembershipsService {
    /**
     * Create Payment Intent
     * Create a Stripe payment intent for membership subscription.
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static createPaymentIntentV1MembershipsCreatePaymentIntentPost(
        requestBody: CreatePaymentIntentSchema,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/memberships/create-payment-intent',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Confirm Payment
     * Confirm payment and activate membership.
     * @param requestBody
     * @returns OutMembershipSchema Successful Response
     * @throws ApiError
     */
    public static confirmPaymentV1MembershipsConfirmPaymentPost(
        requestBody: PaymentConfirmationSchema,
    ): CancelablePromise<OutMembershipSchema> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/memberships/confirm-payment',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get My Membership
     * Get current user's active membership.
     * @returns OutMembershipSchema Successful Response
     * @throws ApiError
     */
    public static getMyMembershipV1MembershipsMyMembershipGet(): CancelablePromise<OutMembershipSchema> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/memberships/my-membership',
        });
    }
    /**
     * Get Membership History
     * Get membership history for current user.
     * @returns OutMembershipSchema Successful Response
     * @throws ApiError
     */
    public static getMembershipHistoryV1MembershipsHistoryGet(): CancelablePromise<Array<OutMembershipSchema>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/memberships/history',
        });
    }
    /**
     * Upgrade Membership
     * Upgrade membership plan.
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static upgradeMembershipV1MembershipsUpgradePost(
        requestBody: CreatePaymentIntentSchema,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/memberships/upgrade',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Membership Plans
     * Get available membership plans and pricing.
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getMembershipPlansV1MembershipsPlansGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/memberships/plans',
        });
    }
    /**
     * Stripe Webhook
     * Handle Stripe webhooks for payment confirmations.
     * @returns any Successful Response
     * @throws ApiError
     */
    public static stripeWebhookV1MembershipsWebhookPost(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/memberships/webhook',
        });
    }
}
