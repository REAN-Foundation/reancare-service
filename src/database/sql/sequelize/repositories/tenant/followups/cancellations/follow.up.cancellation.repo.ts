import { ApiError } from "../../../../../../../common/api.error";
import { Logger } from "../../../../../../../common/logger";
import { IFollowUpCancellationRepo } from "../../../../../../repository.interfaces/tenant/followups/cancellations/follow.up.cancellation.repo.interface";
import { FollowUpCancellationMapper } from "../../../../mappers/tenant/followups/cancellations/follow.up.cancellation.mapper";
import { uuid } from "../../../../../../../domain.types/miscellaneous/system.types";
import { Op } from "sequelize";
import { FollowUpCancellationDomainModel } from "../../../../../../../domain.types/tenant/followups/cancellations/follow.up.cancellation.domain.model";
import { FollowUpCancellationDto } from "../../../../../../../domain.types/tenant/followups/cancellations/follow.up.cancellation.dto";
import FollowUpCancellation from "../../../../../../../database/sql/sequelize/models/tenant/followups/cancellations/follow.up.cancellation.model";
import { FollowUpCancellationSearchFilters, FollowUpCancellationSearchResults } from "../../../../../../../domain.types/tenant/followups/cancellations/follow.up.cancellation.search.types";

export class FollowUpCancellationRepo implements IFollowUpCancellationRepo {

    create  = async (model: FollowUpCancellationDomainModel): Promise<FollowUpCancellationDto> => {
        try {
            const entity = {
                TenantId   : model.TenantId,
                TenantName : model.TenantName,
                CancelDate : model.CancelDate,
            };
            const record = await FollowUpCancellation.create(entity);
            return FollowUpCancellationMapper.toDto(record);
        }
        catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: uuid): Promise<FollowUpCancellationDto> => {
        try {
            const record = await FollowUpCancellation.findByPk(id);
            return FollowUpCancellationMapper.toDto(record);
        }
        catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters:FollowUpCancellationSearchFilters): Promise<FollowUpCancellationSearchResults> => {
        try {
            const search = { where: {} };

            if (filters.TenantName) {
                search.where['TenantName'] = filters.TenantName;
            }
            if (filters.TenantId) {
                search.where['TenantId'] = filters.TenantId;
            }
            if (filters.CancelDate) {
                search.where['CancelDate'] = filters.CancelDate;
            }
            if (filters.DateFrom != null && filters.DateTo != null) {
                search.where['CancelDate'] = {
                    [Op.gte] : filters.DateFrom,
                    [Op.lte] : filters.DateTo,
                };
            } else if (filters.DateFrom === null && filters.DateTo !== null) {
                search.where['CancelDate'] = {
                    [Op.lte] : filters.DateTo,
                };
            } else if (filters.DateFrom !== null && filters.DateTo === null) {
                search.where['CancelDate'] = {
                    [Op.gte] : filters.DateFrom,
                };
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

            const foundResults = await FollowUpCancellation.findAndCountAll(search);
            const dtos: FollowUpCancellationDto[] = [];
            for (const h of foundResults.rows) {
                const dto = await FollowUpCancellationMapper.toDto(h);
                dtos.push(dto);
            }

            const searchResults: FollowUpCancellationSearchResults = {
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

    update = async (id: uuid, model: FollowUpCancellationDomainModel): Promise<FollowUpCancellationDto> => {
        try {
            const record = await FollowUpCancellation.findByPk(id);
            if (model.CancelDate) {
                record.CancelDate = model.CancelDate;
            }
            await record.save();

            return FollowUpCancellationMapper.toDto(record);
        }
        catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: uuid): Promise<boolean> => {
        try {
            const record = await FollowUpCancellation.findByPk(id);
            if (record == null) {
                throw new Error('CancellationDates not found');
            }
            await record.destroy();
            return true;
        }
        catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
