import 'reflect-metadata';
import { DependencyContainer } from 'tsyringe';

import { DatabaseConnector_Sequelize } from "../data/dal/sequelize/database.connector.sequelize";
import { Authenticator_jwt } from "../auth/jwt/authenticator.jwt";
import { Authorizer_custom } from "../auth/custom/authorizer.custom";

import { UserRepo } from '../data/dal/sequelize/repositories/user.repo';
import { UserRoleRepo } from '../data/dal/sequelize/repositories/user.role.repo';
import { RoleRepo } from '../data/dal/sequelize/repositories/role.repo';
//import { ClientRepo } from '../data/dal/sequelize/repositories/client.repo';
//import { PatientRepo } from '../data/dal/sequelize/repositories/patient.repo';

//////////////////////////////////////////////////////////////////////////////////////////////////

export class Injector {

    static registerInjections(container: DependencyContainer) {

        container.register('IDatabaseConnector', DatabaseConnector_Sequelize);
        container.register('IAuthenticator', Authenticator_jwt);
        container.register('IAuthorizer', Authorizer_custom);

        container.register('IUserRepo', UserRepo);
        container.register('IUserRoleRepo', UserRoleRepo);
        container.register('IRoleRepo', RoleRepo);
        
        // container.register('IClientRepo', ClientRepo);
        // container.register('IPatientRepo', PatientRepo);
    }
}
