/* eslint-disable @typescript-eslint/no-unused-vars */
import { ImagingStudyDomainModel } from '../../../../domain.types/imaging.study/imaging.study.domain.model';
import { IImagingStudyStore } from '../../interfaces/imaging.study.store.interface';

////////////////////////////////////////////////////////////////////////////////

export class MockImagingStudyStore implements IImagingStudyStore {

    create = async (model: ImagingStudyDomainModel): Promise<any> => {
        return null;
    };

    getById = async (resourceId: string): Promise<any> => {
        return null;
    };
    
    update = async (updates: any): Promise<any> => {
        return null;
    };

    delete = async (id: string): Promise<any> => {
        return true;
    };

}
