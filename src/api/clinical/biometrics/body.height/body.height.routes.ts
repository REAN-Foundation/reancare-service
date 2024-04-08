import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { BodyHeightController } from './body.height.controller';
import { BodyHeightAuth } from './body.height.auth';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new BodyHeightController();

    router.post('/', auth(BodyHeightAuth.create), controller.create);
    router.get('/search', auth(BodyHeightAuth.search), controller.search);
    router.get('/:id', auth(BodyHeightAuth.getById), controller.getById);
    router.put('/:id', auth(BodyHeightAuth.update), controller.update);
    router.delete('/:id', auth(BodyHeightAuth.delete), controller.delete);

    app.use('/api/v1/clinical/biometrics/body-heights', router);
};
