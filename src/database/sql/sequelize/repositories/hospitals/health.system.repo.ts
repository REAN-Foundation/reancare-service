import { uuid } from "../../../../../domain.types/miscellaneous/system.types";
import { HealthSystemDto } from "../../../../../domain.types/hospitals/health.system/health.system.dto";
import { IHealthSystemRepo } from "../../../../repository.interfaces/hospitals/health.system.repo.interface";
import HealthSystem from "../../models/hospitals/health.system.model";
import { HealthSystemDomainModel } from "../../../../../domain.types/hospitals/health.system/health.system.domain.model";
import { HealthSystemMapper } from "../../mappers/hospitals/health.system.mapper";
import { Logger } from "../../../../../common/logger";
import { ApiError } from "../../../../../common/api.error";
import { HealthSystemSearchFilters, HealthSystemSearchResults } from "../../../../../domain.types/hospitals/health.system/health.system.search.types";
import { Op } from "sequelize";

////////////////////////////////////////////////////////////////////////////////////////////////////////

export class HealthSystemRepo implements IHealthSystemRepo {

    create  = async (model: HealthSystemDomainModel): Promise<HealthSystemDto> => {
        try {
            const entity = {
                Name : model.Name,
                Tags : model.Tags && model.Tags.length > 0 ? JSON.stringify(model.Tags) : null,
            };
            const record = await HealthSystem.create(entity);
            return HealthSystemMapper.toDto(record);
        }
        catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: uuid): Promise<HealthSystemDto> => {
        try {
            const record = await HealthSystem.findByPk(id);
            return HealthSystemMapper.toDto(record);
        }
        catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: HealthSystemSearchFilters): Promise<HealthSystemSearchResults> => {
        try {
            const search = { where: {} };

            if (filters.Name != null) {
                search.where['Name'] = { [Op.like]: '%' + filters.Name + '%' };
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

            const foundResults = await HealthSystem.findAndCountAll(search);
            const dtos: HealthSystemDto[] = [];
            for (const h of foundResults.rows) {
                const dto = await HealthSystemMapper.toDto(h);
                dtos.push(dto);
            }

            const searchResults: HealthSystemSearchResults = {
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

    update = async (id: uuid, model: HealthSystemDomainModel): Promise<HealthSystemDto> => {
        try {
            const record = await HealthSystem.findByPk(id);

            if (model.Name != null) {
                record.Name = model.Name;
            }
            if (model.Tags != null && Array.isArray(model.Tags)) {
                record.Tags = model.Tags ? JSON.stringify(model.Tags) : '[]';
            }

            await record.save();

            return HealthSystemMapper.toDto(record);
        }
        catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: uuid): Promise<boolean> => {
        try {
            const record = await HealthSystem.findByPk(id);
            if (record == null) {
                throw new Error('HealthSystem not found');
            }
            await record.destroy();
            return true;
        }
        catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getHealthSystemsWithTags = async (tag?: string): Promise<HealthSystemDto[]> => {
        try {
            const filter = tag ? {
                where : {
                    Tags : { [Op.like]: '%' + tag + '%' }
                }
            } : null;
            const healthSystems = filter ? await HealthSystem.findAll(filter) : await HealthSystem.findAll();
            const dtos: HealthSystemDto[] = [];
            for (const hs of healthSystems) {
                const dto = HealthSystemMapper.toDto(hs);
                dtos.push(dto);
            }
            return dtos;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
