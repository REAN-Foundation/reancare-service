import express from 'express';
import { ChatController } from './chat.controller';
import { Loader } from '../../../startup/loader';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const authenticator = Loader.authenticator;
    const controller = new ChatController();

    router.post('/conversations/start', authenticator.authenticateClient, authenticator.authenticateUser, controller.startConversation);
    router.post('/conversations/:conversationId/messages', authenticator.authenticateClient, authenticator.authenticateUser, controller.sendMessage);
    router.post('/conversations/:conversationId/users/:userId/add', authenticator.authenticateClient, authenticator.authenticateUser, controller.addUserToConversation);
    router.post('/conversations/:conversationId/users/:userId/remove', authenticator.authenticateClient, authenticator.authenticateUser, controller.removeUserFromConversation);
    router.get('/conversations/first-user/:firstUserId/second-user/:secondUserId', authenticator.authenticateClient, authenticator.authenticateUser, controller.getConversationBetweenTwoUsers);
    router.get('/users/:userId/conversations/marked', authenticator.authenticateClient, authenticator.authenticateUser, controller.getMarkedConversationsForUser);
    router.get('/users/:userId/conversations/recent', authenticator.authenticateClient, authenticator.authenticateUser, controller.getRecentConversationsForUser);
    router.get('/conversations/:conversationId/messages', authenticator.authenticateClient, authenticator.authenticateUser, controller.getConversationMessages);
    router.get('/users/:userId/conversations/search', authenticator.authenticateClient, authenticator.authenticateUser, controller.searchUserConversations);
    router.get('/conversations/:conversationId', authenticator.authenticateClient, authenticator.authenticateUser, controller.getConversationById);
    router.put('/conversations/:conversationId', authenticator.authenticateClient, authenticator.authenticateUser, controller.updateConversation);
    router.delete('/conversations/:conversationId', authenticator.authenticateClient, authenticator.authenticateUser, controller.deleteConversation);
    router.get('/messages/:messageId', authenticator.authenticateClient, authenticator.authenticateUser, controller.getMessage);
    router.put('/messages/:messageId', authenticator.authenticateClient, authenticator.authenticateUser, controller.updateMessage);
    router.delete('/messages/:messageId', authenticator.authenticateClient, authenticator.authenticateUser, controller.deleteMessage);

    app.use('/api/v1/chats', router);
};
