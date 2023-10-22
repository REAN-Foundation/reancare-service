import { DonationDomainModel } from "../../../../domain.types/assorted/blood.donation/donation/donation.domain.model";
import { DonationDto } from "../../../../domain.types/assorted/blood.donation/donation/donation.dto";
import { DonationSearchFilters, DonationSearchResults } from "../../../../domain.types/assorted/blood.donation/donation/donation.search.types";

export interface IDonationRepo {

    create(entity: DonationDomainModel): Promise<DonationDto>;

    getById(userId: string): Promise<DonationDto>;

    update(userId: string, updateModel: DonationDomainModel): Promise<DonationDto>;

    search(filters: DonationSearchFilters): Promise<DonationSearchResults>;

    delete(userId: string): Promise<boolean>;

}
