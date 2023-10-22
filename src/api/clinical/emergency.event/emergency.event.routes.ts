import express from 'express';
import { auth } from '../../../auth/auth.handler';
import { EmergencyEventController } from './emergency.event.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new EmergencyEventController();

    router.post('/', auth('Clinical.EmergencyEvent.Create'), controller.create);
    router.get('/search', auth('Clinical.EmergencyEvent.Search'), controller.search);
    router.get('/:id', auth('Clinical.EmergencyEvent.GetById'), controller.getById);
    router.put('/:id', auth('Clinical.EmergencyEvent.Update'), controller.update);
    router.delete('/:id', auth('Clinical.EmergencyEvent.Delete'), controller.delete);

    app.use('/api/v1/clinical/emergency-events', router);
};
