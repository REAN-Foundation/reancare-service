import { Roles } from "../domain.types/role/role.types";
import { injectable, inject } from "tsyringe";
import { IRoleRepo } from "../database/repository.interfaces/role.repo.interface";
import { IRolePrivilegeRepo } from "../database/repository.interfaces/role.privilege.repo.interface";
import { IApiClientRepo } from "../database/repository.interfaces/api.client.repo.interface";
import { ApiClientService } from "../services/api.client.service";
import { IUserRepo } from "../database/repository.interfaces/user.repo.interface";
import { IPersonRepo } from "../database/repository.interfaces/person.repo.interface";
import { Logger } from "../common/logger";
import { UserDomainModel } from "../domain.types/user/user.domain.model";
import { ApiClientDomainModel } from "../domain.types/api.client/api.client.domain.model";
import { Loader } from "./loader";
import * as RolePrivilegesList from '../assets/seed.data/role.privileges.json';
import { IPersonRoleRepo } from "../database/repository.interfaces/person.role.repo.interface";
import * as SeededInternalClients from '../assets/seed.data/internal.clients.seed.json';
import * as SeededSystemAdmin from '../assets/seed.data/system.admin.seed.json';

//////////////////////////////////////////////////////////////////////////////

@injectable()
export class Seeder {

    _apiClientService: ApiClientService = null;

    constructor(
        @inject('IRoleRepo') private _roleRepo: IRoleRepo,
        @inject('IApiClientRepo') private _apiClientRepo: IApiClientRepo,
        @inject('IUserRepo') private _userRepo: IUserRepo,
        @inject('IPersonRepo') private _personRepo: IPersonRepo,
        @inject('IRolePrivilegeRepo') private _rolePrivilegeRepo: IRolePrivilegeRepo,
        @inject('IPersonRoleRepo') private _personRoleRepo: IPersonRoleRepo
    ) {
        this._apiClientService = Loader.container.resolve(ApiClientService);
    }

    public init = async (): Promise<void> => {
        try {
            await this.seedDefaultRoles();
            await this.seedRolePrivileges();
            await this.seedInternalClients();
            await this.seedSystemAdmin();
        } catch (error) {
            Logger.instance().log(error.message);
        }
    };

    private seedRolePrivileges = async () => {
        const rolePrivileges = await this._rolePrivilegeRepo.search();
        if (rolePrivileges.length > 0) {
            return;
        }
        try {
            const arr = RolePrivilegesList['default'];
            for (let i = 0; i < arr.length; i++) {
                const rp = arr[i];
                const roleName = rp['Role'];
                const privileges = rp['Privileges'];

                const role = await this._roleRepo.getByName(roleName);
                if (role == null) {
                    continue;
                }
                for (const p of privileges) {
                    await this._rolePrivilegeRepo.create({
                        RoleId    : role.id,
                        Privilege : p,
                    });
                }
            }
        } catch (error) {
            Logger.instance().log('Error occurred while seeding role-privileges!');
        }
        Logger.instance().log('Seeded role-privileges successfully!');
    };

    private seedSystemAdmin = async () => {

        const exists = await this._userRepo.userNameExists('admin');
        if (exists) {
            return;
        }

        const role = await this._roleRepo.getByName(Roles.SystemAdmin);
       
        const userDomainModel: UserDomainModel = {
            Person : {
                Phone     : SeededSystemAdmin.Phone,
                FirstName : SeededSystemAdmin.FirstName,
            },
            UserName        : SeededSystemAdmin.UserName,
            Password        : SeededSystemAdmin.Password,
            DefaultTimeZone : SeededSystemAdmin.DefaultTimeZone,
            CurrentTimeZone : SeededSystemAdmin.CurrentTimeZone,
            RoleId          : role.id,
        };

        const person = await this._personRepo.create(userDomainModel.Person);
        userDomainModel.Person.id = person.id;
        await this._userRepo.create(userDomainModel);
        await this._personRoleRepo.addPersonRole(person.id, role.id);

        Logger.instance().log('Seeded admin user successfully!');
    };

    private seedInternalClients = async () => {

        Logger.instance().log('Seeding internal clients...');

        const arr = SeededInternalClients['default'];
        for (let i = 0; i < arr.length; i++) {
            var c = arr[i];
            let client = await this._apiClientService.getByClientCode(c.ClientCode);
            if (client == null) {
                const model: ApiClientDomainModel = {
                    ClientName : c['ClientName'],
                    ClientCode : c['ClientCode'],
                    Email      : c['Email'],
                    Password   : c['Password'],
                    ValidFrom  : new Date(),
                    ValidTill  : new Date(2030, 12, 31),
                    ApiKey     : c['ApiKey'],
                };
                client = await this._apiClientService.create(model);
                var str = JSON.stringify(client, null, '  ');
                Logger.instance().log(str);
            }
        }

    };

    private seedDefaultRoles = async () => {
        const existing = await this._roleRepo.search();
        if (existing.length > 0) {
            return;
        }
        await this._roleRepo.create({
            RoleName    : Roles.SystemAdmin,
            Description : 'Admin of the system having elevated privileges.',
        });
        this._roleRepo.create({
            RoleName    : Roles.Patient,
            Description : 'Represents a patient.',
        });
        await this._roleRepo.create({
            RoleName    : Roles.Doctor,
            Description : 'Represents a doctor/physician.',
        });
        await this._roleRepo.create({
            RoleName    : Roles.LabUser,
            Description :
                'Represents a pathology/radiology lab representative/technician/pathologist/radiologist.',
        });
        await this._roleRepo.create({
            RoleName    : Roles.PharmacyUser,
            Description : 'Represents a pharmacy/pharmacist/pharmacy shop owner/drug dispenser.',
        });
        await this._roleRepo.create({
            RoleName    : Roles.Nurse,
            Description : 'Represents an nurse and medical care taker.',
        });
        await this._roleRepo.create({
            RoleName    : Roles.AmbulanceServiceUser,
            Description : 'Represents an ambulance service provider/driver/mobile emergency medic.',
        });
        await this._roleRepo.create({
            RoleName    : Roles.PatientFamilyMember,
            Description : 'Represents a family member of the patient.',
        });
        await this._roleRepo.create({
            RoleName    : Roles.PatientFriend,
            Description : 'Represents a friend of the patient.',
        });
        await this._roleRepo.create({
            RoleName    : Roles.SocialHealthWorker,
            Description :
                'Represents a health social worker/health support professional representing government/private health service.',
        });
    };

}
