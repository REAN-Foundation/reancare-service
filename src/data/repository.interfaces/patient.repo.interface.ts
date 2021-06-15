import { PatientDto, PatientDtoLight, PatientDomainModel } from '../domain.types/patient.domain.types';


export interface IPatientRepo {

    create(entity: PatientDomainModel): Promise<PatientDto>;

    getByUserId(userId: string): Promise<PatientDto>;

    updateByUserId(userId: string, updateModel: PatientDomainModel): Promise<PatientDto>;

    delete(userId: string): Promise<boolean>;

    searchLight(filters: any): Promise<PatientDtoLight[]>;

    searchFull(filters: any): Promise<PatientDto[]>;

}
