/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MembershipPlan } from './MembershipPlan';
import type { MembershipStatus } from './MembershipStatus';
export type OutMembershipSchema = {
    user_id: number;
    plan_type: MembershipPlan;
    price: string;
    start_date: string;
    renewal_date: string;
    id: number;
    status: MembershipStatus;
    stripe_subscription_id?: (string | null);
    stripe_payment_intent_id?: (string | null);
    created_at: string;
    updated_at: string;
};

