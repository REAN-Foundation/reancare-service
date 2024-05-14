import express from 'express';
import { auth } from '../../../auth/auth.handler';
import { EmergencyEventController } from './emergency.event.controller';
import { EmergencyEventAuth } from './emergency.event.auth';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new EmergencyEventController();

    router.post('/', auth(EmergencyEventAuth.create), controller.create);
    router.get('/search', auth(EmergencyEventAuth.search), controller.search);
    router.get('/:id', auth(EmergencyEventAuth.getById), controller.getById);
    router.put('/:id', auth(EmergencyEventAuth.update), controller.update);
    router.delete('/:id', auth(EmergencyEventAuth.delete), controller.delete);

    app.use('/api/v1/clinical/emergency-events', router);
};
