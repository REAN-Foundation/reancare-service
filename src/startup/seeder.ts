import { Roles } from "../data/domain.types/role.domain.types";
import { injectable, inject } from "tsyringe";
import { IRoleRepo } from "../data/repository.interfaces/role.repo.interface";
import { IRolePrivilegeRepo } from "../data/repository.interfaces/role.privilege.repo.interface";
import { IApiClientRepo } from "../data/repository.interfaces/api.client.repo.interface";
import { ApiClientService } from "../services/api.client.service";
import { IUserRepo } from "../data/repository.interfaces/user.repo.interface";
import { IPersonRepo } from "../data/repository.interfaces/person.repo.interface";
import { Logger } from "../common/logger";
import { UserDomainModel } from "../data/domain.types/user.domain.types";
import { ApiClientDomainModel } from "../data/domain.types/api.client.domain.types";
import { Helper } from "../common/helper";
import { Loader } from "./loader";
import * as RolePrivilegesList from '../assets/raw/role.privileges.json'
import { IPersonRoleRepo } from "../data/repository.interfaces/person.role.repo.interface";
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

    public init = async () => {
        return new Promise(async (resolve, reject) => {
            try {
                await this.seedDefaultRoles();
                await this.seedRolePrivileges();
                await this.seedInternalClients();
                await this.seedSystemAdmin();
                resolve(true);
            } catch (error) {
                reject(error);
                Logger.instance().log(error.message);
            }
        });
    };

    private seedRolePrivileges = async () => {
        var rolePrivileges = await this._rolePrivilegeRepo.search();
        if (rolePrivileges.length > 0) {
            return;
        }
        try {
            var arr = RolePrivilegesList['default'];
            for (var i = 0; i < arr.length; i++) {
                var rp = arr[i];
                var roleName = rp['Role'];
                var privileges = rp['Privileges'];

                var role = await this._roleRepo.getByName(roleName);
                if (role == null) {
                    continue;
                }
                for (var p of privileges) {
                    var rolePrivilege = await this._rolePrivilegeRepo.create({
                        RoleId: role.id,
                        Privilege: p,
                    });
                }
            }
        } catch (error) {
            Logger.instance().log('Error occurred while seeding role-privileges!');
        }
        Logger.instance().log('Seeded role-privileges successfully!');
    };

    private seedSystemAdmin = async () => {
        var exists = await this._userRepo.userNameExists('admin');
        if (exists) {
            return;
        }
        var role = await this._roleRepo.getByName(Roles.SystemAdmin);
        var userDomainModel: UserDomainModel = {
            Person: {
                Phone: '+91 0000000000',
                FirstName: 'system-admin'
            },
            UserName: 'admin',
            Password: "rean-foundation", //Helper.generatePassword(),
            DefaultTimeZone: '+05:30',
            CurrentTimeZone: '+05:30',
            RoleId: role.id,
        };
        var person = await this._personRepo.create(userDomainModel.Person);
        userDomainModel.Person.id = person.id;
        var user = await this._userRepo.create(userDomainModel);
        var personRole = await this._personRoleRepo.addPersonRole(person.id, role.id);
        Logger.instance().log('Seeded admin user successfully!');
    };

    private seedInternalClients = async () => {
        //Check for internal API client
        var clientCode = 'REANINTR';
        var client = await this._apiClientService.getByClientCode(clientCode);
        if (client == null) {
            var model: ApiClientDomainModel = {
                ClientName: 'REAN Foundation - Internal API client',
                ClientCode: clientCode,
                Email: 'kiran.kharade@reanfoundation.org',
                Password: Helper.generatePassword(),
                ValidFrom: new Date(),
                ValidTill: new Date(2030, 12, 31),
                ApiKey: process.env.API_CLIENT_INTERNAL
            };
            client = await this._apiClientService.create(model);
        }
        var str = JSON.stringify(client, null, '  ');
        Logger.instance().log(str);

        //Check for REAN patient app
        var clientCode = 'REANPTNT';
        var client = await this._apiClientService.getByClientCode(clientCode);
        if (client == null) {
            var model: ApiClientDomainModel = {
                ClientName: 'REAN Foundation - Patient App',
                ClientCode: clientCode,
                Email: 'tushar.katakdound@reanfoundation.org',
                Password: Helper.generatePassword(),
                ValidFrom: new Date(),
                ValidTill: new Date(2030, 12, 31),
                ApiKey: process.env.API_CLIENT_INTERNAL_PATIENT_APP
            };
            client = await this._apiClientService.create(model);
        }
        str = JSON.stringify(client, null, '  ');
        Logger.instance().log(str);

        //Check for REAN patient app
        var clientCode = 'REANDCTR';
        var client = await this._apiClientService.getByClientCode(clientCode);
        if (client == null) {
            var model: ApiClientDomainModel = {
                ClientName: 'REAN Foundation - Doctor App',
                ClientCode: clientCode,
                Email: 'tushar.katakdound@reanfoundation.org',
                Password: Helper.generatePassword(),
                ValidFrom: new Date(),
                ValidTill: new Date(2030, 12, 31),
                ApiKey: process.env.API_CLIENT_INTERNAL_DOCTOR_APP
            };
            client = await this._apiClientService.create(model);
        }
        str = JSON.stringify(client, null, '  ');
        Logger.instance().log(str);

        //Check for REAN patient app
        var clientCode = 'REANALAB';
        var client = await this._apiClientService.getByClientCode(clientCode);
        if (client == null) {
            var model: ApiClientDomainModel = {
                ClientName: 'REAN Foundation - Lab App',
                ClientCode: clientCode,
                Email: 'tushar.katakdound@reanfoundation.org',
                Password: Helper.generatePassword(),
                ValidFrom: new Date(),
                ValidTill: new Date(2030, 12, 31),
                ApiKey: process.env.API_CLIENT_INTERNAL_LAB_APP
            };
            client = await this._apiClientService.create(model);
        }
        str = JSON.stringify(client, null, '  ');
        Logger.instance().log(str);

        //Check for REAN patient app
        var clientCode = 'REANPHRM';
        var client = await this._apiClientService.getByClientCode(clientCode);
        if (client == null) {
            var model: ApiClientDomainModel = {
                ClientName: 'REAN Foundation - Pharmacy App',
                ClientCode: clientCode,
                Email: 'tushar.katakdound@reanfoundation.org',
                Password: Helper.generatePassword(),
                ValidFrom: new Date(),
                ValidTill: new Date(2030, 12, 31),
                ApiKey: process.env.API_CLIENT_INTERNAL_PHARMACY_APP
            };
            client = await this._apiClientService.create(model);
        }
        str = JSON.stringify(client, null, '  ');
        Logger.instance().log(str);
        Logger.instance().log('Seeded internal clients successfully!');
    };

    private seedDefaultRoles = async () => {
        var existing = await this._roleRepo.search();
        if (existing.length > 0) {
            return;
        }
        await this._roleRepo.create({
            RoleName: Roles.SystemAdmin,
            Description: 'Admin of the system having elevated privileges.',
        });
        this._roleRepo.create({
            RoleName: Roles.Patient,
            Description: 'Represents a patient.',
        });
        await this._roleRepo.create({
            RoleName: Roles.Doctor,
            Description: 'Represents a doctor/physician.',
        });
        await this._roleRepo.create({
            RoleName: Roles.LabUser,
            Description:
                'Represents a pathology/radiology lab representative/technician/pathologist/radiologist.',
        });
        await this._roleRepo.create({
            RoleName: Roles.PharmacyUser,
            Description: 'Represents a pharmacy/pharmacist/pharmacy shop owner/drug dispenser.',
        });
        await this._roleRepo.create({
            RoleName: Roles.Nurse,
            Description: 'Represents an nurse and medical care taker.',
        });
        await this._roleRepo.create({
            RoleName: Roles.AmbulanceServiceUser,
            Description: 'Represents an ambulance service provider/driver/mobile emergency medic.',
        });
        await this._roleRepo.create({
            RoleName: Roles.PatientFamilyMember,
            Description: 'Represents a family member of the patient.',
        });
        await this._roleRepo.create({
            RoleName: Roles.PatientFriend,
            Description: 'Represents a friend of the patient.',
        });
        await this._roleRepo.create({
            RoleName: Roles.SocialHealthWorker,
            Description:
                'Represents a health social worker/health support professional representing government/private health service.',
        });
    };
}
