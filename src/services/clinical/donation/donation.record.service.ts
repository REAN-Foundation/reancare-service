import { inject, injectable } from 'tsyringe';
import { IDonationRecordRepo } from '../../../database/repository.interfaces/clinical/donation/donation.record.repo.interface';
import { DonationRecordDomainModel } from '../../../domain.types/clinical/donation.record/donation.record.domain.model';
import { DonationRecordDto } from '../../../domain.types/clinical/donation.record/donation.record.dto';
import { DonationRecordSearchFilters } from '../../../domain.types/clinical/donation.record/donation.record.search.types';
import { DonationRecordSearchResults } from '../../../domain.types/clinical/donation.record/donation.record.search.types';
import { IPatientDonorsRepo } from '../../../database/repository.interfaces/clinical/donation/patient.donors.repo.interface';
import { IPatientRepo } from '../../../database/repository.interfaces/users/patient/patient.repo.interface';
import { DonorAcceptance } from '../../../domain.types/miscellaneous/clinical.types';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class DonationRecordService {

    constructor(
        @inject('IDonationRecordRepo') private _donationRecordRepo: IDonationRecordRepo,
        @inject('IPatientDonorsRepo') private _patientDonorsRepo: IPatientDonorsRepo,
        @inject('IPatientRepo') private _patientRepo: IPatientRepo,
    ) {}

    //#region Publics

    public create = async (donationRecordDomainModel: DonationRecordDomainModel): Promise<DonationRecordDto> => {

        var dto = await this._donationRecordRepo.create(donationRecordDomainModel);
        if (dto.PatientUserId !== null) {
            await this._patientRepo.updateByUserId( dto.PatientUserId ,{ "DonorAcceptance": DonorAcceptance.Send });
        }
        dto = await this.updateDetailsDto(dto);
        return dto;
    };

    public getById = async (id: string): Promise<DonationRecordDto> => {
        var dto = await this._donationRecordRepo.getById(id);
        dto = await this.updateDetailsDto(dto);
        return dto;
    };

    public search = async (
        filters: DonationRecordSearchFilters
    ): Promise<DonationRecordSearchResults> => {
        var items = [];
        var results = await this._donationRecordRepo.search(filters);
        for await (var dto of results.Items) {
            dto = await this.updateDetailsDto(dto);
            items.push(dto);
        }
        results.Items = items;
        return results;
    };

    public update = async (
        id: string,
        updateModel: DonationRecordDomainModel
    ): Promise<DonationRecordDto> => {
        var dto = await this._donationRecordRepo.update(id, updateModel);
        if (updateModel.DonorAcceptedDate !== null) {
            await this._patientRepo.updateByUserId( dto.PatientUserId ,{ "DonorAcceptance": DonorAcceptance.Accepted });
        }
        if (updateModel.DonorRejectedDate !== null) {
            await this._patientRepo.updateByUserId( dto.PatientUserId ,{ "DonorAcceptance": DonorAcceptance.NotSend });
        }
        dto = await this.updateDetailsDto(dto);
        return dto;
    };

    public delete = async (id: string): Promise<boolean> => {
        return await this._donationRecordRepo.delete(id);
    };

    //#endregion

    //#region Privates

    private updateDetailsDto = async (dto: DonationRecordDto): Promise<DonationRecordDto> => {
        if (dto == null) {
            return null;
        }
        if (dto.NetworkId) {
            var patientDonors = await this._patientDonorsRepo.getById(dto.NetworkId);
            dto.DonationDetails = patientDonors;
        }
        return dto;
    };

    //#endregion

}
