import { DonationCommunicationDomainModel } from "../../../../domain.types/assorted/blood.donation/communication/communication.domain.model";
import { DonationCommunicationDto } from "../../../../domain.types/assorted/blood.donation/communication/communication.dto";
import { DonationCommunicationSearchFilters, DonationCommunicationSearchResults } from "../../../../domain.types/assorted/blood.donation/communication/communication.search.types";

export interface IDonationCommunicationRepo {

    create(entity: DonationCommunicationDomainModel): Promise<DonationCommunicationDto>;

    getById(userId: string): Promise<DonationCommunicationDto>;

    update(userId: string, updateModel: DonationCommunicationDomainModel): Promise<DonationCommunicationDto>;

    search(filters: DonationCommunicationSearchFilters): Promise<DonationCommunicationSearchResults>;

    delete(userId: string): Promise<boolean>;

    getByPatientUserId(patientUserId: string): Promise<DonationCommunicationDto>;

}
