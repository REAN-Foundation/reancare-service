import { MedicalConditionDomainModel } from "../../../domain.types/clinical/medical.condition/medical.condition.domain.model";
import { MedicalConditionDto } from "../../../domain.types/clinical/medical.condition/medical.condition.dto";
import { MedicalConditionSearchFilters, MedicalConditionSearchResults } from "../../../domain.types/clinical/medical.condition/medical.condition.search.types";

export interface IMedicalConditionRepo {

    create(medicalConditionDomainModel: MedicalConditionDomainModel): Promise<MedicalConditionDto>;

    getById(id: string): Promise<MedicalConditionDto>;
    
    search(filters: MedicalConditionSearchFilters): Promise<MedicalConditionSearchResults>;

    update(id: string, medicalConditionDomainModel: MedicalConditionDomainModel):
    Promise<MedicalConditionDto>;

    delete(id: string): Promise<boolean>;

}
