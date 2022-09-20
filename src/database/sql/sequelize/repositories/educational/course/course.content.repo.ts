import { Op } from 'sequelize';
import { ApiError } from '../../../../../../common/api.error';
import { Logger } from '../../../../../../common/logger';
import { CourseContentDomainModel } from "../../../../../../domain.types/educational/course/course.content/course.content.domain.model";
import { CourseContentDto } from "../../../../../../domain.types/educational/course/course.content/course.content.dto";
import { CourseContentSearchFilters,
    CourseContentSearchResults
} from "../../../../../../domain.types/educational/course/course.content/course.content.search.types";
import { ICourseContentRepo } from '../../../../../repository.interfaces/educational/course/course.content.repo.interface';
import { CourseContentMapper } from '../../../mappers/educational/course/course.content.mapper';
import CourseContent from '../../../models/educational/course/course.content.model';

///////////////////////////////////////////////////////////////////////

export class CourseContentRepo implements ICourseContentRepo {

    create = async (createModel: CourseContentDomainModel):
    Promise<CourseContentDto> => {
        try {
            const entity = {
                ModuleId       : createModel.ModuleId,
                Title          : createModel.Title ,
                Description    : createModel.Description,
                ImageUrl       : createModel.ImageUrl,
                DurationInMins : createModel.DurationInMins,
                ContentType    : createModel.ContentType,
                ResourceLink   : createModel.ResourceLink,
                Sequence       : createModel.Sequence,
            };

            const courseContent = await CourseContent.create(entity);
            return await CourseContentMapper.toDto(courseContent);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<CourseContentDto> => {
        try {
            const courseContent = await CourseContent.findByPk(id);
            return await CourseContentMapper.toDto(courseContent);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: CourseContentSearchFilters): Promise<CourseContentSearchResults> => {
        try {

            const search = { where: {} };

            if (filters.Title  != null) {
                search.where['Title '] = { [Op.like]: '%' + filters.Title  + '%' };
            }
            if (filters.ModuleId != null) {
                search.where['ModuleId'] = filters.ModuleId;
            }
            if (filters.DurationFrom != null) {
                search.where['DurationFrom'] = filters.DurationFrom;
            }
            if (filters.DurationTo != null) {
                search.where['DurationTo'] = filters.DurationTo;
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

            const foundResults = await CourseContent.findAndCountAll(search);

            const dtos: CourseContentDto[] = [];
            for (const courseContent of foundResults.rows) {
                const dto = await CourseContentMapper.toDto(courseContent);
                dtos.push(dto);
            }

            const searchResults: CourseContentSearchResults = {
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

    update = async (id: string, updateModel: CourseContentDomainModel):
    Promise<CourseContentDto> => {
        try {
            const courseContent = await CourseContent.findByPk(id);

            if (updateModel.ModuleId != null) {
                courseContent.ModuleId = updateModel.ModuleId;
            }
            if (updateModel.Title  != null) {
                courseContent.Title  = updateModel.Title ;
            }
            if (updateModel.Description != null) {
                courseContent.Description = updateModel.Description;
            }
            if (updateModel.ImageUrl != null) {
                courseContent.ImageUrl = updateModel.ImageUrl;
            }
            if (updateModel.DurationInMins != null) {
                courseContent.DurationInMins = updateModel.DurationInMins;
            }
            if (updateModel.ContentType != null) {
                courseContent.ContentType = updateModel.ContentType;
            }
            if (updateModel.ResourceLink != null) {
                courseContent.ResourceLink = updateModel.ResourceLink;
            }
            if (updateModel.Sequence != null) {
                courseContent.Sequence = updateModel.Sequence;
            }

            await courseContent.save();

            return await CourseContentMapper.toDto(courseContent);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {
            const result = await CourseContent.destroy({ where: { id: id } });
            return result === 1;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    GetContentsForCourseModule = async (moduleId: string): Promise<any> => {
        throw new Error('Method not implemented.');
    }

}
