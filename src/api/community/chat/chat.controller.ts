import express from 'express';
import { ApiError } from '../../../common/api.error';
import { ResponseHandler } from '../../../common/handlers/response.handler';
import { uuid } from '../../../domain.types/miscellaneous/system.types';
import { ChatService } from '../../../services/community/chat.service';
import { UserService } from '../../../services/users/user/user.service';
import { RoleService } from '../../../services/role/role.service';
import { ChatValidator } from './chat.validator';
import { ConversationDomainModel } from '../../../domain.types/community/chat/conversation.domain.model';
import { Injector } from '../../../startup/injector';

///////////////////////////////////////////////////////////////////////////////////////

export class ChatController {

    //#region member variables and constructors

    _service: ChatService = Injector.Container.resolve(ChatService);

    _roleService: RoleService = Injector.Container.resolve(RoleService);

    _userService: UserService = Injector.Container.resolve(UserService);

    _validator = new ChatValidator();

    //#endregion

    //#region Action methods

    startConversation = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const domainModel = await this._validator.startConversation(request);
            const conversation = await this._service.startConversation(domainModel);
            if (conversation == null) {
                throw new ApiError(400, 'Cannot start conversation!');
            }

            ResponseHandler.success(request, response, 'Conversation started successfully!', 201, {
                Conversation : conversation,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    sendMessage = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const domainModel = await this._validator.sendMessage(request);
            const message = await this._service.sendMessage(domainModel);
            if (message == null) {
                throw new ApiError(400, 'Cannot create chat!');
            }

            ResponseHandler.success(request, response, 'Chat message sent successfully!', 201, {
                ChatMessage : message,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getConversationMessages = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const conversationId = await this._validator.getParamUuid(request, 'conversationId');
            const conversationMessages = await this._service.getConversationMessages(conversationId);
            ResponseHandler.success(request, response, 'Conversation messages retrieved successfully!', 200, {
                ConversationMessages : conversationMessages,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    searchUserConversations = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const userId = request.params.userId;
            const filters = await this._validator.searchUserConversations(request);
            const userConversations = await this._service.searchUserConversations(userId, filters);
            ResponseHandler.success(request, response, 'Conversations retrieved successfully!', 200, {
                UserConversations : userConversations,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getConversationById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const conversationId: uuid = await this._validator.getParamUuid(request, 'conversationId');
            const conversation = await this._service.getConversationById(conversationId);
            if (conversation == null) {
                throw new ApiError(404, 'Conversation not found.');
            }

            ResponseHandler.success(request, response, 'Conversation retrieved successfully!', 200, {
                Conversation : conversation,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    updateConversation = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const conversationId: uuid = await this._validator.getParamUuid(request, 'conversationId');
            const updates: ConversationDomainModel = await this._validator.updateConversation(request);
            const conversation = await this._service.updateConversation(conversationId, updates);
            if (conversation == null) {
                throw new ApiError(404, 'Conversation not found.');
            }

            ResponseHandler.success(request, response, 'Conversation updated successfully!', 200, {
                Conversation : conversation,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    deleteConversation = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const conversationId: uuid = await this._validator.getParamUuid(request, 'conversationId');
            const deleted = await this._service.deleteConversation(conversationId);
            if (!deleted) {
                throw new ApiError(400, 'Conversation cannot be deleted.');
            }
            ResponseHandler.success(request, response, 'Conversation record deleted successfully!', 200, {
                Deleted : true,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    addUserToConversation = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const conversationId: uuid = await this._validator.getParamUuid(request, 'conversationId');
            const userId: uuid = await this._validator.getParamUuid(request, 'userId');

            const added = await this._service.addUserToConversation(conversationId, userId);
            if (!added) {
                throw new ApiError(422, 'User cannot be added to conversation.');
            }
            ResponseHandler.success(request, response, 'User added to conversation successfully!', 200, {
                Added : true,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    removeUserFromConversation = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const conversationId: uuid = await this._validator.getParamUuid(request, 'conversationId');
            const userId: uuid = await this._validator.getParamUuid(request, 'userId');

            const added = await this._service.removeUserFromConversation(conversationId, userId);
            if (!added) {
                throw new ApiError(422, 'User cannot be removed from conversation.');
            }
            ResponseHandler.success(request, response, 'User removed from conversation successfully!', 200, {
                Added : true,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getConversationBetweenTwoUsers = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const firstUserId: uuid = await this._validator.getParamUuid(request, 'firstUserId');
            const secondUserId: uuid = await this._validator.getParamUuid(request, 'secondUserId');

            const conversation = await this._service.getConversationBetweenTwoUsers(firstUserId, secondUserId);
            if (!conversation) {
                
                throw new ApiError(404, 'Conversation cannot be found.');
            }
            ResponseHandler.success(request, response, 'Conversation between users retrieved successfully!', 200, {
                Conversation : conversation,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getMessage = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const messageId: uuid = await this._validator.getParamUuid(request, 'messageId');
            const message = await this._service.getMessage(messageId);
            if (message == null) {
                throw new ApiError(404, 'Chat message not found.');
            }

            ResponseHandler.success(request, response, 'Chat message retrieved successfully', 200, { ChatMessage: message });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    updateMessage = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const domainModel = await this._validator.updateMessage(request);
            const messageId: uuid = await this._validator.getParamUuid(request, 'messageId');
            const existingMessage = await this._service.getMessage(messageId);
            if (existingMessage == null) {
                throw new ApiError(404, 'Chat message not found.');
            }
            const updated = await this._service.updateMessage(messageId, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update chat message record!');
            }

            ResponseHandler.success(request, response, 'Chat message record updated successfully!', 200, {
                ChatMessage : updated,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    deleteMessage = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const messageId: uuid = await this._validator.getParamUuid(request, 'messageId');
            const deleted = await this._service.deleteMessage(messageId);
            if (!deleted) {
                throw new ApiError(400, 'Chat cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'Chat record deleted successfully!', 200, {
                Deleted : true,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getMarkedConversationsForUser = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const userId: uuid = await this._validator.getParamUuid(request, 'userId');
            const conversations = await this._service.getMarkedConversationsForUser(userId);
            ResponseHandler.success(request, response, 'Marked conversations for the user retrieved successfully!', 200, {
                Conversations : conversations,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getRecentConversationsForUser = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const userId: uuid = await this._validator.getParamUuid(request, 'userId');
            const conversations = await this._service.getRecentConversationsForUser(userId);
            ResponseHandler.success(request, response, 'Recent conversations for the user retrieved successfully!', 200, {
                Conversations : conversations,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}
