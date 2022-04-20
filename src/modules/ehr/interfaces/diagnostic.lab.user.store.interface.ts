import { DiagnosticLabUserDomainModel } from '../../../domain.types/diagnostic.lab.user/diagnostic.lab.user.domain.model';

////////////////////////////////////////////////////////////////////////////////////

export interface IDiagnosticLabUserStore {
    search(filter: any): any;
    create(DiagnosticLabUserDomainModel: DiagnosticLabUserDomainModel): Promise<any>;
    getById(id: string): Promise<any>;
    update(id: string, updates: DiagnosticLabUserDomainModel): Promise<any>;
    delete(id: string): Promise<any>;
}
