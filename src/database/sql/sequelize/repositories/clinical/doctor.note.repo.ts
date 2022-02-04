import { Op } from 'sequelize';
import { ApiError } from '../../../../../common/api.error';
import { Logger } from '../../../../../common/logger';
import { DoctorNoteDomainModel } from '../../../../../domain.types/clinical/doctor.note/doctor.note.domain.model';
import { DoctorNoteDto } from '../../../../../domain.types/clinical/doctor.note/doctor.note.dto';
import { DoctorNoteSearchFilters, DoctorNoteSearchResults } from '../../../../../domain.types/clinical/doctor.note/doctor.note.search.types';
import { IDoctorNoteRepo } from '../../../../repository.interfaces/clinical/doctor.note.repo.interface';
import { DoctorNoteMapper } from '../../mappers/clinical/doctor.note.mapper';
import DoctorNote from '../../models/clinical/doctor.note.model';

///////////////////////////////////////////////////////////////////////

export class DoctorNoteRepo implements IDoctorNoteRepo {

    create = async (doctorNoteDomainModel: DoctorNoteDomainModel): Promise<DoctorNoteDto> => {
        try {
            const entity = {
                id                        : doctorNoteDomainModel.id,
                PatientUserId             : doctorNoteDomainModel.PatientUserId,
                EhrId                     : doctorNoteDomainModel.EhrId,
                MedicalPractitionerUserId : doctorNoteDomainModel.MedicalPractitionerUserId,
                VisitId                   : doctorNoteDomainModel.VisitId,
                Notes                     : doctorNoteDomainModel.Notes,
                ValidationStatus          : doctorNoteDomainModel.ValidationStatus,
                RecordDate                : doctorNoteDomainModel.RecordDate,
            };
            const doctorNote = await DoctorNote.create(entity);
            return await DoctorNoteMapper.toDto(doctorNote);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<DoctorNoteDto> => {
        try {
            const doctorNote = await DoctorNote.findByPk(id);
            return await DoctorNoteMapper.toDto(doctorNote);
            
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: DoctorNoteSearchFilters): Promise<DoctorNoteSearchResults> => {
        try {
            const search = { where: {} };

            if (filters.PatientUserId != null) {
                search.where['PatientUserId'] = filters.PatientUserId;
            }
            if (filters.VisitId != null) {
                search.where['VisitId'] = filters.VisitId;
            }
            if (filters.MedicalPractitionerUserId != null) {
                search.where['MedicalPractitionerUserId'] = filters.MedicalPractitionerUserId;
            }
            if (filters.Notes != null) {
                search.where['Notes'] = { [Op.like]: '%' + filters.Notes + '%' };
            }
            if (filters.RecordDateFrom != null) {
                search.where['RecordDateFrom'] = filters.RecordDateFrom;
            }
            if (filters.RecordDateTo != null) {
                search.where['RecordDateTo'] = filters.RecordDateTo;
            }
            
            let orderByColum = 'RecordDate';
            if (filters.OrderBy) {
                orderByColum = filters.OrderBy;
            }
            let order = 'ASC';
            if (filters.Order === 'descending') {
                order = 'DESC';
            }
            search['order'] = [[orderByColum, order]];

            let limit = 25;
            if (filters.ItemsPerPage) {
                limit = filters.ItemsPerPage;
            }
            let offset = 0;
            let pageIndex = 0;
            if (filters.PageIndex) {
                pageIndex = filters.PageIndex < 0 ? 0 : filters.PageIndex;
                offset = pageIndex * limit;
            }
            search['limit'] = limit;
            search['offset'] = offset;

            const foundResults = await DoctorNote.findAndCountAll(search);

            const dtos: DoctorNoteDto[] = [];
            for (const doctorNote of foundResults.rows) {
                const dto = await DoctorNoteMapper.toDto(doctorNote);
                dtos.push(dto);
            }

            const searchResults: DoctorNoteSearchResults = {
                TotalCount     : foundResults.count,
                RetrievedCount : dtos.length,
                PageIndex      : pageIndex,
                ItemsPerPage   : limit,
                Order          : order === 'DESC' ? 'descending' : 'ascending',
                OrderedBy      : orderByColum,
                Items          : dtos,
            };
            return searchResults;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    // eslint-disable-next-line max-len
    update = async (id: string, doctorNoteDomainModel: DoctorNoteDomainModel): Promise<DoctorNoteDto> => {
        try {
            const doctorNote = await DoctorNote.findByPk(id);

            if (doctorNoteDomainModel.PatientUserId != null) {
                doctorNote.PatientUserId = doctorNoteDomainModel.PatientUserId;
            }
            if (doctorNoteDomainModel.EhrId != null) {
                doctorNote.EhrId = doctorNoteDomainModel.EhrId;
            }
            if (doctorNoteDomainModel.MedicalPractitionerUserId != null) {
                doctorNote.MedicalPractitionerUserId = doctorNoteDomainModel.MedicalPractitionerUserId;
            }
            if (doctorNoteDomainModel.VisitId != null) {
                doctorNote.VisitId = doctorNoteDomainModel.VisitId;
            }
            if (doctorNoteDomainModel.Notes != null) {
                doctorNote.Notes = doctorNoteDomainModel.Notes;
            }
            if (doctorNoteDomainModel.ValidationStatus != null) {
                doctorNote.ValidationStatus = doctorNoteDomainModel.ValidationStatus;
            }
            if (doctorNoteDomainModel.RecordDate != null) {
                doctorNote.RecordDate = doctorNoteDomainModel.RecordDate;
            }
            
            await doctorNote.save();

            return await DoctorNoteMapper.toDto(doctorNote);
            
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {
            await DoctorNote.destroy({ where: { id: id } });
            return true;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
