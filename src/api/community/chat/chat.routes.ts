import express from 'express';
import { ChatController } from './chat.controller';
import { Loader } from '../../../startup/loader';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const authenticator = Loader.authenticator;
    const controller = new ChatController();

    router.post('/conversations/start', authenticator.authenticateUser, controller.startConversation);
    router.post('/conversations/:conversationId/messages', authenticator.authenticateUser, controller.sendMessage);
    router.post('/conversations/:conversationId/users/:userId/add', authenticator.authenticateUser, controller.addUserToConversation);
    router.post('/conversations/:conversationId/users/:userId/remove', authenticator.authenticateUser, controller.removeUserFromConversation);
    router.get('/conversations/first-user/:firstUserId/second-user/:secondUserId', authenticator.authenticateUser, controller.getConversationBetweenTwoUsers);
    router.get('/users/:userId/conversations/marked', authenticator.authenticateUser, controller.getMarkedConversationsForUser);
    router.get('/users/:userId/conversations/recent', authenticator.authenticateUser, controller.getRecentConversationsForUser);
    router.get('/conversations/:conversationId/messages', authenticator.authenticateUser, controller.getConversationMessages);
    router.get('/users/:userId/conversations/search', authenticator.authenticateUser, controller.searchUserConversations);
    router.get('/conversations/:conversationId', authenticator.authenticateUser, controller.getConversationById);
    router.put('/conversations/:conversationId', authenticator.authenticateUser, controller.updateConversation);
    router.delete('/conversations/:conversationId', authenticator.authenticateUser, controller.deleteConversation);
    router.get('/messages/:messageId', authenticator.authenticateUser, controller.getMessage);
    router.put('/messages/:messageId', authenticator.authenticateUser, controller.updateMessage);
    router.delete('/messages/:messageId', authenticator.authenticateUser, controller.deleteMessage);

    app.use('/api/v1/chats', router);
};
