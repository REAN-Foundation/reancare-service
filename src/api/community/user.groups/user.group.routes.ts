import express from 'express';
import { UserGroupController } from './user.group.controller';
import { auth } from '../../../auth/auth.handler';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new UserGroupController();

    router.post('/', auth(), controller.create);
    router.put('/:id', auth(), controller.update);
    router.delete('/:id', auth(), controller.delete);
    router.get('/search', auth(), controller.search);

    //Make user as admin
    router.post('/:id/users/:userId/make-admin', auth(), controller.makeUserAdmin);
    //Remove user as admin
    router.post('/:id/users/:userId/remove-admin', auth(), controller.removeUserAdmin);
    //Get group admins
    router.get('/:id/admins', auth(), controller.getGroupAdmins);

    router.post('/:id/group-activity-types', auth(), controller.setGroupActivityTypes);
    router.get('/:id/group-activity-types', auth(), controller.getGroupActivityTypes);

    router.get('/:id/users', auth(), controller.getGroupUsers);
    router.get('/:id', auth(), controller.getById);
    router.post('/:id/users/:userId/add', auth(), controller.addUserToGroup);
    router.post('/:id/users/:userId/remove', auth(), controller.removeUserFromGroup);

    app.use('/api/v1/user-groups', router);
};
