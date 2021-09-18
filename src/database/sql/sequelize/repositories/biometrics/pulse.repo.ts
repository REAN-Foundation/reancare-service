import { IPulseRepo } from '../../../../repository.interfaces/biometrics/pulse.repo.interface ';
import PulseModel  from '../../models/biometrics/pulse.model';
import { Op } from 'sequelize';
import { PulseMapper } from '../../mappers/biometrics/pulse.mapper';
import { Logger } from '../../../../../common/logger';
import { ApiError } from '../../../../../common/api.error';
import { PulseDomainModel } from "../../../../../domain.types/biometrics/pulse/pulse.domain.model";
import { PulseDto } from "../../../../../domain.types/biometrics/pulse/pulse.dto";
import { PulseSearchFilters, PulseSearchResults } from "../../../../../domain.types/biometrics/pulse/pulse.search.types";

///////////////////////////////////////////////////////////////////////

export class PulseRepo implements IPulseRepo {

    create = async (pulseDomainModel: PulseDomainModel):
    Promise<PulseDto> => {
        try {
            const entity = {
                PatientUserId    : pulseDomainModel.PatientUserId,
                Pulse            : pulseDomainModel.Pulse,
                Unit             : pulseDomainModel.Unit,
                RecordDate       : pulseDomainModel.RecordDate,
                RecordedByUserId : pulseDomainModel.RecordedByUserId
            };

            const pulse = await PulseModel.create(entity);
            const dto = await PulseMapper.toDto(pulse);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<PulseDto> => {
        try {
            const pulse = await PulseModel.findByPk(id);
            const dto = await PulseMapper.toDto(pulse);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: PulseSearchFilters): Promise<PulseSearchResults> => {
        try {
            const search = { where: {} };

            if (filters.PatientUserId != null) {
                search.where['PatientUserId'] = filters.PatientUserId;
            }
            if (filters.MinValue != null && filters.MaxValue != null) {
                search.where['Pulse'] = {
                    [Op.gte] : filters.MinValue,
                    [Op.lte] : filters.MaxValue,
                };
            } else if (filters.MinValue === null && filters.MaxValue !== null) {
                search.where['Pulse'] = {
                    [Op.lte] : filters.MaxValue,
                };
            } else if (filters.MinValue !== null && filters.MaxValue === null) {
                search.where['Pulse'] = {
                    [Op.gte] : filters.MinValue,
                };
            }
            if (filters.CreatedDateFrom != null && filters.CreatedDateTo != null) {
                search.where['CreatedAt'] = {
                    [Op.gte] : filters.CreatedDateFrom,
                    [Op.lte] : filters.CreatedDateTo,
                };
            } else if (filters.CreatedDateFrom === null && filters.CreatedDateTo !== null) {
                search.where['CreatedAt'] = {
                    [Op.lte] : filters.CreatedDateTo,
                };
            } else if (filters.CreatedDateFrom !== null && filters.CreatedDateTo === null) {
                search.where['CreatedAt'] = {
                    [Op.gte] : filters.CreatedDateFrom,
                };
            }
            if (filters.RecordedByUserId !== null) {
                search.where['RecordedByUserId'] = filters.RecordedByUserId;
            }

            let orderByColum = 'CreatedAt';
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

            const foundResults = await PulseModel.findAndCountAll(search);

            const dtos: PulseDto[] = [];
            for (const pulse of foundResults.rows) {
                const dto = await PulseMapper.toDto(pulse);
                dtos.push(dto);
            }

            const searchResults: PulseSearchResults = {
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

    update = async (id: string, pulseDomainModel: PulseDomainModel):
    Promise<PulseDto> => {
        try {
            const pulse = await PulseModel.findByPk(id);

            if (pulseDomainModel.PatientUserId != null) {
                pulse.PatientUserId = pulseDomainModel.PatientUserId;
            }
            if (pulseDomainModel.Pulse != null) {
                pulse.Pulse = pulseDomainModel.Pulse;
            }
            if (pulseDomainModel.Unit != null) {
                pulse.Unit = pulseDomainModel.Unit;
            }
            if (pulseDomainModel.RecordDate != null) {
                pulse.RecordDate = pulseDomainModel.RecordDate;
            }
            if (pulseDomainModel.RecordedByUserId != null) {
                pulse.RecordedByUserId = pulseDomainModel.RecordedByUserId;
            }
    
            await pulse.save();

            const dto = await PulseMapper.toDto(pulse);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {
            Logger.instance().log(id);

            const result = await PulseModel.destroy({ where: { id: id } });
            return result === 1;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
