import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { HowDoYouFeelController } from './how.do.you.feel.controller';
import { HowDoYouFeelAuth } from './how.do.you.feel.auth';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new HowDoYouFeelController();

    router.post('/', auth(HowDoYouFeelAuth.create), controller.create);
    router.get('/search', auth(HowDoYouFeelAuth.search), controller.search);
    router.get('/:id', auth(HowDoYouFeelAuth.getById), controller.getById);
    router.put('/:id', auth(HowDoYouFeelAuth.update), controller.update);
    router.delete('/:id', auth(HowDoYouFeelAuth.delete), controller.delete);

    app.use('/api/v1/clinical/symptoms/how-do-you-feel', router);
};
