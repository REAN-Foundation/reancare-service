import { DiagnosisDomainModel } from "../../../domain.types/clinical/diagnosis/diagnosis.domain.model";
import { DiagnosisDto, DiagnosisEventDto } from "../../../domain.types/clinical/diagnosis/diagnosis.dto";
import { DiagnosisSearchFilters, DiagnosisSearchResults } from "../../../domain.types/clinical/diagnosis/diagnosis.search.types";

export interface IDiagnosisRepo {
    
    create(entity: DiagnosisDomainModel): Promise<DiagnosisDto>;

    getById(id: string): Promise<DiagnosisDto>;

    getByEvent(event: string, patientUserId: string): Promise<DiagnosisEventDto>;

    update(id: string, updateModel: DiagnosisDomainModel): Promise<DiagnosisDto>;

    search(filters: DiagnosisSearchFilters): Promise<DiagnosisSearchResults>;

    delete(id: string): Promise<boolean>;

}
