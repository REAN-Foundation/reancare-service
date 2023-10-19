import express from 'express';
import { auth } from '../../../auth/auth.handler';
import { DoctorNoteController } from './doctor.note.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new DoctorNoteController();

    router.post('/', auth(), controller.create);
    router.get('/search/:id', auth(), controller.search);
    router.get('/:id', auth(), controller.getById);
    router.put('/:id', auth(), controller.update);
    router.delete('/:id', auth(), controller.delete);

    app.use('/api/v1/clinical/doctor-notes', router);
};
