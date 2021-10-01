import { Op } from 'sequelize';
import { ApiError } from '../../../../../common/api.error';
import { Logger } from '../../../../../common/logger';
import { EmergencyEventDomainModel } from '../../../../../domain.types/clinical/emergency.event/emergency.event.domain.model';
import { EmergencyEventDto } from '../../../../../domain.types/clinical/emergency.event/emergency.event.dto';
import { EmergencyEventSearchFilters, EmergencyEventSearchResults } from '../../../../../domain.types/clinical/emergency.event/emergency.event.search.types';
import { IEmergencyEventRepo } from '../../../../repository.interfaces/clinical/emergency.event.repo.interface';
import { EmergencyEventMapper } from '../../mappers/clinical/emergency.event.mapper';
import EmergencyEvent from '../../models/clinical/emergency.event.model';

///////////////////////////////////////////////////////////////////////

export class EmergencyEventRepo implements IEmergencyEventRepo {

    create = async (emergencyEventDomainModel: EmergencyEventDomainModel): Promise<EmergencyEventDto> => {
        try {
            const entity = {
                EhrId         : emergencyEventDomainModel.EhrId ?? null,
                PatientUserId : emergencyEventDomainModel.PatientUserId ?? null,
                Details       : emergencyEventDomainModel.Details ?? "",
                EmergencyDate : emergencyEventDomainModel.EmergencyDate ?? null
            };
            const emergencyEvent = await EmergencyEvent.create(entity);
            const dto = await EmergencyEventMapper.toDto(emergencyEvent);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<EmergencyEventDto> => {
        try {
            const emergencyEvent = await EmergencyEvent.findByPk(id);
            const dto = await EmergencyEventMapper.toDto(emergencyEvent);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: EmergencyEventSearchFilters): Promise<EmergencyEventSearchResults> => {
        try {
            const search = { where: {} };

            if (filters.PatientUserId != null) {
                search.where['PatientUserId'] = { [Op.eq]: filters.PatientUserId };
            }
            if (filters.MedicalPractitionerUserId != null) {
                search.where['MedicalPractitionerUserId'] = { [Op.eq]: filters.MedicalPractitionerUserId };
            }
            if (filters.EmergencyDateFrom != null && filters.EmergencyDateTo != null) {
                search.where['EmergencyDate'] = {
                    [Op.gte] : filters.EmergencyDateFrom,
                    [Op.lte] : filters.EmergencyDateTo,
                };
            }
            
            let orderByColum = 'EmergencyDate';
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

            const foundResults = await EmergencyEvent.findAndCountAll(search);

            const dtos: EmergencyEventDto[] = [];
            for (const emergencyEvent of foundResults.rows) {
                const dto = await EmergencyEventMapper.toDto(emergencyEvent);
                dtos.push(dto);
            }

            const searchResults: EmergencyEventSearchResults = {
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

    update = async (id: string, emergencyEventDomainModel: EmergencyEventDomainModel): Promise<EmergencyEventDto> => {
        try {
            const emergencyEvent = await EmergencyEvent.findByPk(id);

            if (emergencyEventDomainModel.EhrId != null) {
                emergencyEvent.EhrId = emergencyEventDomainModel.EhrId;
            }
            if (emergencyEventDomainModel.PatientUserId != null) {
                emergencyEvent.PatientUserId = emergencyEventDomainModel.PatientUserId;
            }
            if (emergencyEventDomainModel.Details != null) {
                emergencyEvent.Details = emergencyEventDomainModel.Details;
            }
            if (emergencyEventDomainModel.EmergencyDate != null) {
                emergencyEvent.EmergencyDate = emergencyEventDomainModel.EmergencyDate;
            }
            await emergencyEvent.save();

            const dto = await EmergencyEventMapper.toDto(emergencyEvent);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {
            await EmergencyEvent.destroy({ where: { id: id } });
            return true;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
