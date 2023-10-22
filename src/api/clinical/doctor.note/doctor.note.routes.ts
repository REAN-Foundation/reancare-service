import express from 'express';
import { auth } from '../../../auth/auth.handler';
import { DoctorNoteController } from './doctor.note.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new DoctorNoteController();

    router.post('/', auth('Clinical.DoctorNote.Create'), controller.create);
    router.get('/search/:id', auth('Clinical.DoctorNote.Search'), controller.search);
    router.get('/:id', auth('Clinical.DoctorNote.GetById'), controller.getById);
    router.put('/:id', auth('Clinical.DoctorNote.Update'), controller.update);
    router.delete('/:id', auth('Clinical.DoctorNote.Delete'), controller.delete);

    app.use('/api/v1/clinical/doctor-notes', router);
};
