import express from 'express';
import { RssfeedController } from './rss.feed.controller';
import { auth } from '../../../auth/auth.handler';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new RssfeedController();

    //Public routes
    router.get('/:id/rss', auth('Rssfeed.GetRssFeed', true), controller.getRssFeed);
    router.get('/:id/atom', auth('Rssfeed.GetAtomFeed', true), controller.getAtomFeed);
    router.get('/:id/json', auth('Rssfeed.GetJsonFeed', true), controller.getJsonFeed);

    //Protected routes
    router.post('/', auth('Rssfeed.Create'), controller.create);
    router.get('/search', auth('Rssfeed.Search'), controller.search);
    router.get('/:id', auth('Rssfeed.GetById'), controller.getById);
    router.put('/:id', auth('Rssfeed.Update'), controller.update);
    router.delete('/:id', auth('Rssfeed.Delete'), controller.delete);

    router.post('/feed-items', auth('Rssfeed.AddFeedItem'), controller.addFeedItem);
    router.get('/feed-items/:itemId', auth('Rssfeed.GetFeedItemById'), controller.getFeedItemById);
    router.put('/feed-items/:itemId', auth('Rssfeed.UpdateFeedItem'), controller.updateFeedItem);
    router.delete('/feed-items/:itemId', auth('Rssfeed.DeleteFeedItem'), controller.deleteFeedItem);

    app.use('/api/v1/rss-feeds', router);
};
