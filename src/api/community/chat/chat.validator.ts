import express from 'express';
import { ConversationDomainModel } from '../../../domain.types/community/chat/conversation.domain.model';
import { ChatMessageDomainModel } from '../../../domain.types/community/chat/chat.message.domain.model';
import { BaseValidator, Where } from '../../base.validator';
import { uuid } from '../../../domain.types/miscellaneous/system.types';
import { ConversationSearchFilters } from '../../../domain.types/community/chat/conversation.search.types';

///////////////////////////////////////////////////////////////////////////////////////

export class ChatValidator extends BaseValidator {

    constructor() {
        super();
    }

    getCreateConversationDomainModel = (requestBody: any, currentUserId: uuid): ConversationDomainModel => {

        const createModel: ConversationDomainModel = {
            IsGroupConversation : requestBody.IsGroupConversation ?? false,
            Topic               : requestBody.Topic ?? null,
            Marked              : requestBody.Marked ?? false,
            InitiatingUserId    : currentUserId,
            OtherUserId         : requestBody.OtherUserId ?? null,
            Users               : requestBody.Users ?? null,
        };

        return createModel;
    };

    getUpdateConversationDomainModel = (requestBody: any): ConversationDomainModel => {

        const updateModel: ConversationDomainModel = {
            Topic  : requestBody.Topic ?? null,
            Marked : requestBody.Marked ?? null,
        };

        return updateModel;
    };

    private async validateConversationCreateBody(request) {
        await this.validateBoolean(request, 'IsGroupConversation', Where.Body, false, false);
        await this.validateString(request, 'Topic', Where.Body, false, false);
        await this.validateBoolean(request, 'Marked', Where.Body, false, false);
        await this.validateUuid(request, 'OtherUserId', Where.Body, false, false);
        await this.validateArray(request, 'Users', Where.Body, false, false);
        await this.validateRequest(request);
    }

    private async validateConversationUpdateBody(request) {
        await this.validateString(request, 'Topic', Where.Body, false, false);
        await this.validateBoolean(request, 'Marked', Where.Body, false, false);
        await this.validateRequest(request);
    }

    startConversation = async (request: express.Request): Promise<ConversationDomainModel> => {
        await this.validateConversationCreateBody(request);
        return this.getCreateConversationDomainModel(request.body, request.currentUser.UserId);
    };

    updateConversation = async (request: express.Request): Promise<ConversationDomainModel> => {
        await this.validateConversationUpdateBody(request);
        const domainModel = this.getUpdateConversationDomainModel(request.body);
        domainModel.id = await this.getParamUuid(request, 'conversationId');
        return domainModel;
    };

    getCreateMessageDomainModel =
        (requestBody: any, currentUserId: uuid, conversationId: uuid): ChatMessageDomainModel => {

            const createModel: ChatMessageDomainModel = {
                ConversationId : conversationId,
                SenderId       : requestBody.SenderId ?? currentUserId,
                Message        : requestBody.Message ?? null,
            };

            return createModel;
        };

    getUpdateMessageDomainModel = (requestBody: any): ChatMessageDomainModel => {

        const updateModel: ChatMessageDomainModel = {
            Message : requestBody.Message ?? null,
        };

        return updateModel;
    };

    private async validateMessageCreateBody(request) {
        await this.validateUuid(request, 'SenderId', Where.Body, false, false);
        await this.validateString(request, 'Message', Where.Body, true, false);
        await this.validateRequest(request);
    }

    private async validateMessageUpdateBody(request) {
        await this.validateString(request, 'Message', Where.Body, true, false);
        await this.validateRequest(request);
    }

    sendMessage = async (request: express.Request): Promise<ChatMessageDomainModel> => {
        await this.validateMessageCreateBody(request);
        return this.getCreateMessageDomainModel(
            request.body, request.currentUser.UserId, request.params.conversationId);
    };

    updateMessage = async (request: express.Request): Promise<ChatMessageDomainModel> => {
        await this.validateMessageUpdateBody(request);
        const domainModel = this.getUpdateMessageDomainModel(request.body);
        domainModel.id = await this.getParamUuid(request, 'messageId');
        return domainModel;
    };

    private async validateConversationSearchFilters(request) {
        await this.validateBoolean(request, 'isGroupConversation', Where.Body, false, false);
        await this.validateString(request, 'topic', Where.Body, false, false);
        await this.validateBoolean(request, 'marked', Where.Body, false, false);
        await this.validateRequest(request);
    }

    getConversationSearchFilters = (request: express.Request): ConversationSearchFilters => {

        var filters: ConversationSearchFilters = {
            Topic               : request.params.topic,
            Marked              : request.params.marked === 'true' ? true : false,
            IsGroupconversation : request.params.isGroupconversation === 'true' ? true : false,
        };

        return this.updateBaseSearchFilters(request, filters);
    };

    searchUserConversations = async (request: express.Request): Promise<ConversationSearchFilters> => {
        await this.validateConversationSearchFilters(request);
        const filters = this.getConversationSearchFilters(request);
        return filters;
    };

}
