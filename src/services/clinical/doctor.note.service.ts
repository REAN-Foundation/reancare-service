import { inject, injectable } from "tsyringe";
import { IDoctorNoteRepo } from "../../database/repository.interfaces/clinical/doctor.note.repo.interface";
import { DoctorNoteDomainModel } from '../../domain.types/clinical/doctor.note/doctor.note.domain.model';
import { DoctorNoteDto } from '../../domain.types/clinical/doctor.note/doctor.note.dto';
import { DoctorNoteSearchFilters, DoctorNoteSearchResults } from '../../domain.types/clinical/doctor.note/doctor.note.search.types';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class DoctorNoteService {

    constructor(
        @inject('IDoctorNoteRepo') private _doctorNoteRepo: IDoctorNoteRepo,
    ) {}

    create = async (doctorNoteDomainModel: DoctorNoteDomainModel): Promise<DoctorNoteDto> => {
        return await this._doctorNoteRepo.create(doctorNoteDomainModel);
    };

    getById = async (id: string): Promise<DoctorNoteDto> => {
        return await this._doctorNoteRepo.getById(id);
    };

    search = async (filters: DoctorNoteSearchFilters): Promise<DoctorNoteSearchResults> => {
        return await this._doctorNoteRepo.search(filters);
    };

    // eslint-disable-next-line max-len
    update = async (id: string, doctorNoteDomainModel: DoctorNoteDomainModel): Promise<DoctorNoteDto> => {
        return await this._doctorNoteRepo.update(id, doctorNoteDomainModel);
    };

    delete = async (id: string): Promise<boolean> => {
        return await this._doctorNoteRepo.delete(id);
    };

}
