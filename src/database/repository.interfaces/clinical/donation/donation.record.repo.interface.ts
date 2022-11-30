import { DonationRecordDomainModel } from "../../../../domain.types/clinical/donation.record/donation.record.domain.model";
import { DonationRecordDto } from "../../../../domain.types/clinical/donation.record/donation.record.dto";
import { DonationRecordSearchResults, DonationRecordSearchFilters } from "../../../../domain.types/clinical/donation.record/donation.record.search.types";

export interface IDonationRecordRepo {

    create(entity: DonationRecordDomainModel): Promise<DonationRecordDto>;

    getById(userId: string): Promise<DonationRecordDto>;

    update(userId: string, updateModel: DonationRecordDomainModel): Promise<DonationRecordDto>;

    search(filters: DonationRecordSearchFilters): Promise<DonationRecordSearchResults>;
    
    delete(userId: string): Promise<boolean>;

}
