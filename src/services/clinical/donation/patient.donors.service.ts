import { inject, injectable } from 'tsyringe';
import { IPersonRepo } from '../../../database/repository.interfaces/person/person.repo.interface';
import { IUserRepo } from '../../../database/repository.interfaces/users/user/user.repo.interface';
import { PatientDonorsSearchFilters, PatientDonorsSearchResults } from '../../../domain.types/clinical/donation/patient.donors.search.types';
import { IPatientDonorsRepo } from '../../../database/repository.interfaces/clinical/donation/patient.donors.repo.interface';
import { PatientDonorsDomainModel } from '../../../domain.types/clinical/donation/patient.donors.domain.model';
import { PatientDonorsDto } from '../../../domain.types/clinical/donation/patient.donors.dto';
import { TimeHelper } from "../../../common/time.helper";
import { IDonorRepo } from '../../../database/repository.interfaces/users/donor.repo.interface';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class PatientDonorsService {

    constructor(
        @inject('IPatientDonorsRepo') private _patientDonorsRepo: IPatientDonorsRepo,
        @inject('IUserRepo') private _userRepo: IUserRepo,
        @inject('IPersonRepo') private _personRepo: IPersonRepo,
        @inject('IDonorRepo') private _donorRepo: IDonorRepo
    ) {}

    //#region Publics

    public create = async (patientDonorsDomainModel: PatientDonorsDomainModel): Promise<PatientDonorsDto> => {

        var dto = await this._patientDonorsRepo.create(patientDonorsDomainModel);
        dto = await this.updateDetailsDto(dto);

        return dto;
    };

    public getById = async (id: string): Promise<PatientDonorsDto> => {
        var dto = await this._patientDonorsRepo.getById(id);
        dto = await this.updateDetailsDto(dto);
        return dto;
    };

    public search = async (
        filters: PatientDonorsSearchFilters
    ): Promise<PatientDonorsSearchResults> => {
        var items = [];
        var results = await this._patientDonorsRepo.search(filters);
        for await (var dto of results.Items) {
            if (filters.OnlyElligible === true) {
                dto = await this.elligibleDonors(dto);
                if (dto === null) {
                    continue;
                }
            } else {
                dto = await this.updateDetailsDto(dto);
            }
            items.push(dto);
        }
        results.Items = items;
        results.RetrievedCount = items.length;
        return results;
    };

    public update = async (
        id: string,
        updateModel: PatientDonorsDomainModel
    ): Promise<PatientDonorsDto> => {
        var dto = await this._patientDonorsRepo.update(id, updateModel);
        dto = await this.updateDetailsDto(dto);
        return dto;
    };

    public delete = async (id: string): Promise<boolean> => {
        return await this._patientDonorsRepo.delete(id);
    };

    //#endregion

    //#region Privates

    private updateDetailsDto = async (dto: PatientDonorsDto): Promise<PatientDonorsDto> => {
        if (dto == null) {
            return null;
        }
        var donor = await this._donorRepo.getByUserId(dto.DonorUserId);
        const user = await this._userRepo.getById(dto.DonorUserId);
        dto.Donor = donor;
        const person = await this._personRepo.getById(user.PersonId);
        dto.DonorGender = person.Gender;
        dto.DonorName = person.DisplayName;
        dto.DonorPhone = person.Phone;
        return dto;
    };

    private elligibleDonors = async (dto: PatientDonorsDto): Promise<PatientDonorsDto > => {
        if (dto == null) {
            return null;
        }
        const user = await this._userRepo.getById(dto.DonorUserId);
        var donor = await this._donorRepo.getByUserId(dto.DonorUserId);
        dto.Donor = donor;
        if (user.Person == null) {
            user.Person = await this._personRepo.getById(user.PersonId);
        }
        dto.DonorGender = user.Person.Gender;
        dto.DonorName = user.Person.DisplayName;
        dto.DonorPhone =  user.Person.Phone;
        if (user.Person.Gender === 'Male' ) {
            const dayDiff = Math.floor(TimeHelper.dayDiff(new Date(), dto.LastDonationDate));
            return dayDiff > 90 ? dto : null;
        }
        else if (user.Person.Gender === 'Female' ) {
            const dayDiff = Math.floor(TimeHelper.dayDiff(new Date(), dto.LastDonationDate));
            return dayDiff > 120 ? dto : null;
        }
    };

    //#endregion

}
