import { Op } from 'sequelize';
import { ApiError } from '../../../../../../common/api.error';
import { Logger } from '../../../../../../common/logger';
import { CourseModuleDomainModel } from "../../../../../../domain.types/educational/course/course.module/course.module.domain.model";
import { CourseModuleDto } from "../../../../../../domain.types/educational/course/course.module/course.module.dto";
import { CourseModuleSearchFilters,
    CourseModuleSearchResults
} from "../../../../../../domain.types/educational/course/course.module/course.module.search.types";
import { ICourseModuleRepo } from '../../../../../repository.interfaces/educational/course/course.module.repo.interface';
import { CourseModuleMapper } from '../../../mappers/educational/course/course.module.mapper';
import CourseModule from '../../../models/educational/course/course.module.model';

///////////////////////////////////////////////////////////////////////

export class CourseModuleRepo implements ICourseModuleRepo {

    create = async (createModel: CourseModuleDomainModel):
    Promise<CourseModuleDto> => {
        try {
            const entity = {
                CourseId       : createModel.CourseId,
                Name           : createModel.Name,
                Description    : createModel.Description,
                ImageUrl       : createModel.ImageUrl,
                DurationInMins : createModel.DurationInMins,
            };

            const courseModule = await CourseModule.create(entity);
            return await CourseModuleMapper.toDto(courseModule);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<CourseModuleDto> => {
        try {
            const courseModule = await CourseModule.findByPk(id);
            return await CourseModuleMapper.toDto(courseModule);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: CourseModuleSearchFilters): Promise<CourseModuleSearchResults> => {
        try {

            const search = { where: {} };

            if (filters.Name != null) {
                search.where['Name'] = { [Op.like]: '%' + filters.Name + '%' };
            }
            if (filters.CourseId != null) {
                search.where['CourseId'] = filters.CourseId;
            }
            if (filters.DurationInMins != null) {
                search.where['DurationInMins'] = filters.DurationInMins;
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

            const foundResults = await CourseModule.findAndCountAll(search);

            const dtos: CourseModuleDto[] = [];
            for (const courseModule of foundResults.rows) {
                const dto = await CourseModuleMapper.toDto(courseModule);
                dtos.push(dto);
            }

            const searchResults: CourseModuleSearchResults = {
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

    update = async (id: string, updateModel: CourseModuleDomainModel):
    Promise<CourseModuleDto> => {
        try {
            const courseModule = await CourseModule.findByPk(id);

            if (updateModel.CourseId != null) {
                courseModule.CourseId = updateModel.CourseId;
            }
            if (updateModel.Name != null) {
                courseModule.Name = updateModel.Name;
            }
            if (updateModel.Description != null) {
                courseModule.Description = updateModel.Description;
            }
            if (updateModel.ImageUrl != null) {
                courseModule.ImageUrl = updateModel.ImageUrl;
            }
            if (updateModel.DurationInMins != null) {
                courseModule.DurationInMins = updateModel.DurationInMins;
            }

            await courseModule.save();

            return await CourseModuleMapper.toDto(courseModule);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {

            const result = await CourseModule.destroy({ where: { id: id } });
            return result === 1;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getModulesForCourse = (courseId: string): Promise<any> => {
        throw new Error('Method not implemented.');
    }

}
