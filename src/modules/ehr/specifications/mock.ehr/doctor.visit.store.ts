/* eslint-disable @typescript-eslint/no-unused-vars */
import { DoctorVisitDomainModel } from '../../../../domain.types/clinical/doctor.visit/doctor.visit.domain.model';
import { IDoctorVisitStore } from '../../interfaces/doctor.visit.store.interface';

////////////////////////////////////////////////////////////////////////////////

export class MockDoctorVisitStore implements IDoctorVisitStore {

    create = async (model: DoctorVisitDomainModel): Promise<any> => {
        return null;
    };

    getById = async (resourceId: string): Promise<any> => {
        return null;
    };

    search = async (filter: any): Promise<any> => {
        return null;
    };

    update = async (updates: any): Promise<any> => {
        return null;
    };

    delete = async (id: string): Promise<any> => {
        return true;
    };

}
