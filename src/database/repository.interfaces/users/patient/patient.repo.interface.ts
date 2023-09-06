import { PatientDomainModel } from '../../../../domain.types/users/patient/patient/patient.domain.model';
import { PatientSearchFilters, PatientSearchResults } from '../../../../domain.types/users/patient/patient/patient.search.types';
import { PatientDetailsDto } from '../../../../domain.types/users/patient/patient/patient.dto';
import { AuthDomainModel } from '../.../../../../../domain.types/webhook/auth.domain.model';
import { ReAuthDomainModel } from '../../../../domain.types/webhook/reauth.domain.model';

export interface IPatientRepo {

    create(entity: PatientDomainModel): Promise<PatientDetailsDto>;

    getByUserId(userId: string): Promise<PatientDetailsDto>;

    getByPersonId(personId: string): Promise<PatientDetailsDto>;

    updateByUserId(userId: string, updateModel: PatientDomainModel): Promise<PatientDetailsDto>;

    search(filters: PatientSearchFilters): Promise<PatientSearchResults>;

    deleteByUserId(userId: string): Promise<boolean>;

    getAllPatientUserIds(): Promise<any[]>;

    getPatientsRegisteredLastMonth(): Promise<any[]>;

    getAllRegisteredPatients(): Promise<any[]>;

    terraAuth(userId: string, updateModel: AuthDomainModel);

    terraReAuth(userId: string, updateModel: ReAuthDomainModel);

    // searchFull(filters: PatientSearchFilters): Promise<PatientDetailsSearchResults>;
}
