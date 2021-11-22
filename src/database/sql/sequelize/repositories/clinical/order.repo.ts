import { Op } from 'sequelize';
import { ApiError } from '../../../../../common/api.error';
import { Logger } from '../../../../../common/logger';
import { OrderDomainModel } from "../../../../../domain.types/clinical/order/order.domain.model";
import { OrderDto } from "../../../../../domain.types/clinical/order/order.dto";
import { OrderSearchFilters, OrderSearchResults } from "../../../../../domain.types/clinical/order/order.search.types";
import { IOrderRepo } from '../../../../repository.interfaces/clinical/order.repo.interface';
import { OrderMapper } from '../../mappers/clinical/order.mapper';
import OrderModel from '../../models/clinical/order.model';

///////////////////////////////////////////////////////////////////////

export class OrderRepo implements IOrderRepo {

    create = async (createModel: OrderDomainModel):
    Promise<OrderDto> => {
        try {
            const entity = {
                Type                      : createModel.Type,
                DisplayId                 : createModel.DisplayId,
                PatientUserId             : createModel.PatientUserId,
                MedicalPractitionerUserId : createModel.MedicalPractitionerUserId,
                VisitId                   : createModel.VisitId,
                ResourceId                : createModel.ResourceId,
                ReferenceOrderId          : createModel.ReferenceOrderId,
                CurrentState              : createModel.CurrentState,
                OrderDate                 : createModel.OrderDate,
                FulfilledByUserId         : createModel.FulfilledByUserId,
                FulfilledByOrganizationId : createModel.FulfilledByOrganizationId,
                AdditionalInformation     : createModel.AdditionalInformation,

            };

            const order = await OrderModel.create(entity);
            return await OrderMapper.toDto(order);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<OrderDto> => {
        try {
            const order = await OrderModel.findByPk(id);
            return await OrderMapper.toDto(order);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: OrderSearchFilters): Promise<OrderSearchResults> => {
        try {
            const search = { where: {} };

            if (filters.Type != null) {
                search.where['Type'] = filters.Type;
            }
            if (filters.PatientUserId != null) {
                search.where['PatientUserId'] = filters.PatientUserId;
            }
            if (filters.MedicalPractitionerUserId != null) {
                search.where['MedicalPractitionerUserId'] = filters.MedicalPractitionerUserId;
            }
            if (filters.VisitId != null) {
                search.where['VisitId'] = filters.VisitId;
            }
            if (filters.ReferenceOrderId != null) {
                search.where['ReferenceOrderId'] = filters.ReferenceOrderId;
            }
            if (filters.FulfilledByUserId != null) {
                search.where['FulfilledByUserId'] = filters.FulfilledByUserId;
            }
            if (filters.FulfilledByOrganizationId != null) {
                search.where['FulfilledByOrganizationId'] = filters.FulfilledByOrganizationId;
            }
            if (filters.CurrentState != null) {
                search.where['CurrentState'] = filters.CurrentState;
            }
            if (filters.OrderDateFrom != null && filters.OrderDateTo != null) {
                search.where['CreatedAt'] = {
                    [Op.gte] : filters.OrderDateFrom,
                    [Op.lte] : filters.OrderDateTo,
                };
            } else if (filters.OrderDateFrom === null && filters.OrderDateTo !== null) {
                search.where['CreatedAt'] = {
                    [Op.lte] : filters.OrderDateTo,
                };
            } else if (filters.OrderDateFrom !== null && filters.OrderDateTo === null) {
                search.where['CreatedAt'] = {
                    [Op.gte] : filters.OrderDateFrom,
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

            const foundResults = await OrderModel.findAndCountAll(search);

            const dtos: OrderDto[] = [];
            for (const order of foundResults.rows) {
                const dto = await OrderMapper.toDto(order);
                dtos.push(dto);
            }

            const searchResults: OrderSearchResults = {
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

    update = async (id: string, updateModel: OrderDomainModel):
    Promise<OrderDto> => {
        try {
            const order = await OrderModel.findByPk(id);

            if (updateModel.Type != null) {
                order.Type = updateModel.Type;
            }
            if (updateModel.DisplayId != null) {
                order.DisplayId = updateModel.DisplayId;
            }
            if (updateModel.PatientUserId != null) {
                order.PatientUserId = updateModel.PatientUserId;
            }
            if (updateModel.MedicalPractitionerUserId != null) {
                order.MedicalPractitionerUserId = updateModel.MedicalPractitionerUserId;
            }
            if (updateModel.VisitId != null) {
                order.VisitId = updateModel.VisitId;
            }
            if (updateModel.ResourceId != null) {
                order.ResourceId = updateModel.ResourceId;
            }
            if (updateModel.ReferenceOrderId != null) {
                order.ReferenceOrderId = updateModel.ReferenceOrderId;
            }
            if (updateModel.CurrentState != null) {
                order.CurrentState = updateModel.CurrentState;
            }
            if (updateModel.OrderDate != null) {
                order.OrderDate = updateModel.OrderDate;
            }
            if (updateModel.FulfilledByUserId != null) {
                order.FulfilledByUserId = updateModel.FulfilledByUserId;
            }
            if (updateModel.FulfilledByOrganizationId != null) {
                order.FulfilledByOrganizationId = updateModel.FulfilledByOrganizationId;
            }
            if (updateModel.AdditionalInformation != null) {
                order.AdditionalInformation = updateModel.AdditionalInformation;
            }
            await order.save();

            return await OrderMapper.toDto(order);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {
            
            const result = await OrderModel.destroy({ where: { id: id } });
            return result === 1;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
