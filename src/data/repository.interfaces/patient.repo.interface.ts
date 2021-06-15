import { PatientDetailsDto, PatientDto, PatientDomainModel } from '../domain.types/patient.domain.types';


export interface IPatientRepo {

    create(entity: PatientDomainModel): Promise<PatientDetailsDto>;

    getByUserId(userId: string): Promise<PatientDetailsDto>;

    updateByUserId(userId: string, updateModel: PatientDomainModel): Promise<PatientDetailsDto>;

    delete(userId: string): Promise<boolean>;

    searchLight(filters: any): Promise<PatientDto[]>;

    searchFull(filters: any): Promise<PatientDetailsDto[]>;

}
