import { Op } from 'sequelize';
import { ApiError } from '../../../../../../common/api.error';
import { Logger } from '../../../../../../common/logger';
import { LearningPathDomainModel } from "../../../../../../domain.types/educational/learning/learning.path/learning.path.domain.model";
import { LearningPathDto } from "../../../../../../domain.types/educational/learning/learning.path/learning.path.dto";
import { LearningPathSearchFilters,
    LearningPathSearchResults
} from "../../../../../../domain.types/educational/learning/learning.path/learning.path.search.types";
import { ILearningPathRepo } from '../../../../../repository.interfaces/educational/learning/learning.path.repo.interface';
import { LearningPathMapper } from '../../../mappers/educational/learning/learning.path.mapper';
import LearningPath from '../../../models/educational/learning/learning.path.model';

///////////////////////////////////////////////////////////////////////

export class LearningPathRepo implements ILearningPathRepo {

    create = async (createModel: LearningPathDomainModel):
    Promise<LearningPathDto> => {
        try {
            const entity = {
                Name             : createModel.Name,
                Description      : createModel.Description,
                ImageUrl         : createModel.ImageUrl,
                DurationInDays   : createModel.DurationInDays,
                StartDate        : createModel.StartDate,
                EndDate          : createModel.EndDate,
                PreferenceWeight : createModel.PreferenceWeight,
                Enabled          : createModel.Enabled,
            };

            const course = await LearningPath.create(entity);
            return await LearningPathMapper.toDto(course);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<LearningPathDto> => {
        try {
            const course = await LearningPath.findByPk(id);
            return await LearningPathMapper.toDto(course);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: LearningPathSearchFilters): Promise<LearningPathSearchResults> => {
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

            const foundResults = await LearningPath.findAndCountAll(search);

            const dtos: LearningPathDto[] = [];
            for (const course of foundResults.rows) {
                const dto = await LearningPathMapper.toDto(course);
                dtos.push(dto);
            }

            const searchResults: LearningPathSearchResults = {
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

    update = async (id: string, updateModel: LearningPathDomainModel):
    Promise<LearningPathDto> => {
        try {
            const course = await LearningPath.findByPk(id);

            if (updateModel.Name != null) {
                course.Name = updateModel.Name;
            }
            if (updateModel.Description != null) {
                course.Description = updateModel.Description;
            }
            if (updateModel.ImageUrl != null) {
                course.ImageUrl = updateModel.ImageUrl;
            }
            if (updateModel.DurationInDays != null) {
                course.DurationInDays = updateModel.DurationInDays;
            }
            if (updateModel.PreferenceWeight != null) {
                course.PreferenceWeight = updateModel.PreferenceWeight;
            }
            if (updateModel.Enabled != null) {
                course.Enabled = updateModel.Enabled;
            }

            await course.save();

            return await LearningPathMapper.toDto(course);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {

            const result = await LearningPath.destroy({ where: { id: id } });
            return result === 1;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
