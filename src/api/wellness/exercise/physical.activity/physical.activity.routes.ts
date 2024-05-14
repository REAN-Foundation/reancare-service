import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { PhysicalActivityController } from './physical.activity.controller';
import { PhysicalActivityAuth } from './physical.activity.auth';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new PhysicalActivityController();

    router.post('/', auth(PhysicalActivityAuth.create), controller.create);
    router.get('/search', auth(PhysicalActivityAuth.search), controller.search);
    router.get('/:id', auth(PhysicalActivityAuth.getById), controller.getById);
    router.put('/:id', auth(PhysicalActivityAuth.update), controller.update);
    router.delete('/:id', auth(PhysicalActivityAuth.delete), controller.delete);

    app.use('/api/v1/wellness/exercise/physical-activities', router);
};
