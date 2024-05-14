import express from 'express';
import { VolunteerController } from './volunteer.controller';
import { auth } from '../../../../auth/auth.handler';
import { VolunteerAuth } from './volunteer.auth';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new VolunteerController();

    router.post('/', auth(VolunteerAuth.create), controller.create);
    router.get('/search', auth(VolunteerAuth.search), controller.search);
    router.get('/:userId', auth(VolunteerAuth.getByUserId), controller.getByUserId);
    router.put('/:userId', auth(VolunteerAuth.updateByUserId), controller.updateByUserId);
    router.delete('/:userId', auth(VolunteerAuth.deleteByUserId), controller.delete);

    app.use('/api/v1/volunteers', router);
};
