import { DiagnosticConditionDomainModel } from "../../../domain.types/clinical/diagnosis/diagnostic.condition.domain.model";

export interface IDiagnosticConditionStore {
    add(diagnosticConditionDomainModel: DiagnosticConditionDomainModel): Promise<any>;
    getById(id: string): Promise<any>;
    update(id: string, updates: DiagnosticConditionDomainModel): Promise<any>;
    delete(id: string): Promise<any>;
}
