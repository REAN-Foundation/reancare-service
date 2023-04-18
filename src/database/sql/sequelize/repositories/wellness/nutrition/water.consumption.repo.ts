import { Op } from 'sequelize';
import { ApiError } from '../../../../../../common/api.error';
import { Logger } from '../../../../../../common/logger';
import { WaterConsumptionDomainModel } from "../../../../../../domain.types/wellness/nutrition/water.consumption/water.consumption.domain.model";
import { WaterConsumptionDto } from "../../../../../../domain.types/wellness/nutrition/water.consumption/water.consumption.dto";
import { WaterConsumptionSearchFilters, WaterConsumptionSearchResults } from "../../../../../../domain.types/wellness/nutrition/water.consumption/water.consumption.search.types";
import { IWaterConsumptionRepo } from '../../../../../repository.interfaces/wellness/nutrition/water.consumption.repo.interface';
import { WaterConsumptionMapper } from '../../../mappers/wellness/nutrition/water.consumption.mapper';
import WaterConsumptionModel from '../../../models/wellness/nutrition/water.consumption.model';

///////////////////////////////////////////////////////////////////////

export class WaterConsumptionRepo implements IWaterConsumptionRepo {

    create = async (waterConsumptionDomainModel: WaterConsumptionDomainModel):
    Promise<WaterConsumptionDto> => {
        try {
            const entity = {
                PatientUserId  : waterConsumptionDomainModel.PatientUserId,
                TerraSummaryId : waterConsumptionDomainModel.TerraSummaryId,
                Provider       : waterConsumptionDomainModel.Provider,
                Volume         : waterConsumptionDomainModel.Volume,
                Time           : waterConsumptionDomainModel.Time,
            };

            const waterConsumption = await WaterConsumptionModel.create(entity);
            return await WaterConsumptionMapper.toDto(waterConsumption);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<WaterConsumptionDto> => {
        try {
            const waterConsumption = await WaterConsumptionModel.findByPk(id);
            return await WaterConsumptionMapper.toDto(waterConsumption);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: WaterConsumptionSearchFilters): Promise<WaterConsumptionSearchResults> => {
        try {
            const search = { where: {} };

            if (filters.PatientUserId != null) {
                search.where['PatientUserId'] = filters.PatientUserId;
            }
            if (filters.DailyVolumeFrom != null && filters.DailyVolumeTo != null) {
                search.where['Volume'] = {
                    [Op.gte] : filters.DailyVolumeFrom,
                    [Op.lte] : filters.DailyVolumeTo,
                };
            } else if (filters.DailyVolumeFrom === null && filters.DailyVolumeTo !== null) {
                search.where['Volume'] = {
                    [Op.lte] : filters.DailyVolumeTo,
                };
            } else if (filters.DailyVolumeFrom !== null && filters.DailyVolumeTo === null) {
                search.where['Volume'] = {
                    [Op.gte] : filters.DailyVolumeFrom,
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

            const foundResults = await WaterConsumptionModel.findAndCountAll(search);

            const dtos: WaterConsumptionDto[] = [];
            for (const waterConsumption of foundResults.rows) {
                const dto = await WaterConsumptionMapper.toDto(waterConsumption);
                dtos.push(dto);
            }

            const searchResults: WaterConsumptionSearchResults = {
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

    update = async (id: string, updateModel: WaterConsumptionDomainModel):
    Promise<WaterConsumptionDto> => {
        try {
            const waterConsumption = await WaterConsumptionModel.findByPk(id);

            if (updateModel.PatientUserId != null) {
                waterConsumption.PatientUserId = updateModel.PatientUserId;
            }
            if (updateModel.Volume != null) {
                waterConsumption.Volume = updateModel.Volume;
            }
            if (updateModel.Time != null) {
                waterConsumption.Time = updateModel.Time;
            }
            if (updateModel.TerraSummaryId != null) {
                waterConsumption.TerraSummaryId = updateModel.TerraSummaryId;
            }
            if (updateModel.Provider != null) {
                waterConsumption.Provider = updateModel.Provider;
            }

            await waterConsumption.save();

            const dto = await WaterConsumptionMapper.toDto(waterConsumption);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {
            Logger.instance().log(id);

            const result = await WaterConsumptionModel.destroy({ where: { id: id } });
            return result === 1;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getByRecordDate = async (date: Date, patientUserId : string): Promise<WaterConsumptionDto> => {
        try {
            const new_date = new Date(date);
            const waterConsumption =  await WaterConsumptionModel.findOne({
                where : {
                    PatientUserId : patientUserId,
                    Time          : new_date
                }
            });
            return await WaterConsumptionMapper.toDto(waterConsumption);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
