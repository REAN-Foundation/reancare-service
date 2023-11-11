import { uuid } from "../../../../../domain.types/miscellaneous/system.types";
import { HospitalDto } from "../../../../../domain.types/hospitals/hospital/hospital.dto";
import { IHospitalRepo } from "../../../../repository.interfaces/hospitals/hospital.repo.interface";
import Hospital from "../../models/hospitals/hospital.model";
import { HospitalDomainModel } from "../../../../../domain.types/hospitals/hospital/hospital.domain.model";
import { HospitalMapper } from "../../mappers/hospitals/hospital.mapper";
import { Logger } from "../../../../../common/logger";
import { ApiError } from "../../../../../common/api.error";
import HealthSystem from "../../models/hospitals/health.system.model";
import { HospitalSearchFilters, HospitalSearchResults } from "../../../../../domain.types/hospitals/hospital/hospital.search.types";
import { Op } from "sequelize";

////////////////////////////////////////////////////////////////////////////////////////////////////////

export class HospitalRepo implements IHospitalRepo {

    create = async (model: HospitalDomainModel): Promise<HospitalDto> => {
        try {
            const entity = {
                Name           : model.Name,
                HealthSystemId : model.HealthSystemId,
                Tags           : model.Tags && model.Tags.length > 0 ? JSON.stringify(model.Tags) : null,
            };
            const record = await Hospital.create(entity);
            return HospitalMapper.toDto(record);
        }
        catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: uuid): Promise<HospitalDto> => {
        try {
            const record = await Hospital.findOne({
                where   : { id: id },
                include : [
                    {
                        model    : HealthSystem,
                        as       : 'HealthSystem',
                        required : true,
                    }
                ]
            });
            return HospitalMapper.toDto(record);
        }
        catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    update = async (id: uuid, model: HospitalDomainModel): Promise<HospitalDto> => {
        try {
            const record = await Hospital.findByPk(id);

            if (model.Name != null) {
                record.Name = model.Name;
            }
            if (model.Tags != null) {
                record.Tags = model.Tags && model.Tags.length > 0 ? JSON.stringify(model.Tags) : null;
            }
            await record.save();

            return await this.getById(id);
        }
        catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: uuid): Promise<boolean> => {
        try {
            const record = await Hospital.findByPk(id);
            await record.destroy();
            return true;
        }
        catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: HospitalSearchFilters): Promise<HospitalSearchResults> => {
        try {
            const search = {
                where : {
                },
                include : [
                    {
                        model    : HealthSystem,
                        as       : 'HealthSystem',
                        required : true,
                    }
                ],
            };

            if (filters.Name != null) {
                search.where['Name'] = { [Op.like]: '%' + filters.Name + '%' };
            }
            if (filters.HealthSystemId != null) {
                search.where['HealthSystemId'] = { [Op.eq]: filters.HealthSystemId };
            }
            if (filters.Tags != null) {
                search.where['Tags'] = { [Op.like]: '%' + filters.Tags + '%' };
            }

            const searchResults = await Hospital.findAndCountAll(search);
            const dtos = searchResults.rows.map(x => HospitalMapper.toDto(x));
            const searchResult: HospitalSearchResults = {
                Items          : dtos,
                Order          : filters.Order,
                OrderedBy      : filters.OrderBy,
                TotalCount     : searchResults.count,
                RetrievedCount : dtos.length,
                PageIndex      : filters.PageIndex,
                ItemsPerPage   : filters.ItemsPerPage,
            };

            return searchResult;
        }
        catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getHospitalsForHealthSystem = async (healthSystemId: uuid): Promise<HospitalDto[]> => {
        try {
            const filter = {
                where : {
                    HealthSystemId : healthSystemId
                }
            };
            const healthSystemHospitals = await Hospital.findAll(filter);
            const dtos: HospitalDto[] = [];
            for (const hospital of healthSystemHospitals) {
                const dto = HospitalMapper.toDto(hospital);
                dtos.push(dto);
            }
            return dtos;
        }
        catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
