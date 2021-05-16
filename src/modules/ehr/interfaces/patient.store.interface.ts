
import { EHRTypes } from '../types/patient.types';

export interface IPatientStore {
    create(body: any): Promise<any>;
    search(filter: any): Promise<any>;
    getById(id: string): Promise<any>;
    update(updates: any): Promise<any>;
    delete(id: string): Promise<any>;
}
