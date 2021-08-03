import { Loader } from '../startup/loader';
import { IPatientRepo } from '../data/repository.interfaces/patient.repo.interface';
import { IUserRepo } from '../data/repository.interfaces/user.repo.interface';
import { IPersonRoleRepo } from '../data/repository.interfaces/person.role.repo.interface';
import { IRoleRepo } from '../data/repository.interfaces/role.repo.interface';
import { IOtpRepo } from '../data/repository.interfaces/otp.repo.interface';
import { IMessagingService } from '../modules/communication/interfaces/messaging.service.interface';
import { PatientDomainModel, PatientDetailsDto, PatientSearchFilters, PatientDetailsSearchResults, PatientSearchResults } from '../data/domain.types/patient.domain.types';
import { injectable, inject } from 'tsyringe';
import { ApiError } from '../common/api.error';
import { Roles } from '../data/domain.types/role.domain.types';
import { PatientStore } from '../modules/ehr/services/patient.store';
import { IPersonRepo } from '../data/repository.interfaces/person.repo.interface';
import { Helper } from '../common/helper';

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
        @inject('IOtpRepo') private _otpRepo: IOtpRepo,
        @inject('IMessagingService') private _messagingService: IMessagingService
    ) {
        this._ehrPatientStore = Loader.container.resolve(PatientStore);
    }

    create = async (patientDomainModel: PatientDomainModel): Promise<PatientDetailsDto> => {
        
        const ehrId = await this._ehrPatientStore.create(patientDomainModel);
        patientDomainModel.EhrId = ehrId;

        const patientDto = await this._patientRepo.create(patientDomainModel);
        const role = await this._roleRepo.getByName(Roles.Patient);
        await this._personRoleRepo.addPersonRole(patientDto.User.Person.id, role.id);

        return patientDto;
    };

    public getByUserId = async (id: string): Promise<PatientDetailsDto> => {
        return await this._patientRepo.getByUserId(id);
    };

    public search = async (
        filters: PatientSearchFilters
    ): Promise<PatientDetailsSearchResults | PatientSearchResults> => {
        return await this._patientRepo.search(filters);
    };

    public updateByUserId = async (
        id: string,
        updateModel: PatientDomainModel
    ): Promise<PatientDetailsDto> => {
        return await this._patientRepo.updateByUserId(id, updateModel);
    };

    public checkforDuplicatePatients = async (domainModel: PatientDomainModel): Promise<number> => {
        const role = await this._roleRepo.getByName(Roles.Patient);
        if (role == null) {
            throw new ApiError(404, 'Role- ' + Roles.Patient + ' does not exist!');
        }
        const persons = await this._personRepo.getAllPersonsWithPhoneAndRole(
            domainModel.User.Person.Phone,
            role.id
        );

        let displayName = Helper.constructPersonDisplayName(
            domainModel.User.Person.Prefix,
            domainModel.User.Person.FirstName,
            domainModel.User.Person.LastName
        );
        displayName = displayName.toLowerCase();

        //compare display name with all users sharing same phone number
        for (const person of persons) {
            const name = person.DisplayName.toLowerCase();
            if (name === displayName) {
                throw new ApiError(409, 'Patient with same name and phone number exists!');
            }
        }
        return persons.length;
    };

}
