import { IOrderRepo } from '../../../../repository.interfaces/order/order.repo.interface';
import OrderModel  from '../../models/order.model';
import { Op } from 'sequelize';
import { OrderMapper } from '../../mappers/order/order.mapper';
import { Logger } from '../../../../../common/logger';
import { ApiError } from '../../../../../common/api.error';
import { OrderDomainModel } from "../../../../../domain.types/order/order.domain.model";
import { OrderDto } from "../../../../../domain.types/order/order.dto";
import { OrderSearchFilters, OrderSearchResults } from "../../../../../domain.types/order/order.search.types";

///////////////////////////////////////////////////////////////////////

export class OrderRepo implements IOrderRepo {

    create = async (orderDomainModel: OrderDomainModel):
    Promise<OrderDto> => {
        try {
            const entity = {
                Type                      : orderDomainModel.Type,
                DisplayId                 : orderDomainModel.DisplayId,
                PatientUserId             : orderDomainModel.PatientUserId,
                MedicalPractitionerUserId : orderDomainModel.MedicalPractitionerUserId,
                VisitId                   : orderDomainModel.VisitId,
                ResourceId                : orderDomainModel.ResourceId,
                ReferenceOrderId          : orderDomainModel.ReferenceOrderId,
                CurrentState              : orderDomainModel.CurrentState,
                OrderDate                 : orderDomainModel.OrderDate,
                FulfilledByUserId         : orderDomainModel.FulfilledByUserId,
                FulfilledByOrganizationId : orderDomainModel.FulfilledByOrganizationId,
                AdditionalInformation     : orderDomainModel.AdditionalInformation,

            };

            const order = await OrderModel.create(entity);
            const dto = await OrderMapper.toDto(order);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<OrderDto> => {
        try {
            const order = await OrderModel.findByPk(id);
            const dto = await OrderMapper.toDto(order);
            return dto;
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

    update = async (id: string, orderDomainModel: OrderDomainModel):
    Promise<OrderDto> => {
        try {
            const order = await OrderModel.findByPk(id);

            if (orderDomainModel.Type != null) {
                order.Type = orderDomainModel.Type;
            }
            if (orderDomainModel.DisplayId != null) {
                order.DisplayId = orderDomainModel.DisplayId;
            }
            if (orderDomainModel.PatientUserId != null) {
                order.PatientUserId = orderDomainModel.PatientUserId;
            }
            if (orderDomainModel.MedicalPractitionerUserId != null) {
                order.MedicalPractitionerUserId = orderDomainModel.MedicalPractitionerUserId;
            }
            if (orderDomainModel.VisitId != null) {
                order.VisitId = orderDomainModel.VisitId;
            }
            if (orderDomainModel.ResourceId != null) {
                order.ResourceId = orderDomainModel.ResourceId;
            }
            if (orderDomainModel.ReferenceOrderId != null) {
                order.ReferenceOrderId = orderDomainModel.ReferenceOrderId;
            }
            if (orderDomainModel.CurrentState != null) {
                order.CurrentState = orderDomainModel.CurrentState;
            }
            if (orderDomainModel.OrderDate != null) {
                order.OrderDate = orderDomainModel.OrderDate;
            }
            if (orderDomainModel.FulfilledByUserId != null) {
                order.FulfilledByUserId = orderDomainModel.FulfilledByUserId;
            }
            if (orderDomainModel.FulfilledByOrganizationId != null) {
                order.FulfilledByOrganizationId = orderDomainModel.FulfilledByOrganizationId;
            }
            if (orderDomainModel.VisitId != null) {
                order.AdditionalInformation = orderDomainModel.AdditionalInformation;
            }
            await order.save();

            const dto = await OrderMapper.toDto(order);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {
            Logger.instance().log(id);

            const result = await OrderModel.destroy({ where: { id: id } });
            return result === 1;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
