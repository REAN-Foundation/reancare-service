import express from 'express';
import { auth } from '../../../auth/auth.handler';
import { HealthSystemController } from './health.system.controller';
import { HealthSystemAuth } from './health.system.auth';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new HealthSystemController();

    router.post('/', auth(HealthSystemAuth.create), controller.create);
    router.get('/by-tags', auth(HealthSystemAuth.getHealthSystemsWithTags), controller.getHealthSystemsWithTags);
    router.get('/search', auth(HealthSystemAuth.search), controller.search);
    router.get('/:id', auth(HealthSystemAuth.getById), controller.getById);
    router.put('/:id', auth(HealthSystemAuth.update), controller.update);
    router.delete('/:id', auth(HealthSystemAuth.delete), controller.delete);

    app.use('/api/v1/health-systems', router);
};
