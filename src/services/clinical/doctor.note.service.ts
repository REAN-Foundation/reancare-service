import { inject, injectable } from "tsyringe";
import { IDoctorNoteRepo } from "../../database/repository.interfaces/clinical/doctor.note.repo.interface";
import { DoctorNoteDomainModel } from '../../domain.types/clinical/doctor.note/doctor.note.domain.model';
import { DoctorNoteDto } from '../../domain.types/clinical/doctor.note/doctor.note.dto';
import { DoctorNoteSearchFilters, DoctorNoteSearchResults } from '../../domain.types/clinical/doctor.note/doctor.note.search.types';
import { uuid } from "../../domain.types/miscellaneous/system.types";
import { BaseResourceService } from "../../services/base.resource.service";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class DoctorNoteService extends BaseResourceService {

    constructor(
        @inject('IDoctorNoteRepo') private _doctorNoteRepo: IDoctorNoteRepo,
    ) {
        super();
    }

    create = async (doctorNoteDomainModel: DoctorNoteDomainModel): Promise<DoctorNoteDto> => {
        return await this._doctorNoteRepo.create(doctorNoteDomainModel);
    };

    getById = async (id: uuid): Promise<DoctorNoteDto> => {
        return await this._doctorNoteRepo.getById(id);
    };

    search = async (filters: DoctorNoteSearchFilters): Promise<DoctorNoteSearchResults> => {
        return await this._doctorNoteRepo.search(filters);
    };

    // eslint-disable-next-line max-len
    update = async (id: uuid, doctorNoteDomainModel: DoctorNoteDomainModel): Promise<DoctorNoteDto> => {
        return await this._doctorNoteRepo.update(id, doctorNoteDomainModel);
    };

    delete = async (id: uuid): Promise<boolean> => {
        return await this._doctorNoteRepo.delete(id);
    };

}
