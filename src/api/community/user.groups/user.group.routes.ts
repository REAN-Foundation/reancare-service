import express from 'express';
import { UserGroupController } from './user.group.controller';
import { Loader } from '../../../startup/loader';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const authenticator = Loader.authenticator;
    const controller = new UserGroupController();

    router.post('/', authenticator.authenticateClient, authenticator.authenticateUser, controller.create);
    router.put('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.update);
    router.delete('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.delete);
    router.get('/search', authenticator.authenticateClient, authenticator.authenticateUser, controller.search);

    //Make user as admin
    router.post('/:id/users/:userId/make-admin', authenticator.authenticateClient, authenticator.authenticateUser, controller.makeUserAdmin);
    //Remove user as admin
    router.post('/:id/users/:userId/remove-admin', authenticator.authenticateClient, authenticator.authenticateUser, controller.removeUserAdmin);
    //Get group admins
    router.get('/:id/admins', authenticator.authenticateClient, authenticator.authenticateUser, controller.getGroupAdmins);

    router.post('/:id/group-activity-types', authenticator.authenticateClient, authenticator.authenticateUser, controller.setGroupActivityTypes);
    router.get('/:id/group-activity-types', authenticator.authenticateClient, authenticator.authenticateUser, controller.getGroupActivityTypes);

    router.get('/:id/users', authenticator.authenticateClient, authenticator.authenticateUser, controller.getGroupUsers);
    router.get('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.getById);
    router.post('/:id/users/:userId/add', authenticator.authenticateClient, authenticator.authenticateUser, controller.addUserToGroup);
    router.post('/:id/users/:userId/remove', authenticator.authenticateClient, authenticator.authenticateUser, controller.removeUserFromGroup);

    app.use('/api/v1/user-groups', router);
};
