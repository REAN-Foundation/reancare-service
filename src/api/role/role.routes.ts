import express from 'express';
import { RoleController } from './role.controller';
import { auth } from '../../auth/auth.handler';

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new RoleController();

    router.post('/', auth(), controller.create);
    router.get('/search', auth(), controller.search);
    router.put('/:id', auth(), controller.update);
    router.delete('/:id', auth(), controller.delete);
    router.get('/:id', auth(), controller.getById);

    app.use('/api/v1/roles', router);
};

