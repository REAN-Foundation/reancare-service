import { DiagnosisDomainModel } from "../../domain.types/diagnosis/diagnosis.domain.model";
import { DiagnosisDto } from "../../domain.types/diagnosis/diagnosis.dto";
import { DiagnosisSearchFilters, DiagnosisSearchResults } from "../../domain.types/diagnosis/diagnosis.search.types";

export interface IDiagnosisRepo {
    
    create(entity: DiagnosisDomainModel): Promise<DiagnosisDto>;

    getById(id: string): Promise<DiagnosisDto>;

    update(id: string, updateModel: DiagnosisDomainModel): Promise<DiagnosisDto>;

    search(filters: DiagnosisSearchFilters): Promise<DiagnosisSearchResults>;

    delete(id: string): Promise<boolean>;

    // searchFull(filters: DoctorSearchFilters): Promise<DoctorDetailsSearchResults>;
}
