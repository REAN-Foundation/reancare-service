import express from 'express';
import { Loader } from '../../../startup/loader';
import { DoctorNoteController } from './doctor.note.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const authenticator = Loader.authenticator;
    const controller = new DoctorNoteController();

    router.post('/', authenticator.authenticateUser, controller.create);
    router.get('/search/:id', authenticator.authenticateUser, controller.search);
    router.get('/:id', authenticator.authenticateUser, controller.getById);
    router.put('/:id', authenticator.authenticateUser, controller.update);
    router.delete('/:id', authenticator.authenticateUser, controller.delete);

    app.use('/api/v1/clinical/doctor-notes', router);
};
