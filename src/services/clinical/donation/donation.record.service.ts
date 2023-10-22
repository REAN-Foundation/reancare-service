import { inject, injectable } from 'tsyringe';
import { IDonationRepo } from '../../../database/repository.interfaces/assorted/blood.donation/donation.repo.interface';
import { IBridgeRepo } from '../../../database/repository.interfaces/assorted/blood.donation/bridge.repo.interface';
import { IPatientRepo } from '../../../database/repository.interfaces/users/patient/patient.repo.interface';
import { DonorAcceptance } from '../../../domain.types/miscellaneous/clinical.types';
import { DonationDomainModel } from '../../../domain.types/assorted/blood.donation/donation/donation.domain.model';
import { DonationSearchFilters } from '../../../domain.types/assorted/blood.donation/donation/donation.search.types';
import { DonationSearchResults } from '../../../domain.types/assorted/blood.donation/donation/donation.search.types';
import { DonationDto } from '../../../domain.types/assorted/blood.donation/donation/donation.dto';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class DonationService {

    constructor(
        @inject('IDonationRepo') private _donationRecordRepo: IDonationRepo,
        @inject('IPatientDonorsRepo') private _patientDonorsRepo: IBridgeRepo,
        @inject('IPatientRepo') private _patientRepo: IPatientRepo,
    ) {}

    //#region Publics

    public create = async (donationRecordDomainModel: DonationDomainModel): Promise<DonationDto> => {

        var dto = await this._donationRecordRepo.create(donationRecordDomainModel);
        if (dto.PatientUserId !== null) {
            await this._patientRepo.updateByUserId( dto.PatientUserId ,{ "DonorAcceptance": DonorAcceptance.Send });
        }
        dto = await this.updateDetailsDto(dto);
        return dto;
    };

    public getById = async (id: string): Promise<DonationDto> => {
        var dto = await this._donationRecordRepo.getById(id);
        dto = await this.updateDetailsDto(dto);
        return dto;
    };

    public search = async (
        filters: DonationSearchFilters
    ): Promise<DonationSearchResults> => {
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
        updateModel: DonationDomainModel
    ): Promise<DonationDto> => {
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

    private updateDetailsDto = async (dto: DonationDto): Promise<DonationDto> => {
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
