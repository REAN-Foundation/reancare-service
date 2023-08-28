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
import CourseContent from '../../../models/educational/learning/course.content.model';
import Course from '../../../models/educational/learning/course.model';
import CourseModule from '../../../models/educational/learning/course.module.model';
import  LearningPathCourses from '../../../models/educational/learning/learning.course.model';
import LearningPath from '../../../models/educational/learning/learning.path.model';
import { LearningPathMapper } from '../../../mappers/educational/learning/learning.path.mapper';
import { LearningPathDto } from '../../../../../../domain.types/educational/learning/learning.path/learning.path.dto';

///////////////////////////////////////////////////////////////////////

export class CourseRepo implements ICourseRepo {

    create = async (createModel: CourseDomainModel):
    Promise<CourseDto> => {
        try {
            const entity = {
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

            const search = { where   : {} ,
                include : [
                    {
                        model   : CourseModule,
                        as      : "CourseModules",
                        include : [
                            {
                                model : CourseContent,
                                as    : "CourseContents",
                            }
                        ]
                    }
                ]
            };

            if (filters.Name != null) {
                search.where['Name'] = { [Op.like]: '%' + filters.Name + '%' };
            }
            if (filters.DurationInDays != null) {
                search.where['DurationInDays'] = filters.DurationInDays;
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
            const learningCourses = await  LearningPathCourses.findAll(
                { where   : { LearningPathId: learningPathId },
                    include : [
                        {
                            model : Course
                        }
                    ]
                }
            );
            var list = learningCourses.map(x => x.Course);
            return list.map(y => CourseMapper.toDto(y));

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getLearningPathsForCourse = async (courseId: string): Promise<LearningPathDto[]> => {
        try {
            const CourseLearningPaths = await  LearningPathCourses.findAll(
                { where   : { CourseId: courseId },
                    include : [
                        {
                            model : LearningPath
                        }
                    ]
                }
            );
            var list = CourseLearningPaths.map(x => x.LearningPath);
            return list.map(y => LearningPathMapper.toDto(y));

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };
    
    private addLearningPaths = async (courseId: string, learningPathIds: string[]) => {
        if (learningPathIds !== null && learningPathIds.length > 0) {
            for await (var learningPathId of learningPathIds) {
                await this.addLearningPath(courseId, learningPathId);
            }
        }
    };

    addLearningPath = async (id: string, learningPathId: string): Promise<boolean> => {
        try {
            const learningCourse = await  LearningPathCourses.findAll({
                where : {
                    CourseId       : id,
                    LearningPathId : learningPathId,
                }
            });
            if (learningCourse.length > 0) {
                return false;
            }
            var entity = await  LearningPathCourses.create({
                CourseId       : id,
                LearningPathId : learningPathId,
            });
            return entity != null;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };
    
}
