import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { BodyHeightController } from './body.height.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new BodyHeightController();

    router.post('/', auth('Clinical.Biometrics.BodyHeight.Create'), controller.create);
    router.get('/search', auth('Clinical.Biometrics.BodyHeight.Search'), controller.search);
    router.get('/:id', auth('Clinical.Biometrics.BodyHeight.GetById'), controller.getById);
    router.put('/:id', auth('Clinical.Biometrics.BodyHeight.Update'), controller.update);
    router.delete('/:id', auth('Clinical.Biometrics.BodyHeight.Delete'), controller.delete);

    app.use('/api/v1/clinical/biometrics/body-heights', router);
};
