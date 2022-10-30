import express from 'express';
import { ApiError } from '../../../common/api.error';
import { ResponseHandler } from '../../../common/response.handler';
import { uuid } from '../../../domain.types/miscellaneous/system.types';
import { ChatService } from '../../../services/general/chat.service';
import { UserService } from '../../../services/users/user/user.service';
import { RoleService } from '../../../services/role/role.service';
import { Loader } from '../../../startup/loader';
import { ChatValidator } from './chat.validator';
import { BaseController } from '../../base.controller';

///////////////////////////////////////////////////////////////////////////////////////

export class ChatController extends BaseController {

    //#region member variables and constructors

    _service: ChatService = null;

    _roleService: RoleService = null;

    _userService: UserService = null;

    _validator = new ChatValidator();

    constructor() {
        super();
        this._service = Loader.container.resolve(ChatService);
        this._roleService = Loader.container.resolve(RoleService);
        this._userService = Loader.container.resolve(UserService);
    }

    //#endregion

    //#region Action methods

    startConversation = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Chat.StartConversation', request, response);

            const domainModel = await this._validator.startConversation(request);
            const conversation = await this._service.startConversation(domainModel);
            if (conversation == null) {
                throw new ApiError(400, 'Cannot start conversation!');
            }

            ResponseHandler.success(request, response, 'Chat created successfully!', 201, {
                Conversation : conversation,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    sendMessage = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Chat.SendMessage', request, response);

            const domainModel = await this._validator.sendMessage(request);
            const chat = await this._service.sendMessage(domainModel);
            if (chat == null) {
                throw new ApiError(400, 'Cannot create chat!');
            }

            ResponseHandler.success(request, response, 'Chat created successfully!', 201, {
                Chat : chat,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getConversationMessages = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Chat.GetConversationMessages', request, response);

            const conversationId = await this._validator.getParamUuid(request, 'conversationId');
            const conversationMessages = await this._service.getConversationMessages(conversationId);
            ResponseHandler.success(request, response, 'Chat created successfully!', 201, {
                ConversationMessages : conversationMessages,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };
    
    searchUserConversations = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Chat.SearchUserConversations', request, response);
            
            const domainModel = await this._validator.searchUserConversations(request);
            const chat = await this._service.searchUserConversations(domainModel);
            if (chat == null) {
                throw new ApiError(400, 'Cannot create chat!');
            }

            ResponseHandler.success(request, response, 'Chat created successfully!', 201, {
                Chat : chat,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getConversationById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Chat.GetConversationById', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const chat = await this._service.getById(id);
            if (chat == null) {
                throw new ApiError(404, 'Chat not found.');
            }

            ResponseHandler.success(request, response, 'Chat retrieved successfully!', 200, {
                Chat : chat,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    updateConversation = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Chat.UpdateConversation', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const chat = await this._service.getById(id);
            if (chat == null) {
                throw new ApiError(404, 'Chat not found.');
            }

            ResponseHandler.success(request, response, 'Chat retrieved successfully!', 200, {
                Chat : chat,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    deleteConversation = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Chat.DeleteConversation', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingChat = await this._service.getById(id);
            if (existingChat == null) {
                throw new ApiError(404, 'Chat not found.');
            }
            const deleted = await this._service.delete(id);
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

    getMessage = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Chat.GetMessage', request, response);

            const filters = await this._validator.search(request);
            const searchResults = await this._service.search(filters);
            const count = searchResults.Items.length;
            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} chat records retrieved successfully!`;

            ResponseHandler.success(request, response, message, 200, { Chates: searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    updateMessage = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Chat.UpdateMessage', request, response);

            const domainModel = await this._validator.update(request);
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingChat = await this._service.getById(id);
            if (existingChat == null) {
                throw new ApiError(404, 'Chat not found.');
            }
            const updated = await this._service.update(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update chat record!');
            }

            ResponseHandler.success(request, response, 'Chat record updated successfully!', 200, {
                Chat : updated,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    deleteMessage = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Chat.DeleteMessage', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingChat = await this._service.getById(id);
            if (existingChat == null) {
                throw new ApiError(404, 'Chat not found.');
            }
            const deleted = await this._service.delete(id);
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

    //#endregion

}
