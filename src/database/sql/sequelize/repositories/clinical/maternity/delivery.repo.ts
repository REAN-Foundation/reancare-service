import { Op } from 'sequelize';
import { ApiError } from '../../../../../../common/api.error';
import { Logger } from '../../../../../../common/logger';
import { DeliveryDomainModel } from '../../../../../../domain.types/clinical/maternity/delivery/delivery.domain.model';
import { DeliveryDto } from '../../../../../../domain.types/clinical/maternity/delivery/delivery.dto';
import { DeliverySearchFilters, DeliverySearchResults } from '../../../../../../domain.types/clinical/maternity/delivery/delivery.search.type';
import { IDeliveryRepo } from '../../../../../repository.interfaces/clinical/maternity/delivery.repo.interface';
import { DeliveryMapper } from '../../../mappers/clinical/maternity/delivery.mapper';
import Delivery from '../../../models/clinical/maternity/delivery.model';

///////////////////////////////////////////////////////////////////////

export class DeliveryRepo implements IDeliveryRepo {

    totalCount = async (): Promise<number> => {
        try {
            return await Delivery.count();
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    create = async (createModel: DeliveryDomainModel): Promise<DeliveryDto> => {
        try {
            const entity = {
                PregnancyId      : createModel.PregnancyId,
                PatientUserId    : createModel.PatientUserId,
                DeliveryDate     : createModel.DeliveryDate,
                DeliveryTime     : createModel.DeliveryTime,
                GestationAtBirth : createModel.GestationAtBirth,
                DeliveryMode     : createModel.DeliveryMode,
                DeliveryPlace    : createModel.DeliveryPlace,
                DeliveryOutcome  : createModel.DeliveryOutcome,
                DateOfDischarge  : createModel.DateOfDischarge,
                OverallDiagnosis : createModel.OverallDiagnosis
            };

            const delivery = await Delivery.create(entity);
            return DeliveryMapper.toDto(delivery);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<DeliveryDto> => {
        try {
            const delivery = await Delivery.findByPk(id);
            return DeliveryMapper.toDto(delivery);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: DeliverySearchFilters): Promise<DeliverySearchResults> => {
        try {
            const search = { where: {} };

            if (filters.DeliveryDate != null) {
                search.where['DeliveryDate'] = { [Op.eq]: filters.DeliveryDate };
            }
            if (filters.DeliveryMode != null) {
                search.where['DeliveryMode'] = filters.DeliveryMode;
            }
            if (filters.DeliveryOutcome != null) {
                search.where['DeliveryOutcome'] = filters.DeliveryOutcome;
            }

            let orderByColumn = 'CreatedAt';
            if (filters.OrderBy) {
                orderByColumn = filters.OrderBy;
            }
            let order = 'ASC';
            if (filters.Order === 'descending') {
                order = 'DESC';
            }
            search['order'] = [[orderByColumn, order]];

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

            const foundResults = await Delivery.findAndCountAll(search);

            const dtos: DeliveryDto[] = [];
            for (const delivery of foundResults.rows) {
                const dto = DeliveryMapper.toDto(delivery);
                dtos.push(dto);
            }

            const searchResults: DeliverySearchResults = {
                TotalCount     : foundResults.count,
                RetrievedCount : dtos.length,
                PageIndex      : pageIndex,
                ItemsPerPage   : limit,
                Order          : order === 'DESC' ? 'descending' : 'ascending',
                OrderedBy      : orderByColumn,
                Items          : dtos,
            };

            return searchResults;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    update = async (id: string, updateModel: DeliveryDomainModel): Promise<DeliveryDto> => {
        try {
            const delivery = await Delivery.findByPk(id);

            if (updateModel.DeliveryDate != null) {
                delivery.DeliveryDate = updateModel.DeliveryDate;
            }
            if (updateModel.DeliveryMode != null) {
                delivery.DeliveryMode = updateModel.DeliveryMode;
            }
            if (updateModel.DeliveryOutcome != null) {
                delivery.DeliveryOutcome = updateModel.DeliveryOutcome;
            }

            await delivery.save();

            return DeliveryMapper.toDto(delivery);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {
            const result = await Delivery.destroy({ where: { id: id } });
            return result === 1;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
