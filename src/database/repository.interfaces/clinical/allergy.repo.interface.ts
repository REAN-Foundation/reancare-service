import { AllergyDomainModel } from "../../../domain.types/clinical/allergy/allergy.domain.model";
import { AllergyDto } from "../../../domain.types/clinical/allergy/allergy.dto";
import { AllergySearchFilters, AllergySearchResults } from "../../../domain.types/clinical/allergy/allergy.search.types";

export interface IAllergyRepo {

    create(allergyDomainModel: AllergyDomainModel): Promise<AllergyDto>;

    getById(id: string): Promise<AllergyDto>;

    getForPatient(id: string): Promise<AllergyDto[]>;

    search(filters: AllergySearchFilters): Promise<AllergySearchResults>;

    update(id: string, allergyDomainModel: AllergyDomainModel): Promise<AllergyDto>;

    delete(id: string): Promise<boolean>;

}
