
import { PatientSearchFilters } from '../../../domain.types/patient/patient/patient.search.types';
import { PatientDomainModel } from '../../../domain.types/patient/patient/patient.domain.model';

export interface IPatientStore {
    create(patientDomainModel: PatientDomainModel): Promise<any>;
    search(filter: PatientSearchFilters): Promise<any>;
    getById(id: string): Promise<any>;
    update(id: string, updates: PatientDomainModel): Promise<any>;
    delete(id: string): Promise<any>;
}
