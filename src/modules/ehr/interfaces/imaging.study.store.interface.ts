import { ImagingStudyDomainModel } from '../../../domain.types/clinical/imaging.study/imaging.study.domain.model';

////////////////////////////////////////////////////////////////////////////////////

export interface IImagingStudyStore {
    create(imagingStudyDomainModel: ImagingStudyDomainModel): Promise<any>;
    getById(id: string): Promise<any>;
    update(id: string, updates: ImagingStudyDomainModel): Promise<any>;
    delete(id: string): Promise<any>;
}
