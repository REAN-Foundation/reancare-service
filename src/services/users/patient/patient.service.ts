import { inject, injectable } from 'tsyringe';
import { ConfigurationManager } from '../../../config/configuration.manager';
import { IAddressRepo } from '../../../database/repository.interfaces/general/address.repo.interface';
import { IPatientRepo } from '../../../database/repository.interfaces/users/patient/patient.repo.interface';
import { IPersonRepo } from '../../../database/repository.interfaces/person/person.repo.interface';
import { IPersonRoleRepo } from '../../../database/repository.interfaces/person/person.role.repo.interface';
import { IRoleRepo } from '../../../database/repository.interfaces/role/role.repo.interface';
import { IUserRepo } from '../../../database/repository.interfaces/users/user/user.repo.interface';
import { IHealthProfileRepo } from '../../../database/repository.interfaces/users/patient/health.profile.repo.interface';
import { CurrentUser } from '../../../domain.types/miscellaneous/current.user';
import { PatientDomainModel } from '../../../domain.types/users/patient/patient/patient.domain.model';
import { PatientDetailsDto, PatientDto } from '../../../domain.types/users/patient/patient/patient.dto';
import { PatientDetailsSearchResults, PatientSearchFilters, PatientSearchResults } from '../../../domain.types/users/patient/patient/patient.search.types';
import { PersonDetailsDto } from '../../../domain.types/person/person.dto';
import { Roles } from '../../../domain.types/role/role.types';
import { PatientStore } from '../../../modules/ehr/services/patient.store';
import { Loader } from '../../../startup/loader';
import { uuid } from '../../../domain.types/miscellaneous/system.types';
import { PersonDomainModel } from '../../../domain.types/person/person.domain.model';
import { EHRAnalyticsHandler } from '../../../modules/ehr.analytics/ehr.analytics.handler';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class PatientService {

    _ehrPatientStore: PatientStore = null;

    constructor(
        @inject('IPatientRepo') private _patientRepo: IPatientRepo,
        @inject('IUserRepo') private _userRepo: IUserRepo,
        @inject('IPersonRepo') private _personRepo: IPersonRepo,
        @inject('IPersonRoleRepo') private _personRoleRepo: IPersonRoleRepo,
        @inject('IRoleRepo') private _roleRepo: IRoleRepo,
        @inject('IAddressRepo') private _addressRepo: IAddressRepo,
        @inject('IHealthProfileRepo') private _healthProfileRepo: IHealthProfileRepo,
    ) {
        if (ConfigurationManager.EhrEnabled()) {
            this._ehrPatientStore = Loader.container.resolve(PatientStore);
        }
    }

    //#region Publics

    create = async (patientDomainModel: PatientDomainModel): Promise<PatientDetailsDto> => {

        if (this._ehrPatientStore) {
            const ehrId = await this._ehrPatientStore.create(patientDomainModel);
            patientDomainModel.EhrId = ehrId;
        }
        var dto = await this._patientRepo.create(patientDomainModel);
        dto = await this.updateDetailsDto(dto);
        const role = await this._roleRepo.getByName(Roles.Patient);
        await this._personRoleRepo.addPersonRole(dto.User.Person.id, role.id);

        return dto;
    };

    public getByUserId = async (id: string): Promise<PatientDetailsDto> => {
        var dto = await this._patientRepo.getByUserId(id);
        dto = await this.updateDetailsDto(dto);
        if (dto == null) {
            return null;
        }
        var healthProfile = await this._healthProfileRepo.getByPatientUserId(id);
        dto.HealthProfile = healthProfile;
        return dto;
    };

    public getByPersonId = async (personId: string): Promise<PatientDetailsDto> => {
        var dto = await this._patientRepo.getByPersonId(personId);
        dto = await this.updateDetailsDto(dto);
        return dto;
    };

    public search = async (
        filters: PatientSearchFilters
    ): Promise<PatientDetailsSearchResults | PatientSearchResults> => {
        var items = [];
        var results = await this._patientRepo.search(filters);
        for await (var dto of results.Items) {
            dto = await this.updateDto(dto);
            items.push(dto);
        }

        if (items.length > 0) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const currentUser: CurrentUser = {
                UserId        : items[0].id,
                DisplayName   : items[0].DisplayName,
                Phone         : items[0].Phone,
                Email         : items[0].Email,
                UserName      : items[0].UserName,
                CurrentRoleId : 2,
            };

        }
        results.Items = items;
        return results;
    };

    public getPatientByPhone = async (
        filters: PatientSearchFilters
    ): Promise<PatientDetailsSearchResults | PatientSearchResults> => {
        var items = [];
        var results = await this._patientRepo.search(filters);
        for await (var dto of results.Items) {
            dto = await this.updateDto(dto);
            items.push(dto);
        }

        if (items.length > 0) {
            const currentUser: CurrentUser = {
                UserId        : items[0].id,
                DisplayName   : items[0].DisplayName,
                Phone         : items[0].Phone,
                Email         : items[0].Email,
                UserName      : items[0].UserName,
                CurrentRoleId : 2,
            };
            const accessToken = await Loader.authenticator.generateUserSessionToken(currentUser);
            items[0].accessToken = accessToken;
        }
        results.Items = items;
        return results;
    };

    public updateByUserId = async (id: string, updateModel: PatientDomainModel): Promise<PatientDetailsDto> => {
        var dto = await this._patientRepo.updateByUserId(id, updateModel);
        dto = await this.updateDetailsDto(dto);
        return dto;
    };

    public deleteByUserId = async (id: string): Promise<boolean> => {
        return await this._patientRepo.deleteByUserId(id);
    };

    public getAllPatientUserIds = async (): Promise<any[]> => {
        return await this._patientRepo.getAllPatientUserIds();
    };

    public getPatientsRegisteredLastMonth = async (): Promise<any[]> => {
        return await this._patientRepo.getPatientsRegisteredLastMonth();
    };

    public getAllRegisteredPatients = async (): Promise<any[]> => {
        return await this._patientRepo.getAllRegisteredPatients();
    };

    public checkforExistingPersonWithRole
        = async (domainModel: PatientDomainModel, roleId: number): Promise<PersonDetailsDto> => {

            const persons
                = await this._personRepo.getAllPersonsWithPhoneAndRole(domainModel.User.Person.Phone, roleId);
            if (persons.length > 0) {
                return persons[0];
            }
            return null;
        };

    //#endregion

    //#region Privates

    private updateDetailsDto = async (dto: PatientDetailsDto): Promise<PatientDetailsDto> => {
        if (dto == null) {
            return null;
        }

        var user = await this._userRepo.getById(dto.UserId);
        if (user == null) {
            return null;
        }

        if (user.Person == null) {
            user.Person = await this._personRepo.getById(user.PersonId);
        }
        const addresses = await this._personRepo.getAddresses(user.PersonId);
        user.Person.Addresses = addresses;
        dto.User = user;
        return dto;
    };

    private updateDto = async (dto: PatientDto): Promise<PatientDto> => {
        if (dto == null) {
            return null;
        }
        const user = await this._userRepo.getById(dto.UserId);
        if (user.Person == null) {
            user.Person = await this._personRepo.getById(user.PersonId);
        }
        dto.DisplayName = user.Person.DisplayName;
        dto.UserName = user.UserName;
        dto.Phone = user.Person.Phone;
        dto.Email = user.Person.Email;
        dto.Gender = user.Person.Gender;
        dto.BirthDate = user.Person.BirthDate;
        dto.Age = user.Person.Age;
        dto.FirstName = user.Person.FirstName;
        dto.LastName = user.Person.LastName;
        dto.ImageResourceId = user.Person.ImageResourceId;
        return dto;
    };

    public addEHRRecord = (patientUserId: uuid,
        model: PersonDomainModel, updatedModel: any, location: string, updatedHealthProfile: any, appName?: string) => {
        var details = {};
        if (model.BirthDate) {
            details['BirthDate'] = model.BirthDate;
        }
        if (updatedModel.User.Person.Age) {
            details['Age'] = updatedModel.User.Person.Age;
        }
        /*if (model.id) {
            EHRAnalyticsHandler.addOrUpdatePatient(patientUserId, {
                PersonId : model.id
            });
        }*/
        if (model.Gender) {
            details['Gender'] = model.Gender;
        }
        if (model.SelfIdentifiedGender) {
            details['SelfIdentifiedGender'] = model.SelfIdentifiedGender;
        }
        if (updatedHealthProfile && updatedHealthProfile.MaritalStatus) {
            details['MaritalStatus'] = updatedHealthProfile.MaritalStatus;
        }
        if (updatedHealthProfile && updatedHealthProfile.Ethnicity) {
            details['Ethnicity'] = updatedHealthProfile.Ethnicity;
        }
        if (updatedHealthProfile && updatedHealthProfile.Race) {
            details['Race'] = updatedHealthProfile.Race;
        }
        if (updatedModel.HealthSystem) {
            details['HealthSystem'] = updatedModel.HealthSystem;
        }
        if (updatedModel.AssociatedHospital) {
            details['AssociatedHospital'] = updatedModel.AssociatedHospital;
        }
        if (updatedHealthProfile && updatedHealthProfile.HasHeartAilment != null ) {
            details['HasHeartAilment'] = updatedHealthProfile.HasHeartAilment;
        }
        if (updatedHealthProfile && updatedHealthProfile.HasHighBloodPressure != null ) {
            details['HasHighBloodPressure'] = updatedHealthProfile.HasHighBloodPressure;
        }
        if (updatedHealthProfile && updatedHealthProfile.HasHighCholesterol != null ) {
            details['HasHighCholesterol'] = updatedHealthProfile.HasHighCholesterol;
        }
        if (updatedHealthProfile && updatedHealthProfile.IsDiabetic != null ) {
            details['IsDiabetic'] = updatedHealthProfile.IsDiabetic;
        }
        if (updatedHealthProfile && updatedHealthProfile.Occupation) {
            details['Occupation'] = updatedHealthProfile.Occupation;
        }
        if (updatedHealthProfile && updatedHealthProfile.MajorAilment) {
            details['MajorAilment'] = updatedHealthProfile.MajorAilment;
        }
        if (updatedHealthProfile && updatedHealthProfile.IsSmoker) {
            details['IsSmoker'] = updatedHealthProfile.IsSmoker;
        }
        if (updatedHealthProfile && updatedHealthProfile.BloodGroup) {
            details['BloodGroup'] = updatedHealthProfile.BloodGroup;
        }
        if (updatedHealthProfile && updatedHealthProfile.Nationality) {
            details['Nationality'] = updatedHealthProfile.Nationality;
        }
        if (location) {
            details['Location'] = location;
        }
        if (updatedHealthProfile && updatedHealthProfile.OtherConditions) {
            details['OtherConditions'] = updatedHealthProfile.OtherConditions;
        }
        if (updatedModel.DoctorPersonId_1) {
            details['DoctorPersonId_1'] = updatedModel.DoctorPersonId_1;
        }
        if (updatedModel.DoctorPersonId_2) {
            details['DoctorPersonId_2'] = updatedModel.DoctorPersonId_2;
        }
        details['RecordDate'] = new Date(updatedModel.CreatedAt);
        if (updatedHealthProfile && updatedHealthProfile.CreatedAt) {
            details['RecordDate'] = new Date(updatedHealthProfile.CreatedAt);
        }
        
        EHRAnalyticsHandler.addOrUpdatePatient(patientUserId, details, appName);
    };

    //#endregion

}
