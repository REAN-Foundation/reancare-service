
import { PatientDomainModel, PatientSearchFilters } from '../../../data/domain.types/patient.domain.types';
import { AddressDomainModel } from '../../../data/domain.types/address.domain.types';

export interface IPatientStore {
    create(patientDomainModel: PatientDomainModel): Promise<any>;
    search(filter: PatientSearchFilters): Promise<any>;
    getById(id: string): Promise<any>;
    update(updates: PatientDomainModel): Promise<any>;
    delete(id: string): Promise<any>;
}
