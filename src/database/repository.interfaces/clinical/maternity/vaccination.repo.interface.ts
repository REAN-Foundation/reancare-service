import { VaccinationDomainModel } from "../../../../domain.types/clinical/maternity/vaccination/vaccination.domain.model";
import { VaccinationDto } from "../../../../domain.types/clinical/maternity/vaccination/vaccination.dto";
import { VaccinationSearchFilters, VaccinationSearchResults } from "../../../../domain.types/clinical/maternity/vaccination/vaccination.search.type";

export interface IVaccinationRepo {

    create(vaccinationDomainModel: VaccinationDomainModel): Promise<VaccinationDto>;

    getById(vaccinationId: string): Promise<VaccinationDto>;

    search(filters: VaccinationSearchFilters): Promise<VaccinationSearchResults>;

    update(vaccinationId: string, vaccinationDomainModel: VaccinationDomainModel): Promise<VaccinationDto>;

    delete(vaccinationId: string): Promise<boolean>;

}
