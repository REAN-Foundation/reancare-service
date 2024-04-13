import express from 'express';
import { PersonController } from './person.controller';
import { auth } from '../../auth/auth.handler';
import { PersonAuth } from './person.auth';

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new PersonController();

    //Note:
    //For person controller, there will not be end-points for create, update and delete.
    //Person will not be directly created/updated/deleted, but through user/person type specific
    //entity controllers such patient, doctor, etc.

    router.get('/phone/:phone/role/:roleId', auth(PersonAuth.getAllPersonsWithPhoneAndRole), controller.getAllPersonsWithPhoneAndRole);
    router.get('/phone/:phone', auth(PersonAuth.getAllPersonsWithPhone), controller.getAllPersonsWithPhone);
    //Person may be associated with multiple organizations.
    //e.g. A apecialist doctor may be associated multiple hospitals
    router.get('/:id/organizations', auth(PersonAuth.getOrganizations), controller.getOrganizations);

    //Person can have multiple addresses. Also multiple persons can share same address. e.g. Family members
    router.post('/:id/add-address/:addressId', auth(PersonAuth.addAddress), controller.addAddress);
    router.post('/:id/remove-address/:addressId', auth(PersonAuth.removeAddress), controller.removeAddress);
    router.get('/:id/addresses', auth(PersonAuth.getAddresses), controller.getAddresses);

    //Get person details including multiple user-roles that person may have
    router.get('/:id', auth(PersonAuth.getById), controller.getById);

    app.use('/api/v1/persons', router);
};
