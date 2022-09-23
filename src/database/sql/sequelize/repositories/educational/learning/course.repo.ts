import { Op } from 'sequelize';
import { ApiError } from '../../../../../../common/api.error';
import { Logger } from '../../../../../../common/logger';
import { CourseDomainModel } from "../../../../../../domain.types/educational/learning/course/course.domain.model";
import { CourseDto } from "../../../../../../domain.types/educational/learning/course/course.dto";
import { CourseSearchFilters,
    CourseSearchResults
} from "../../../../../../domain.types/educational/learning/course/course.search.types";
import { ICourseRepo } from '../../../../../repository.interfaces/educational/learning/course.repo.interface';
import { CourseMapper } from '../../../mappers/educational/learning/course.mapper';
import Course from '../../../models/educational/learning/course.model';

///////////////////////////////////////////////////////////////////////

export class CourseRepo implements ICourseRepo {

    create = async (createModel: CourseDomainModel):
    Promise<CourseDto> => {
        try {
            const entity = {
                LearningPathId : createModel.LearningPathId,
                Name           : createModel.Name,
                Description    : createModel.Description,
                ImageUrl       : createModel.ImageUrl,
                DurationInDays : createModel.DurationInDays,
            };

            const course = await Course.create(entity);
            return await CourseMapper.toDto(course);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<CourseDto> => {
        try {
            const course = await Course.findByPk(id);
            return await CourseMapper.toDto(course);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: CourseSearchFilters): Promise<CourseSearchResults> => {
        try {

            const search = { where: {} };

            if (filters.Name != null) {
                search.where['Name'] = { [Op.like]: '%' + filters.Name + '%' };
            }
            if (filters.LearningPathId != null) {
                search.where['LearningPathId'] = filters.LearningPathId;
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

            const foundResults = await Course.findAndCountAll(search);

            const dtos: CourseDto[] = [];
            for (const course of foundResults.rows) {
                const dto = await CourseMapper.toDto(course);
                dtos.push(dto);
            }

            const searchResults: CourseSearchResults = {
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

    update = async (id: string, updateModel: CourseDomainModel):
    Promise<CourseDto> => {
        try {
            const course = await Course.findByPk(id);

            if (updateModel.LearningPathId != null) {
                course.LearningPathId = updateModel.LearningPathId;
            }
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

            await course.save();

            return await CourseMapper.toDto(course);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {

            const result = await Course.destroy({ where: { id: id } });
            return result === 1;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getCoursesForLearningPath = async (learningPathId: string): Promise<CourseDto[]> => {
        try {
            const courses = await Course.findAll({ where: { LearningPathId: learningPathId } });
            return courses.map(x => CourseMapper.toDto(x));
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };
}
