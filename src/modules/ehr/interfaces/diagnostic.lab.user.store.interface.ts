import { DiagnosticLabUserDomainModel } from '../../../domain.types/users/diagnostic.lab.user/diagnostic.lab.user.domain.model';

////////////////////////////////////////////////////////////////////////////////////

export interface IDiagnosticLabUserStore {
    create(DiagnosticLabUserDomainModel: DiagnosticLabUserDomainModel): Promise<any>;
    getById(id: string): Promise<any>;
    update(id: string, updates: DiagnosticLabUserDomainModel): Promise<any>;
    delete(id: string): Promise<any>;
}
