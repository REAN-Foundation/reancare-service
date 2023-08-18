import { Op } from 'sequelize';
import { CourseDto } from '../../../../../../domain.types/educational/learning/course/course.dto';
import { ApiError } from '../../../../../../common/api.error';
import { Logger } from '../../../../../../common/logger';
import { LearningPathDomainModel } from "../../../../../../domain.types/educational/learning/learning.path/learning.path.domain.model";
import { LearningPathDto } from "../../../../../../domain.types/educational/learning/learning.path/learning.path.dto";
import { LearningPathSearchFilters,
    LearningPathSearchResults
} from "../../../../../../domain.types/educational/learning/learning.path/learning.path.search.types";
import { ILearningPathRepo } from '../../../../../repository.interfaces/educational/learning/learning.path.repo.interface';
import { LearningPathMapper } from '../../../mappers/educational/learning/learning.path.mapper';
import Course from '../../../models/educational/learning/course.model';
import  LearningPathCourses from '../../../models/educational/learning/learning.course.model';
import LearningPath from '../../../models/educational/learning/learning.path.model';
import { CourseMapper } from '../../../mappers/educational/learning/course.mapper';

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

            const learningPath = await LearningPath.create(entity);
            await this.addCourses(learningPath.id, createModel.CourseIds);
            return await LearningPathMapper.toDto(learningPath);
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

            const search = { where   : {},
                include : [
                    {
                        model    : LearningPathCourses,
                        as       : 'LearningPathCourses',
                        required : true,
                    }
                ]
            };

            if (filters.Name != null) {
                search.where['Name'] = { [Op.like]: '%' + filters.Name + '%' };
            }
            if (filters.PreferenceWeight != null) {
                search.where['PreferenceWeight'] = filters.PreferenceWeight;
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
            
            await this.addCourses(course.id, updateModel.CourseIds);
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

    private addCourses = async (learningPathId, courseIds) => {
        if (courseIds !== null && courseIds.length > 0) {
            for await (var courseId of courseIds) {
                await this.addCourse(learningPathId, courseId);
            }
        }
    };

    addCourse = async (id: string, courseId: string): Promise<boolean> => {
        try {
            const learningCourse = await  LearningPathCourses.findAll({
                where : {
                    CourseId       : courseId,
                    LearningPathId : id
                }
            });
            if (learningCourse.length > 0) {
                return false;
            }
            var entity = await  LearningPathCourses.create({
                CourseId       : courseId,
                LearningPathId : id
            });
            return entity != null;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getCourses = async (id: string): Promise<CourseDto[]> => {

        try {
            const learningCourses = await  LearningPathCourses.findAll({
                where : {
                    LearningPathId : id
                },
                include : [
                    {
                        model : Course
                    }
                ]
            });
            var list = learningCourses.map(x => x.Course);
            return list.map(y => CourseMapper.toDto(y));

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}

