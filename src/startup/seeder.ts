import { Roles } from "../domain.types/role/role.types";
import { injectable, inject } from "tsyringe";
import path from "path";
import { IRoleRepo } from "../database/repository.interfaces/role.repo.interface";
import { IRolePrivilegeRepo } from "../database/repository.interfaces/role.privilege.repo.interface";
import { IApiClientRepo } from "../database/repository.interfaces/api.client.repo.interface";
import { ApiClientService } from "../services/api.client.service";
import { IUserRepo } from "../database/repository.interfaces/user.repo.interface";
import { IPersonRepo } from "../database/repository.interfaces/person.repo.interface";
import { Logger } from "../common/logger";
import { UserDomainModel } from "../domain.types/user/user/user.domain.model";
import { PatientDomainModel } from "../domain.types/patient/patient/patient.domain.model";
import { ApiClientDomainModel } from "../domain.types/api.client/api.client.domain.model";
import { Loader } from "./loader";
import { PatientService } from "../services/patient/patient.service";
import { UserService } from "../services/user.service";
import { RoleService } from "../services/role.service";
import { SymptomAssessmentTemplateService } from "../services/clinical/symptom/symptom.assessment.template.service";
import { Helper } from "../common/helper";
import { PersonService } from "../services/person.service";
import { HealthProfileService } from "../services/patient/health.profile.service";
import { IInternalTestUserRepo } from "../database/repository.interfaces/internal.test.user.repo.interface";
import { IPersonRoleRepo } from "../database/repository.interfaces/person.role.repo.interface";
import { IMedicationStockImageRepo } from "../database/repository.interfaces/clinical/medication/medication.stock.image.repo.interface";
import { ISymptomTypeRepo } from "../database/repository.interfaces/clinical/symptom/symptom.type.repo.interface";
import { ISymptomAssessmentTemplateRepo } from "../database/repository.interfaces/clinical/symptom/symptom.assessment.template.repo.interface";
import { SymptomTypeService } from "../services/clinical/symptom/symptom.type.service";
import { FileResourceService } from "../services/file.resource.service";
import { SymptomTypeDomainModel } from "../domain.types/clinical/symptom/symptom.type/symptom.type.domain.model";
import { SymptomAssessmentTemplateDomainModel } from "../domain.types/clinical/symptom/symptom.assessment.template/symptom.assessment.template.domain.model";
import { SymptomTypeSearchFilters } from "../domain.types/clinical/symptom/symptom.type/symptom.type.search.types";

import * as RolePrivilegesList from '../seed.data/role.privileges.json';
import * as SeededInternalClients from '../seed.data/internal.clients.seed.json';
import * as SeededSystemAdmin from '../seed.data/system.admin.seed.json';
import * as SeededInternalTestsUsers from '../seed.data/internal.test.users.seed.sample.json';
import * as SeededSymptomTypes from '../seed.data/symptom.types.json';
import * as SeededAssessmentTemplates from '../seed.data/symptom.assessment.templates.json';

// import * as fs from "fs";
// import {
//     MedicationStockImageDomainModel
// } from "../domain.types/clinical/medication/medication.stock.image/medication.stock.image.domain.model";

//////////////////////////////////////////////////////////////////////////////

@injectable()
export class Seeder {

    _apiClientService: ApiClientService = null;

    _patientService: PatientService = null;

    _personService: PersonService = null;

    _userService: UserService = null;

    _roleService: RoleService = null;

    _patientHealthProfileService: HealthProfileService = null;

    _symptomTypeService: SymptomTypeService = null;

    _symptomAssessmentTemplateService: SymptomAssessmentTemplateService = null;

    _fileResourceService: FileResourceService = null;

    constructor(
        @inject('IRoleRepo') private _roleRepo: IRoleRepo,
        @inject('IApiClientRepo') private _apiClientRepo: IApiClientRepo,
        @inject('IUserRepo') private _userRepo: IUserRepo,
        @inject('IPersonRepo') private _personRepo: IPersonRepo,
        @inject('IRolePrivilegeRepo') private _rolePrivilegeRepo: IRolePrivilegeRepo,
        @inject('IPersonRoleRepo') private _personRoleRepo: IPersonRoleRepo,
        @inject('IMedicationStockImageRepo') private _medicationStockImageRepo: IMedicationStockImageRepo,
        @inject('ISymptomTypeRepo') private _symptomTypeRepo: ISymptomTypeRepo,
        @inject('IInternalTestUserRepo') private _internalTestUserRepo: IInternalTestUserRepo,
        @inject('ISymptomAssessmentTemplateRepo') private _symptomAssessmentTemplateRepo: ISymptomAssessmentTemplateRepo,
    ) {
        this._apiClientService = Loader.container.resolve(ApiClientService);
        this._patientService = Loader.container.resolve(PatientService);
        this._personService = Loader.container.resolve(PersonService);
        this._userService = Loader.container.resolve(UserService);
        this._roleService = Loader.container.resolve(RoleService);
        this._patientHealthProfileService = Loader.container.resolve(HealthProfileService);
        this._fileResourceService = Loader.container.resolve(FileResourceService);
        this._symptomTypeService = Loader.container.resolve(SymptomTypeService);
        this._symptomAssessmentTemplateService = Loader.container.resolve(SymptomAssessmentTemplateService);
    }

    public init = async (): Promise<void> => {
        try {
            await this.seedDefaultRoles();
            await this.seedRolePrivileges();
            await this.seedInternalClients();
            await this.seedSystemAdmin();
            await this.seedInternalPatients();
            await this.seedMedicationStockImages();
            await this.seedSymptomTypes();
            await this.seedSymptomAsseessmentTemplates();
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

        Logger.instance().log('Seeded default roles successfully!');
    };

    private seedInternalPatients = async () => {
        try {
            const arr = SeededInternalTestsUsers.Patients;
            for (let i = 0; i < arr.length; i++) {
                var phone = arr[i];
                var exists = await this._personRepo.personExistsWithPhone(phone);
                if (!exists) {
                    var added = await this.createTestPatient(phone);
                    if (added) {
                        await this._internalTestUserRepo.create(phone);
                    }
                }
            }
        }
        catch (error) {
            Logger.instance().log('Error occurred while seeding internal test users!');
        }
        Logger.instance().log('Seeded internal-test-users successfully!');
    }

    private createTestPatient = async (phone: string): Promise<boolean> => {

        var patientDomainModel: PatientDomainModel = {
            User : {
                Person : {
                    Phone : phone
                }
            },
            AddressIds : []
        };

        //Throw an error if patient with same name and phone number exists
        const existingPatientCountSharingPhone = await this._patientService.checkforDuplicatePatients(
            patientDomainModel
        );
        
        const userName = await this._userService.generateUserName(
            patientDomainModel.User.Person.FirstName,
            patientDomainModel.User.Person.LastName
        );
        
        const displayId = await this._userService.generateUserDisplayId(
            Roles.Patient,
            patientDomainModel.User.Person.Phone,
            existingPatientCountSharingPhone
        );
        
        const displayName = Helper.constructPersonDisplayName(
            patientDomainModel.User.Person.Prefix,
            patientDomainModel.User.Person.FirstName,
            patientDomainModel.User.Person.LastName
        );
        
        patientDomainModel.User.Person.DisplayName = displayName;
        patientDomainModel.User.UserName = userName;
        patientDomainModel.DisplayId = displayId;
        
        const userDomainModel = patientDomainModel.User;
        const personDomainModel = userDomainModel.Person;
        
        //Create a person first
        
        let person = await this._personService.getPersonWithPhone(patientDomainModel.User.Person.Phone);
        if (person == null) {
            person = await this._personService.create(personDomainModel);
            if (person == null) {
                return false;
            }
        }
        
        const role = await this._roleService.getByName(Roles.Patient);
        patientDomainModel.PersonId = person.id;
        userDomainModel.Person.id = person.id;
        userDomainModel.RoleId = role.id;
        
        const user = await this._userService.create(userDomainModel);
        if (user == null) {
            return false;
        }
        patientDomainModel.UserId = user.id;
        
        patientDomainModel.DisplayId = displayId;
        const patient = await this._patientService.create(patientDomainModel);
        if (patient == null) {
            return false;
        }
        
        const healthProfile = await this._patientHealthProfileService.createDefault(user.id);
        patient.HealthProfile = healthProfile;

        return true;
        
    }
    
    private seedMedicationStockImages = async () => {

        var images = await this._medicationStockImageRepo.getAll();
        if (images.length > 0) {
            return;
        }

        // var cloudStoragePath = 'assets/images/stock.medication.images/';
        // var sourceFilePath = path.join(process.cwd(), "./assets/images/stock.medication.images/");
        // var files = fs.readdirSync(sourceFilePath);
        // var imageFiles = files.filter((f) => {
        //     return path.extname(f).toLowerCase() === '.png';
        // });

        // for await (const fileName of imageFiles) {

        //     var sourceFileLocation = path.join(sourceFilePath, fileName);
        //     var storageFileLocation = cloudStoragePath + fileName;

        //     var uploaded = await this._fileResourceService.UploadLocalFile(
        //         sourceFileLocation,
        //         storageFileLocation,
        //         true);

        //     var domainModel: MedicationStockImageDomainModel = {
        //         Code       : fileName.replace('.png', ''),
        //         FileName   : fileName,
        //         ResourceId : uploaded.ResourceId,
        //         PublicUrl  : uploaded.UrlPublic
        //     };
            
        //     var medStockImage = await this._medicationStockImageRepo.create(domainModel);
        //     if (!medStockImage) {
        //         Logger.instance().log('Error occurred while seeding medication stock images!');
        //     }
        // }
    }

    public seedSymptomTypes = async () => {

        const count = await this._symptomTypeRepo.totalCount();
        if (count > 0) {
            Logger.instance().log("Symptom types have already been seeded!");
            return;
        }

        Logger.instance().log('Seeding symptom types...');

        const arr = SeededSymptomTypes['default'];

        for (let i = 0; i < arr.length; i++) {
            var t = arr[i];
            var tokens = t['Tags'] ? t['Tags'].split(',') : [];

            //TODO: Commented till storage is enabled
            //var imageName = t['Image'] ? t['Image'] : null;
            //var resourceId = await this.getImageResourceIdForSymptomType(imageName);
            var resourceId = null;

            const model: SymptomTypeDomainModel = {
                Symptom         : t['Symptom'],
                Description     : t['Description'],
                Tags            : tokens,
                ImageResourceId : resourceId
            };
            await this._symptomTypeService.create(model);
        }
    }
    
    getImageResourceIdForSymptomType = async (fileName) => {
        if (fileName === null) {
            return null;
        }
        var storagePath = 'assets/images/symptom_images/' + fileName;
        var sourceFileLocation = path.join(process.cwd(), "./assets/images/symptom.images/", fileName);
        var uploaded = await this._fileResourceService.uploadLocal(sourceFileLocation, storagePath, true);
        return uploaded.id;
    }

    public seedSymptomAsseessmentTemplates = async () => {
    
        const count = await this._symptomAssessmentTemplateRepo.totalCount();
        if (count > 0) {
            Logger.instance().log("Symptom based assessment templates have already been seeded!");
            return;
        }
        Logger.instance().log('Seeding symptom assessment templates...');

        const arr = SeededAssessmentTemplates['default'];

        for (let i = 0; i < arr.length; i++) {
            var t = arr[i];
            var tokens = t['Tags'] ? t['Tags'].split(',').map(x => x.trim()) : [];
            const model: SymptomAssessmentTemplateDomainModel = {
                Title       : t['Title'],
                Description : t['Description'],
                Tags        : tokens,
            };
            var template = await this._symptomAssessmentTemplateService.create(model);

            if (template.Title === 'Heart Failure Symptoms Assessment') {
                var filters: SymptomTypeSearchFilters = {
                    Tag : 'Heart failure'
                };
                var searchResults = await this._symptomTypeService.search(filters);
                var symptomTypeIds = searchResults.Items.map(x => x.id);
                if (symptomTypeIds.length > 0) {
                    await this._symptomAssessmentTemplateService.addSymptomTypes(template.id, symptomTypeIds);
                }
            }
        }
    }

}
