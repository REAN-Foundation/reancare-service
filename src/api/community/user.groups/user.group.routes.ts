import express from 'express';
import { UserGroupController } from './user.group.controller';
import { auth } from '../../../auth/auth.handler';
import { UserGroupAuth } from './user.group.auth';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new UserGroupController();

    router.post('/', auth(UserGroupAuth.create), controller.create);
    router.put('/:id', auth(UserGroupAuth.update), controller.update);
    router.delete('/:id', auth(UserGroupAuth.delete), controller.delete);
    router.get('/search', auth(UserGroupAuth.search), controller.search);

    router.post('/:id/users/:userId/make-admin', auth(UserGroupAuth.makeUserAdmin), controller.makeUserAdmin);
    router.post('/:id/users/:userId/remove-admin', auth(UserGroupAuth.removeUserAdmin), controller.removeUserAdmin);
    router.get('/:id/admins', auth(UserGroupAuth.getGroupAdmins), controller.getGroupAdmins);

    router.post('/:id/group-activity-types', auth(UserGroupAuth.getGroupActivityTypes), controller.setGroupActivityTypes);
    router.get('/:id/group-activity-types', auth(UserGroupAuth.getGroupActivityTypes), controller.getGroupActivityTypes);

    router.get('/:id/users', auth(UserGroupAuth.getGroupUsers), controller.getGroupUsers);
    router.get('/:id', auth(UserGroupAuth.getById), controller.getById);
    router.post('/:id/users/:userId/add', auth(UserGroupAuth.addUserToGroup), controller.addUserToGroup);
    router.post('/:id/users/:userId/remove', auth(UserGroupAuth.removeUserFromGroup), controller.removeUserFromGroup);

    app.use('/api/v1/user-groups', router);
};
