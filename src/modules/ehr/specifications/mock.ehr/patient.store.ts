/* eslint-disable @typescript-eslint/no-unused-vars */
import { PatientDomainModel } from '../../../../domain.types/users/patient/patient/patient.domain.model';
import { IPatientStore } from '../../interfaces/patient.store.interface';

////////////////////////////////////////////////////////////////////////////////

export class MockPatientStore implements IPatientStore {

    create = async (model: PatientDomainModel): Promise<any> => {
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
