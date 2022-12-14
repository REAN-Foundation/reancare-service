import express from 'express';
import { RssfeedController } from './rss.feed.controller';
import { Loader } from '../../../startup/loader';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const authenticator = Loader.authenticator;
    const controller = new RssfeedController();

    //Public routes
    router.get('/:id/rss', controller.getRssFeed);
    router.get('/:id/atom', controller.getAtomFeed);
    router.get('/:id/json', controller.getJsonFeed);

    //Protected routes
    router.post('/', authenticator.authenticateClient, authenticator.authenticateUser, controller.create);
    router.get('/search', authenticator.authenticateClient, authenticator.authenticateUser, controller.search);
    router.get('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.getById);
    router.put('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.update);
    router.delete('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.delete);

    router.post('/feed-items', authenticator.authenticateClient, authenticator.authenticateUser, controller.addFeedItem);
    router.get('/feed-items/:itemId', authenticator.authenticateClient, authenticator.authenticateUser, controller.getFeedItemById);
    router.put('/feed-items/:itemId', authenticator.authenticateClient, authenticator.authenticateUser, controller.updateFeedItem);
    router.delete('/feed-items/:itemId', authenticator.authenticateClient, authenticator.authenticateUser, controller.deleteFeedItem);

    app.use('/api/v1/rss-feeds', router);
};
