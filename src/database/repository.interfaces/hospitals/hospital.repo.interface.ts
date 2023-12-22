import { HospitalDomainModel } from "../../../domain.types/hospitals/hospital/hospital.domain.model";
import { HospitalDto } from "../../../domain.types/hospitals/hospital/hospital.dto";
import { HospitalSearchFilters, HospitalSearchResults } from "../../../domain.types/hospitals/hospital/hospital.search.types";

export interface IHospitalRepo {

    create(model: HospitalDomainModel): Promise<HospitalDto>;

    getById(id: string): Promise<HospitalDto>;

    search(filters: HospitalSearchFilters): Promise<HospitalSearchResults>;

    update(id: string, model: HospitalDomainModel): Promise<HospitalDto>;

    delete(id: string): Promise<boolean>;

    getHospitalsForHealthSystem(healthSystemId: string): Promise<HospitalDto[]>;

}
