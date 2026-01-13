import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { inject, injectable } from "tsyringe";
import { IVaccinationRepo } from "../../../database/repository.interfaces/clinical/maternity/vaccination.repo.interface";
import { VaccinationDomainModel } from "../../../domain.types/clinical/maternity/vaccination/vaccination.domain.model";
import { VaccinationDto } from "../../../domain.types/clinical/maternity/vaccination/vaccination.dto";
import { VaccinationSearchFilters, VaccinationSearchResults } from "../../../domain.types/clinical/maternity/vaccination/vaccination.search.type";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class VaccinationService {

    constructor(
        @inject('IVaccinationRepo') private _vaccinationRepo: IVaccinationRepo,
    ) { }

    create = async (vaccinationDomainModel: VaccinationDomainModel): Promise<VaccinationDto> => {
        return await this._vaccinationRepo.create(vaccinationDomainModel);
    };

    getById = async (vaccinationId: uuid): Promise<VaccinationDto> => {
        return await this._vaccinationRepo.getById(vaccinationId);
    };

    search = async (filters: VaccinationSearchFilters): Promise<VaccinationSearchResults> => {
        return await this._vaccinationRepo.search(filters);
    };

    update = async (vaccinationId: uuid, vaccinationDomainModel: VaccinationDomainModel): Promise<VaccinationDto> => {
        return await this._vaccinationRepo.update(vaccinationId, vaccinationDomainModel);
    };

    delete = async (vaccinationId: uuid): Promise<boolean> => {
        return await this._vaccinationRepo.delete(vaccinationId);
    };

}
