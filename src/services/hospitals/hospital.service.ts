import { inject, injectable } from "tsyringe";
import { IHospitalRepo } from "../../database/repository.interfaces/hospitals/hospital.repo.interface";
import { HospitalDomainModel } from '../../domain.types/hospitals/hospital/hospital.domain.model';
import { HospitalDto } from '../../domain.types/hospitals/hospital/hospital.dto';
import { HospitalSearchResults, HospitalSearchFilters } from '../../domain.types/hospitals/hospital/hospital.search.types';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class HospitalService {

    constructor(
        @inject('IHospitalRepo') private _hospitalRepo: IHospitalRepo,
    ) {}

    create = async (hospitalDomainModel: HospitalDomainModel): Promise<HospitalDto> => {
        return await this._hospitalRepo.create(hospitalDomainModel);
    };

    getById = async (id: string): Promise<HospitalDto> => {
        return await this._hospitalRepo.getById(id);
    };

    search = async (filters: HospitalSearchFilters): Promise<HospitalSearchResults> => {
        return await this._hospitalRepo.search(filters);
    };

    update = async (id: string, hospitalDomainModel: HospitalDomainModel): Promise<HospitalDto> => {
        return await this._hospitalRepo.update(id, hospitalDomainModel);
    };

    delete = async (id: string): Promise<boolean> => {
        return await this._hospitalRepo.delete(id);
    };

    getHospitalsForHealthSystem = async (healthSystemId: string): Promise<HospitalDto[]> => {
        return await this._hospitalRepo.getHospitalsForHealthSystem(healthSystemId);
    };

}
