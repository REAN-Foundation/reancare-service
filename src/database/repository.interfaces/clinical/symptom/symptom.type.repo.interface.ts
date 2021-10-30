import { SymptomTypeDomainModel } from "../../../../domain.types/clinical/symptom/symptom.type/symptom.type.domain.model";
import { SymptomTypeDto } from "../../../../domain.types/clinical/symptom/symptom.type/symptom.type.dto";
import { SymptomTypeSearchFilters, SymptomTypeSearchResults } from "../../../../domain.types/clinical/symptom/symptom.type/symptom.type.search.types";

export interface ISymptomTypeRepo {

    create(addressDomainModel: SymptomTypeDomainModel): Promise<SymptomTypeDto>;

    getById(id: string): Promise<SymptomTypeDto>;

    getByName(name: string): Promise<SymptomTypeDto>;

    search(filters: SymptomTypeSearchFilters): Promise<SymptomTypeSearchResults>;

    update(id: string, addressDomainModel: SymptomTypeDomainModel): Promise<SymptomTypeDto>;

    delete(id: string): Promise<boolean>;

    totalCount(): Promise<number>;

}
