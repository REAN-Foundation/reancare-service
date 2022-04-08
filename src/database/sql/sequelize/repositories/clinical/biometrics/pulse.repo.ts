import { Op } from 'sequelize';
import { ApiError } from '../../../../../../common/api.error';
import { Logger } from '../../../../../../common/logger';
import { PulseDomainModel } from "../../../../../../domain.types/clinical/biometrics/pulse/pulse.domain.model";
import { PulseDto } from "../../../../../../domain.types/clinical/biometrics/pulse/pulse.dto";
import { PulseSearchFilters, PulseSearchResults } from "../../../../../../domain.types/clinical/biometrics/pulse/pulse.search.types";
import { IPulseRepo } from '../../../../../repository.interfaces/clinical/biometrics/pulse.repo.interface ';
import { PulseMapper } from '../../../mappers/clinical/biometrics/pulse.mapper';
import PulseModel from '../../../models/clinical/biometrics/pulse.model';

///////////////////////////////////////////////////////////////////////

export class PulseRepo implements IPulseRepo {

    create = async (createModel: PulseDomainModel):
    Promise<PulseDto> => {
        try {
            const entity = {
                PatientUserId    : createModel.PatientUserId,
                EhrId            : createModel.EhrId,
                Pulse            : createModel.Pulse,
                Unit             : createModel.Unit,
                RecordDate       : createModel.RecordDate,
                RecordedByUserId : createModel.RecordedByUserId
            };

            const pulse = await PulseModel.create(entity);
            return await PulseMapper.toDto(pulse);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<PulseDto> => {
        try {
            const pulse = await PulseModel.findByPk(id);
            return await PulseMapper.toDto(pulse);
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

    update = async (id: string, updateModel: PulseDomainModel):
    Promise<PulseDto> => {
        try {
            const pulse = await PulseModel.findByPk(id);

            if (updateModel.PatientUserId != null) {
                pulse.PatientUserId = updateModel.PatientUserId;
            }
            if (updateModel.Pulse != null) {
                pulse.Pulse = updateModel.Pulse;
            }
            if (updateModel.Unit != null) {
                pulse.Unit = updateModel.Unit;
            }
            if (updateModel.RecordDate != null) {
                pulse.RecordDate = updateModel.RecordDate;
            }
            if (updateModel.RecordedByUserId != null) {
                pulse.RecordedByUserId = updateModel.RecordedByUserId;
            }
    
            await pulse.save();

            return await PulseMapper.toDto(pulse);

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
