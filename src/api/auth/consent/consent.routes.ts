import express from 'express';
import { ConsentController } from './consent.controller';
import { auth } from '../../../auth/auth.handler';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new ConsentController();

    router.post('/', auth('Consent.Create'), controller.create);
    router.put('/:id', auth('Consent.Update'), controller.update);
    router.delete('/:id', auth('Consent.Delete'), controller.delete);
    router.get('/search', auth('Consent.Search'), controller.search);
    router.get('/:id', auth('Consent.GetById'), controller.getById);

    app.use('/api/v1/consents', router);
};
