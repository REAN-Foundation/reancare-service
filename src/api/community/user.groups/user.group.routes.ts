import express from 'express';
import { UserGroupController } from './user.group.controller';
import { auth } from '../../../auth/auth.handler';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new UserGroupController();

    router.post('/', auth('Community.UserGroup.Create'), controller.create);
    router.put('/:id', auth('Community.UserGroup.Update'), controller.update);
    router.delete('/:id', auth('Community.UserGroup.Delete'), controller.delete);
    router.get('/search', auth('Community.UserGroup.Search'), controller.search);

    router.post('/:id/users/:userId/make-admin', auth('Community.UserGroup.MakeUserAdmin'), controller.makeUserAdmin);
    router.post('/:id/users/:userId/remove-admin', auth('Community.UserGroup.RemoveUserAdmin'), controller.removeUserAdmin);
    router.get('/:id/admins', auth('Community.UserGroup.GetGroupAdmins'), controller.getGroupAdmins);

    router.post('/:id/group-activity-types', auth('Community.UserGroup.SetGroupActivityTypes'), controller.setGroupActivityTypes);
    router.get('/:id/group-activity-types', auth('Community.UserGroup.GetGroupActivityTypes'), controller.getGroupActivityTypes);

    router.get('/:id/users', auth('Community.UserGroup.GetGroupUsers'), controller.getGroupUsers);
    router.get('/:id', auth('Community.UserGroup.GetById'), controller.getById);
    router.post('/:id/users/:userId/add', auth('Community.UserGroup.AddUserToGroup'), controller.addUserToGroup);
    router.post('/:id/users/:userId/remove', auth('Community.UserGroup.RemoveUserFromGroup'), controller.removeUserFromGroup);

    app.use('/api/v1/user-groups', router);
};
