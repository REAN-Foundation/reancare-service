import express from 'express';
import { auth } from '../../../auth/auth.handler';
import { EmergencyEventController } from './emergency.event.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new EmergencyEventController();

    router.post('/', auth('EmergencyEvent.Create'), controller.create);
    router.get('/search', auth('EmergencyEvent.Search'), controller.search);
    router.get('/:id', auth('EmergencyEvent.GetById'), controller.getById);
    router.put('/:id', auth('EmergencyEvent.Update'), controller.update);
    router.delete('/:id', auth('EmergencyEvent.Delete'), controller.delete);

    app.use('/api/v1/clinical/emergency-events', router);
};
