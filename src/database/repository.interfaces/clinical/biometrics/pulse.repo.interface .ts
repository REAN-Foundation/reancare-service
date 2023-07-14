import { PulseDomainModel } from "../../../../domain.types/clinical/biometrics/pulse/pulse.domain.model";
import { PulseDto } from "../../../../domain.types/clinical/biometrics/pulse/pulse.dto";
import { PulseSearchFilters, PulseSearchResults } from "../../../../domain.types/clinical/biometrics/pulse/pulse.search.types";

export interface IPulseRepo {

    create(pulseDomainModel: PulseDomainModel): Promise<PulseDto>;

    getById(id: string): Promise<PulseDto>;
    
    search(filters: PulseSearchFilters): Promise<PulseSearchResults>;

    update(id: string, pulseDomainModel: PulseDomainModel):
    Promise<PulseDto>;

    delete(id: string): Promise<boolean>;

    getAllUserResponsesBetween(patientUserId: string, dateFrom: Date, dateTo: Date): Promise<any[]>;

    getAllUserResponsesBefore(patientUserId: string, date: Date): Promise<any[]>;

    getRecent(patientUserId: string): Promise<PulseDto>;

}
