import express from 'express';
import { UserGroupController } from './user.group.controller';
import { auth } from '../../../auth/auth.handler';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new UserGroupController();

    router.post('/', auth('UserGroup.Create'), controller.create);
    router.put('/:id', auth('UserGroup.Update'), controller.update);
    router.delete('/:id', auth('UserGroup.Delete'), controller.delete);
    router.get('/search', auth('UserGroup.Search'), controller.search);

    router.post('/:id/users/:userId/make-admin', auth('UserGroup.MakeUserAdmin'), controller.makeUserAdmin);
    router.post('/:id/users/:userId/remove-admin', auth('UserGroup.RemoveUserAdmin'), controller.removeUserAdmin);
    router.get('/:id/admins', auth('UserGroup.GetGroupAdmins'), controller.getGroupAdmins);

    router.post('/:id/group-activity-types', auth('UserGroup.SetGroupActivityTypes'), controller.setGroupActivityTypes);
    router.get('/:id/group-activity-types', auth('UserGroup.GetGroupActivityTypes'), controller.getGroupActivityTypes);

    router.get('/:id/users', auth('UserGroup.GetGroupUsers'), controller.getGroupUsers);
    router.get('/:id', auth('UserGroup.GetById'), controller.getById);
    router.post('/:id/users/:userId/add', auth('UserGroup.AddUserToGroup'), controller.addUserToGroup);
    router.post('/:id/users/:userId/remove', auth('UserGroup.RemoveUserFromGroup'), controller.removeUserFromGroup);

    app.use('/api/v1/user-groups', router);
};
