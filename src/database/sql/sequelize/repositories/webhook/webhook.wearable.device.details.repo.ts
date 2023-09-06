import { Logger } from '../../../../../common/logger';
import { ApiError } from '../../../../../common/api.error';
import { WearableDeviceDetailsDomainModel } from '../../../../../domain.types/webhook/wearable.device.details/webhook.wearable.device.details.domain.model';
import { WearableDeviceDetailsDto } from '../../../../../domain.types/webhook/wearable.device.details/webhook.wearable.device.details.dto';
import { IWearableDeviceDetailsRepo } from '../../../../../database/repository.interfaces/webhook/webhook.wearable.device.details.repo.interface';
import WearableDeviceDetails from '../../models/webhook/webhook.wearable.device.details.model';
import { WearableDeviceDetailsMapper } from '../../mappers/webhook/webhook.wearable.device.details.mapper';
import { Op } from 'sequelize';
import { WearableDeviceDetailsSearchFilters } from '../../../../../domain.types/webhook/wearable.device.details/webhook.wearable.device.details.search.types';
import { WearableDeviceDetailsSearchResults } from '../../../../../domain.types/webhook/wearable.device.details/webhook.wearable.device.details.search.types';

///////////////////////////////////////////////////////////////////////

export class WearableDeviceDetailsRepo implements IWearableDeviceDetailsRepo {

    create = async (wearableDeviceDetailsDomainModel: WearableDeviceDetailsDomainModel):
        Promise<WearableDeviceDetailsDto> => {
        try {
            const entity = {
                PatientUserId     : wearableDeviceDetailsDomainModel.PatientUserId,
                Provider          : wearableDeviceDetailsDomainModel.Provider,
                TerraUserId       : wearableDeviceDetailsDomainModel.TerraUserId,
                Scopes            : wearableDeviceDetailsDomainModel.Scopes,
                AuthenticatedAt   : wearableDeviceDetailsDomainModel.AuthenticatedAt,
                DeauthenticatedAt : wearableDeviceDetailsDomainModel.DeauthenticatedAt
            };

            let deviceData = null;
            var existingRecord = await this.getByPatientUserId(entity.PatientUserId);
            if (existingRecord !== null) {
                deviceData = await this.update(existingRecord.id, entity);
            } else {
                deviceData = await WearableDeviceDetails.create(entity);
            }
            const dto = WearableDeviceDetailsMapper.toDto(deviceData);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<WearableDeviceDetailsDto> => {
        try {
            const deviceData = await WearableDeviceDetails.findByPk(id);
            return await WearableDeviceDetailsMapper.toDto(deviceData);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: WearableDeviceDetailsSearchFilters): Promise<WearableDeviceDetailsSearchResults> => {
        try {

            const search = { where: {} };

            if (filters.PatientUserId != null) {
                search.where['PatientUserId'] = filters.PatientUserId;
            }
            if (filters.TerraUserId !== null) {
                search.where['TerraUserId'] = filters.TerraUserId;
            }
            if (filters.Provider !== null) {
                search.where['Provider'] = filters.Provider;
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

            const foundResults = await WearableDeviceDetails.findAndCountAll(search);

            const dtos: WearableDeviceDetailsDto[] = [];
            for (const deviceData of foundResults.rows) {
                const dto = await WearableDeviceDetailsMapper.toDto(deviceData);
                dtos.push(dto);
            }

            const searchResults: WearableDeviceDetailsSearchResults = {
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

    update = async (id: string, updateModel: WearableDeviceDetailsDomainModel):
        Promise<WearableDeviceDetailsDto> => {
        try {
            const deviceData = await WearableDeviceDetails.findByPk(id);

            if (updateModel.PatientUserId != null) {
                deviceData.PatientUserId = updateModel.PatientUserId;
            }
            if (updateModel.Provider != null) {
                deviceData.Provider = updateModel.Provider;
            }
            if (updateModel.TerraUserId != null) {
                deviceData.TerraUserId = updateModel.TerraUserId;
            }
            if (updateModel.Scopes != null) {
                deviceData.Scopes = updateModel.Scopes;
            }
            if (updateModel.AuthenticatedAt != null) {
                deviceData.AuthenticatedAt = updateModel.AuthenticatedAt;
            }
            if (updateModel.DeauthenticatedAt != null) {
                deviceData.DeauthenticatedAt = updateModel.DeauthenticatedAt;
            }

            await deviceData.save();

            return await WearableDeviceDetailsMapper.toDto(deviceData);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {

            const result = await WearableDeviceDetails.destroy({ where: { id: id } });
            return result === 1;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getAvailableDeviceList = async (patientUserId: string): Promise<WearableDeviceDetailsDto[]> => {
        try {
            const foundResults = await WearableDeviceDetails.findAll({ where : {
                PatientUserId     : patientUserId,
                DeauthenticatedAt : null } });
            const dtos: WearableDeviceDetailsDto[] = [];
            for (const deviceData of foundResults) {
                const dto = await WearableDeviceDetailsMapper.toDto(deviceData);
                dtos.push(dto);
            }
            return dtos;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getWearableDeviceDetails = async (oldTerraUserId: string, provider : string ): Promise<WearableDeviceDetailsDto> => {
        try {
            const deviceData = await WearableDeviceDetails.findOne({ where : {
                TerraUserId : oldTerraUserId,
                Provider    : provider } });
            return WearableDeviceDetailsMapper.toDto(deviceData);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getAllUsers = async (): Promise<WearableDeviceDetailsDto[]> => {
        try {
            const foundResults = await WearableDeviceDetails.findAll();
            const dtos: WearableDeviceDetailsDto[] = [];
            for (const deviceData of foundResults) {
                const dto = await WearableDeviceDetailsMapper.toDto(deviceData);
                dtos.push(dto);
            }
            return dtos;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getByPatientUserId = async (patientUserId: string): Promise<WearableDeviceDetailsDto> => {
        try {
            const deviceData = await WearableDeviceDetails.findOne({ where: { PatientUserId: patientUserId } });
            if (deviceData) {
                const dto = await WearableDeviceDetailsMapper.toDto(deviceData);
                return dto;
            } else {
                return null;
            }
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
