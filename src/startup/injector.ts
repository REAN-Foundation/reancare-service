import 'reflect-metadata';
import { DependencyContainer } from 'tsyringe';

import { DatabaseConnector_Sequelize } from "../database/sequelize/database.connector.sequelize";
import { Authenticator_jwt } from "../auth/jwt/authenticator.jwt";
import { Authorizer_custom } from "../auth/custom/authorizer.custom";

import { PersonRepo } from '../database/sequelize/repositories/person.repo';
import { UserRepo } from '../database/sequelize/repositories/user.repo';
import { PersonRoleRepo } from '../database/sequelize/repositories/person.role.repo';
import { RoleRepo } from '../database/sequelize/repositories/role.repo';
import { OtpRepo } from '../database/sequelize/repositories/otp.repo';
import { ApiClientRepo } from '../database/sequelize/repositories/api.client.repo';
import { AddressRepo } from '../database/sequelize/repositories/address.repo';
import { PatientRepo } from '../database/sequelize/repositories/patient.repo';
import { RolePrivilegeRepo } from '../database/sequelize/repositories/role.privilege.repo';
import { OrganizationRepo } from '../database/sequelize/repositories/organization.repo';
import { DoctorRepo } from '../database/sequelize/repositories/doctor.repo';

import { TwilioMessagingService } from '../modules/communication/providers/twilio.messaging.service';
import { EhrInjector } from '../modules/ehr/ehr.injector';

//////////////////////////////////////////////////////////////////////////////////////////////////

export class Injector {

    static registerInjections(container: DependencyContainer) {

        //Start-up classes
        container.register('IDatabaseConnector', DatabaseConnector_Sequelize);
        container.register('IAuthenticator', Authenticator_jwt);
        container.register('IAuthorizer', Authorizer_custom);

        //Repos
        container.register('IPersonRepo', PersonRepo);
        container.register('IUserRepo', UserRepo);
        container.register('IPersonRoleRepo', PersonRoleRepo);
        container.register('IRoleRepo', RoleRepo);
        container.register('IOtpRepo', OtpRepo);
        container.register('IApiClientRepo', ApiClientRepo);
        container.register('IPatientRepo', PatientRepo);
        container.register('IAddressRepo', AddressRepo);
        container.register('IRolePrivilegeRepo', RolePrivilegeRepo);
        container.register('IOrganizationRepo', OrganizationRepo);
        container.register('IDoctorRepo', DoctorRepo);

        //Modules
        container.register('IMessagingService', TwilioMessagingService);
        
        //Ehr
        EhrInjector.registerInjections(container);

    }

}
