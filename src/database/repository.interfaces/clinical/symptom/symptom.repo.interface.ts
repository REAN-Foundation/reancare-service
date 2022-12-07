import { SymptomDomainModel } from "../../../../domain.types/clinical/symptom/symptom/symptom.domain.model";
import { SymptomDto } from "../../../../domain.types/clinical/symptom/symptom/symptom.dto";
import { SymptomSearchFilters, SymptomSearchResults } from "../../../../domain.types/clinical/symptom/symptom/symptom.search.types";

export interface ISymptomRepo {

    create(addressDomainModel: SymptomDomainModel): Promise<SymptomDto>;

    getById(id: string): Promise<SymptomDto>;

    search(filters: SymptomSearchFilters): Promise<SymptomSearchResults>;

    update(id: string, addressDomainModel: SymptomDomainModel): Promise<SymptomDto>;

    delete(id: string): Promise<boolean>;

    getStats(patientUserId: string, numMonths: number): Promise<any>;

}
