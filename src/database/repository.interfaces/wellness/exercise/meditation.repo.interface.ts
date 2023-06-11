import { MeditationDomainModel } from "../../../../domain.types/wellness/exercise/meditation/meditation.domain.model";
import { MeditationDto } from "../../../../domain.types/wellness/exercise/meditation/meditation.dto";
import { MeditationSearchFilters, MeditationSearchResults } from "../../../../domain.types/wellness/exercise/meditation/meditation.search.types";

export interface IMeditationRepo {

    create(meditationDomainModel: MeditationDomainModel): Promise<MeditationDto>;

    getById(id: string): Promise<MeditationDto>;
    
    search(filters: MeditationSearchFilters): Promise<MeditationSearchResults>;

    update(id: string, meditationDomainModel: MeditationDomainModel):
    Promise<MeditationDto>;

    delete(id: string): Promise<boolean>;

    getAllUserResponsesBetween(patientUserId: string, dateFrom: Date, dateTo: Date): Promise<any[]>;

    getAllUserResponsesBefore(patientUserId: string, date: Date): Promise<any[]>;

}
