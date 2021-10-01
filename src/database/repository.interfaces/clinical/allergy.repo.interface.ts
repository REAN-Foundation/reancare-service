import { AllergyDomainModel } from "../../../domain.types/clinical/allergy/allergy.domain.model";
import { AllergyDto } from "../../../domain.types/clinical/allergy/allergy.dto";

export interface IAllergyRepo {

    create(allergyDomainModel: AllergyDomainModel): Promise<AllergyDto>;

    getById(id: string): Promise<AllergyDto>;

    search(id: string): Promise<AllergyDto[]>;

    update(id: string, allergyDomainModel: AllergyDomainModel): Promise<AllergyDto>;

    delete(id: string): Promise<boolean>;

}
