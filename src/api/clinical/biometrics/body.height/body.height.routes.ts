import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { BodyHeightController } from './body.height.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new BodyHeightController();

    router.post('/', auth('Biometrics.BodyHeight.Create'), controller.create);
    router.get('/search', auth('Biometrics.BodyHeight.Search'), controller.search);
    router.get('/:id', auth('Biometrics.BodyHeight.GetById'), controller.getById);
    router.put('/:id', auth('Biometrics.BodyHeight.Update'), controller.update);
    router.delete('/:id', auth('Biometrics.BodyHeight.Delete'), controller.delete);

    app.use('/api/v1/clinical/biometrics/body-heights', router);
};
