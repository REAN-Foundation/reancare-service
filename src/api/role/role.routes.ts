import express from 'express';
import { RoleController } from './role.controller';
import { auth } from '../../auth/auth.handler';
import { RoleAuth } from './role.auth';

///////////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new RoleController();

    router.post('/', auth(RoleAuth.create), controller.create);
    router.get('/search', auth(RoleAuth.search), controller.search);
    router.put('/:id', auth(RoleAuth.update), controller.update);
    router.delete('/:id', auth(RoleAuth.delete), controller.delete);
    router.get('/:id', auth(RoleAuth.getById), controller.getById);

    app.use('/api/v1/roles', router);
};
