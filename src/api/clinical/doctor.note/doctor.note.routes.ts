import express from 'express';
import { auth } from '../../../auth/auth.handler';
import { DoctorNoteController } from './doctor.note.controller';
import { DoctorNoteAuth } from './doctor.note.auth';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new DoctorNoteController();

    router.post('/', auth(DoctorNoteAuth.create), controller.create);
    router.get('/search/:id', auth(DoctorNoteAuth.search), controller.search);
    router.get('/:id', auth(DoctorNoteAuth.getById), controller.getById);
    router.put('/:id', auth(DoctorNoteAuth.update), controller.update);
    router.delete('/:id', auth(DoctorNoteAuth.delete), controller.delete);

    app.use('/api/v1/clinical/doctor-notes', router);
};
