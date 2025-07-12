/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateMessageSchema } from '../models/CreateMessageSchema';
import type { MessageThreadSchema } from '../models/MessageThreadSchema';
import type { OutMessageSchema } from '../models/OutMessageSchema';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class MessagesService {
    /**
     * Send Message
     * Send a message to another user.
     * @param requestBody
     * @returns OutMessageSchema Successful Response
     * @throws ApiError
     */
    public static sendMessageV1MessagesPost(
        requestBody: CreateMessageSchema,
    ): CancelablePromise<OutMessageSchema> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/messages',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Message Threads
     * Get message threads for current user.
     * @returns MessageThreadSchema Successful Response
     * @throws ApiError
     */
    public static getMessageThreadsV1MessagesThreadsGet(): CancelablePromise<Array<MessageThreadSchema>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/messages/threads',
        });
    }
    /**
     * Get Conversation
     * Get conversation with a specific user.
     * @param userId
     * @returns OutMessageSchema Successful Response
     * @throws ApiError
     */
    public static getConversationV1MessagesConversationUserIdGet(
        userId: number,
    ): CancelablePromise<Array<OutMessageSchema>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/messages/conversation/{user_id}',
            path: {
                'user_id': userId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Unread Messages
     * Get all unread messages for current user.
     * @returns OutMessageSchema Successful Response
     * @throws ApiError
     */
    public static getUnreadMessagesV1MessagesUnreadGet(): CancelablePromise<Array<OutMessageSchema>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/messages/unread',
        });
    }
    /**
     * Mark Message As Read
     * Mark a message as read.
     * @param messageId
     * @returns OutMessageSchema Successful Response
     * @throws ApiError
     */
    public static markMessageAsReadV1MessagesMessageIdReadPatch(
        messageId: number,
    ): CancelablePromise<OutMessageSchema> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/v1/messages/{message_id}/read',
            path: {
                'message_id': messageId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Message
     * Get a specific message.
     * @param messageId
     * @returns OutMessageSchema Successful Response
     * @throws ApiError
     */
    public static getMessageV1MessagesMessageIdGet(
        messageId: number,
    ): CancelablePromise<OutMessageSchema> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/messages/{message_id}',
            path: {
                'message_id': messageId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Reply To Message
     * Reply to a specific message.
     * @param messageId
     * @param requestBody
     * @returns OutMessageSchema Successful Response
     * @throws ApiError
     */
    public static replyToMessageV1MessagesMessageIdReplyPost(
        messageId: number,
        requestBody: CreateMessageSchema,
    ): CancelablePromise<OutMessageSchema> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/messages/{message_id}/reply',
            path: {
                'message_id': messageId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Message Replies
     * Get all replies to a message.
     * @param messageId
     * @returns OutMessageSchema Successful Response
     * @throws ApiError
     */
    public static getMessageRepliesV1MessagesMessageIdRepliesGet(
        messageId: number,
    ): CancelablePromise<Array<OutMessageSchema>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/messages/{message_id}/replies',
            path: {
                'message_id': messageId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
