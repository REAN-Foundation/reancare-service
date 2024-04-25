import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { BridgeController } from './bridge.controller';
import { BridgeAuth } from './bridge.auth';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new BridgeController();

    router.post('/', auth(BridgeAuth.create), controller.create);
    router.get('/search', auth(BridgeAuth.search), controller.search);
    router.get('/:id', auth(BridgeAuth.getById), controller.getById);
    router.put('/:id', auth(BridgeAuth.update), controller.update);
    router.delete('/:id', auth(BridgeAuth.delete), controller.delete);

    app.use('/api/v1/clinical/patient-donors', router);
};
