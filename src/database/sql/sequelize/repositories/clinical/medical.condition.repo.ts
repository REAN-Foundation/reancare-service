import { Op } from 'sequelize';
import { ApiError } from '../../../../../common/api.error';
import { Logger } from '../../../../../common/logger';
import { MedicalConditionDomainModel } from "../../../../../domain.types/clinical/medical.condition/medical.condition.domain.model";
import { MedicalConditionDto } from "../../../../../domain.types/clinical/medical.condition/medical.condition.dto";
import { MedicalConditionSearchFilters, MedicalConditionSearchResults } from "../../../../../domain.types/clinical/medical.condition/medical.condition.search.types";
import { IMedicalConditionRepo } from '../../../../repository.interfaces/clinical/medical.condition.repo.interface';
import { MedicalConditionMapper } from '../../mappers/clinical/medical.condition.mapper';
import MedicalConditionModel from '../../models/clinical/medical.condition.model';

///////////////////////////////////////////////////////////////////////

export class MedicalConditionRepo implements IMedicalConditionRepo {

    create = async (medicalConditionDomainModel: MedicalConditionDomainModel):
    Promise<MedicalConditionDto> => {
        try {
            const entity = {
                Condition   : medicalConditionDomainModel.Condition,
                Description : medicalConditionDomainModel.Description,
                Language    : medicalConditionDomainModel.Language,
            
            };

            const medicalCondition = await MedicalConditionModel.create(entity);
            return MedicalConditionMapper.toDto(medicalCondition);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<MedicalConditionDto> => {
        try {
            const medicalCondition = await MedicalConditionModel.findByPk(id);
            return MedicalConditionMapper.toDto(medicalCondition);
            
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: MedicalConditionSearchFilters): Promise<MedicalConditionSearchResults> => {
        try {
            const search = { where: {} };

            if (filters.Condition != null) {
                search.where['Condition'] = { [Op.like]: '%' + filters.Condition + '%' };
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

            const foundResults = await MedicalConditionModel.findAndCountAll(search);

            const dtos: MedicalConditionDto[] = [];
            for (const medicalCondition of foundResults.rows) {
                const dto = MedicalConditionMapper.toDto(medicalCondition);
                dtos.push(dto);
            }

            const searchResults: MedicalConditionSearchResults = {
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

    update = async (id: string, medicalConditionDomainModel: MedicalConditionDomainModel):
    Promise<MedicalConditionDto> => {
        try {
            const medicalCondition = await MedicalConditionModel.findByPk(id);

            if (medicalConditionDomainModel.Condition != null) {
                medicalCondition.Condition = medicalConditionDomainModel.Condition;
            }
            if (medicalConditionDomainModel.Description != null) {
                medicalCondition.Description = medicalConditionDomainModel.Description;
            }
            if (medicalConditionDomainModel.Language != null) {
                medicalCondition.Language = medicalConditionDomainModel.Language;
            }
            await medicalCondition.save();

            return MedicalConditionMapper.toDto(medicalCondition);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {
            await MedicalConditionModel.destroy({ where: { id: id } });
            return true;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
