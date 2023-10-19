import express from 'express';
import { RssfeedController } from './rss.feed.controller';
import { auth } from '../../../auth/auth.handler';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new RssfeedController();

    //Public routes
    router.get('/:id/rss', controller.getRssFeed);
    router.get('/:id/atom', controller.getAtomFeed);
    router.get('/:id/json', controller.getJsonFeed);

    //Protected routes
    router.post('/', auth(), controller.create);
    router.get('/search', auth(), controller.search);
    router.get('/:id', auth(), controller.getById);
    router.put('/:id', auth(), controller.update);
    router.delete('/:id', auth(), controller.delete);

    router.post('/feed-items', auth(), controller.addFeedItem);
    router.get('/feed-items/:itemId', auth(), controller.getFeedItemById);
    router.put('/feed-items/:itemId', auth(), controller.updateFeedItem);
    router.delete('/feed-items/:itemId', auth(), controller.deleteFeedItem);

    app.use('/api/v1/rss-feeds', router);
};
