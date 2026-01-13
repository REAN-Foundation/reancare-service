import { Op } from 'sequelize';
import { ApiError } from '../../../../../../common/api.error';
import { Logger } from '../../../../../../common/logger';
import { VaccinationDomainModel } from "../../../../../../domain.types/clinical/maternity/vaccination/vaccination.domain.model";
import { VaccinationDto } from "../../../../../../domain.types/clinical/maternity/vaccination/vaccination.dto";
import { VaccinationSearchFilters, VaccinationSearchResults } from "../../../../../../domain.types/clinical/maternity/vaccination/vaccination.search.type";
import { IVaccinationRepo } from '../../../../../repository.interfaces/clinical/maternity/vaccination.repo.interface';
import { VaccinationMapper } from '../../../mappers/clinical/maternity/vaccination.mapper';
import Vaccination from '../../../models/clinical/maternity/vaccination.model';

///////////////////////////////////////////////////////////////////////

export class VaccinationRepo implements IVaccinationRepo {

    totalCount = async (): Promise<number> => {
        try {
            return await Vaccination.count();
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    create = async (createModel: VaccinationDomainModel): Promise<VaccinationDto> => {
        try {
            const entity = {
                PregnancyId             : createModel.PregnancyId,
                VaccineName             : createModel.VaccineName,
                DoseNumber              : createModel.DoseNumber,
                DateAdministered        : createModel.DateAdministered,
                MedicationId            : createModel.MedicationId,
                MedicationConsumptionId : createModel.MedicationConsumptionId
            };

            const vaccination = await Vaccination.create(entity);
            return VaccinationMapper.toDto(vaccination);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<VaccinationDto> => {
        try {
            const vaccination = await Vaccination.findByPk(id);
            return VaccinationMapper.toDto(vaccination);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: VaccinationSearchFilters): Promise<VaccinationSearchResults> => {
        try {
            const search = { where: {} };
            
            if (filters.PregnancyId != null) {
                search.where['PregnancyId'] = { [Op.eq]: filters.PregnancyId };
            }
            if (filters.VaccineName != null) {
                search.where['VaccineName'] = { [Op.like]: `%${filters.VaccineName}%` };
            }
            if (filters.DoseNumber != null) {
                search.where['DoseNumber'] = { [Op.eq]: filters.DoseNumber };
            }
            if (filters.DateAdministered != null) {
                search.where['DateAdministered'] = { [Op.eq]: filters.DateAdministered };
            }
            if (filters.MedicationId != null) {
                search.where['MedicationId'] = { [Op.eq]: filters.MedicationId };
            }
            if (filters.MedicationConsumptionId != null) {
                search.where['MedicationConsumptionId'] = { [Op.eq]: filters.MedicationConsumptionId };
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

            const foundResults = await Vaccination.findAndCountAll(search);

            const dtos: VaccinationDto[] = [];
            for (const vaccination of foundResults.rows) {
                const dto = await VaccinationMapper.toDto(vaccination);
                dtos.push(dto);
            }

            const searchResults: VaccinationSearchResults = {
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

    update = async (id: string, updateModel: VaccinationDomainModel): Promise<VaccinationDto> => {
        try {
            const vaccination = await Vaccination.findByPk(id);
            
            if (updateModel.PregnancyId != null) {
                vaccination.PregnancyId = updateModel.PregnancyId;
            }
            if (updateModel.VaccineName != null) {
                vaccination.VaccineName = updateModel.VaccineName;
            }
            if (updateModel.DoseNumber != null) {
                vaccination.DoseNumber = updateModel.DoseNumber;
            }
            if (updateModel.DateAdministered != null) {
                vaccination.DateAdministered = updateModel.DateAdministered;
            }
            if (updateModel.MedicationId != null) {
                vaccination.MedicationId = updateModel.MedicationId;
            }
            if (updateModel.MedicationConsumptionId != null) {
                vaccination.MedicationConsumptionId = updateModel.MedicationConsumptionId;
            }

            await vaccination.save();

            return VaccinationMapper.toDto(vaccination);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {
            const result = await Vaccination.destroy({ where: { id: id } });
            return result === 1;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
