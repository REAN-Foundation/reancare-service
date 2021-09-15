import 'reflect-metadata';
import { DependencyContainer } from 'tsyringe';
import { DatabaseConnector_Sequelize } from './database.connector.sequelize';
import { AddressRepo } from './repositories/address.repo';
import { ApiClientRepo } from './repositories/api.client.repo';
import { DoctorRepo } from './repositories/doctor.repo';
import { InternalTestUserRepo } from './repositories/internal.test.user.repo';
import { OrganizationRepo } from './repositories/organization.repo';
import { OtpRepo } from './repositories/otp.repo';
import { HealthProfileRepo } from './repositories/patient/health.profile.repo';
import { PatientRepo } from './repositories/patient/patient.repo';
import { PersonRepo } from './repositories/person.repo';
import { PersonRoleRepo } from './repositories/person.role.repo';
import { RolePrivilegeRepo } from './repositories/role.privilege.repo';
import { RoleRepo } from './repositories/role.repo';
import { UserRepo } from './repositories/user.repo';
import { StepCountRepo } from './repositories/daily.records/stepCount.repo';

////////////////////////////////////////////////////////////////////////////////

export class SequelizeInjector {
    
    static registerInjections(container: DependencyContainer) {
        
        container.register('IDatabaseConnector', DatabaseConnector_Sequelize);

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
        container.register('IHealthProfileRepo', HealthProfileRepo);
        container.register('IInternalTestUserRepo', InternalTestUserRepo);
        container.register('IStepCountRepo', StepCountRepo);
        
    }

}
