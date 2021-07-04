import 'reflect-metadata';
import { DependencyContainer } from 'tsyringe';

import { DatabaseConnector_Sequelize } from "../data/database/sequelize/database.connector.sequelize";
import { Authenticator_jwt } from "../auth/jwt/authenticator.jwt";
import { Authorizer_custom } from "../auth/custom/authorizer.custom";

import { UserRepo } from '../data/database/sequelize/repositories/user.repo';
import { UserRoleRepo } from '../data/database/sequelize/repositories/user.role.repo';
import { RoleRepo } from '../data/database/sequelize/repositories/role.repo';
import { OtpRepo } from '../data/database/sequelize/repositories/otp.repo';
import { ClientRepo } from '../data/database/sequelize/repositories/client.repo';
import { AddressRepo } from '../data/database/sequelize/repositories/address.repo';
import { PatientRepo } from '../data/database/sequelize/repositories/patient.repo';

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
        container.register('IUserRepo', UserRepo);
        container.register('IPersonRoleRepo', UserRoleRepo);
        container.register('IRoleRepo', RoleRepo);
        container.register('IOtpRepo', OtpRepo);
        container.register('IClientRepo', ClientRepo);
        container.register('IPatientRepo', PatientRepo);
        container.register('IAddressRepo', AddressRepo);

        //Modules
        container.register('IMessagingService', TwilioMessagingService);
        
        //Ehr
        EhrInjector.registerInjections(container);

    }
}
