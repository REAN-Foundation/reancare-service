import express from 'express';
import { DoctorNoteController } from '../../controllers/clinical/doctor.note.controller';
import { Loader } from '../../../startup/loader';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const authenticator = Loader.authenticator;
    const controller = new DoctorNoteController();

    router.post('/', authenticator.authenticateClient, authenticator.authenticateUser, controller.create);
    router.get('/search/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.search);
    router.get('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.getById);
    router.put('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.update);
    router.delete('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.delete);
    
    app.use('/api/v1/doctor-notes', router);
};
