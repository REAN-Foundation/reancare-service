import { Op } from 'sequelize';
import { ApiError } from '../../../../../../common/api.error';
import { Logger } from '../../../../../../common/logger';
import { PostnatalVisitDomainModel } from '../../../../../../domain.types/clinical/maternity/postnatal.visit/postnatal.visit.domain.model';
import { PostnatalVisitDto } from '../../../../../../domain.types/clinical/maternity/postnatal.visit/postnatal.visit.dto';
import { PostnatalVisitSearchFilters, PostnatalVisitSearchResults } from '../../../../../../domain.types/clinical/maternity/postnatal.visit/postnatal.visit.search type';
import { IPostnatalVisitRepo } from '../../../../../repository.interfaces/clinical/maternity/postnatal.visit.repo.interface';
import { PostnatalVisitMapper } from '../../../mappers/clinical/maternity/postnatal.visit.mapper';
import PostnatalVisit from '../../../models/clinical/maternity/postnatal.visit.model';

///////////////////////////////////////////////////////////////////////

export class PostnatalVisitRepo implements IPostnatalVisitRepo {

    totalCount = async (): Promise<number> => {
        try {
            return await PostnatalVisit.count();
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    create = async (createModel: PostnatalVisitDomainModel): Promise<PostnatalVisitDto> => {
        try {
            const entity = {
                DeliveryId        : createModel.DeliveryId,
                PatientUserId     : createModel.PatientUserId,
                DateOfVisit       : createModel.DateOfVisit,
                BodyWeightId      : createModel.BodyWeightId,
                ComplicationId    : createModel.ComplicationId,
                BodyTemperatureId : createModel.BodyTemperatureId,
                BloodPressureId   : createModel.BloodPressureId
            };

            const postnatalVisit = await PostnatalVisit.create(entity);
            return PostnatalVisitMapper.toDto(postnatalVisit);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<PostnatalVisitDto> => {
        try {
            const postnatalVisit = await PostnatalVisit.findByPk(id);
            return PostnatalVisitMapper.toDto(postnatalVisit);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: PostnatalVisitSearchFilters): Promise<PostnatalVisitSearchResults> => {
        try {
            const search = { where: {} };

            if (filters.DateOfVisit != null) {
                search.where['DateOfVisit'] = { [Op.eq]: filters.DateOfVisit };
            }
            if (filters.DeliveryId != null) {
                search.where['DeliveryId'] = filters.DeliveryId;
            }
            if (filters.PatientUserId != null) {
                search.where['PatientUserId'] = filters.PatientUserId;
            }
            if (filters.BodyWeightId != null) {
                search.where['BodyWeightId'] = filters.BodyWeightId;
            }
            if (filters.ComplicationId != null) {
                search.where['ComplicationId'] = filters.ComplicationId;
            }
            if (filters.BodyTemperatureId != null) {
                search.where['BodyTemperatureId'] = filters.BodyTemperatureId;
            }
            if (filters.BloodPressureId != null) {
                search.where['BloodPressureId'] = filters.BloodPressureId;
            }

            let orderByColumn = 'CreatedAt';
            if (filters.OrderBy) {
                orderByColumn = filters.OrderBy;
            }
            let order = 'ASC';
            if (filters.Order === 'descending') {
                order = 'DESC';
            }
            search['order'] = [[orderByColumn, order]];

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

            const foundResults = await PostnatalVisit.findAndCountAll(search);

            const dtos: PostnatalVisitDto[] = [];
            for (const postnatalVisit of foundResults.rows) {
                const dto = PostnatalVisitMapper.toDto(postnatalVisit);
                dtos.push(dto);
            }

            const searchResults: PostnatalVisitSearchResults = {
                TotalCount     : foundResults.count,
                RetrievedCount : dtos.length,
                PageIndex      : pageIndex,
                ItemsPerPage   : limit,
                Order          : order === 'DESC' ? 'descending' : 'ascending',
                OrderedBy      : orderByColumn,
                Items          : dtos,
            };

            return searchResults;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    update = async (id: string, updateModel: PostnatalVisitDomainModel): Promise<PostnatalVisitDto> => {
        try {
            const postnatalVisit = await PostnatalVisit.findByPk(id);

            if (updateModel.DeliveryId != null) {
                postnatalVisit.DeliveryId = updateModel.DeliveryId;
            }
            if (updateModel.PatientUserId != null) {
                postnatalVisit.PatientUserId = updateModel.PatientUserId;
            }
            if (updateModel.DateOfVisit != null) {
                postnatalVisit.DateOfVisit = updateModel.DateOfVisit;
            }
            if (updateModel.BodyWeightId != null) {
                postnatalVisit.BodyWeightId = updateModel.BodyWeightId;
            }
            if (updateModel.ComplicationId != null) {
                postnatalVisit.ComplicationId = updateModel.ComplicationId;
            }
            if (updateModel.BodyTemperatureId != null) {
                postnatalVisit.BodyTemperatureId = updateModel.BodyTemperatureId;
            }
            if (updateModel.BloodPressureId != null) {
                postnatalVisit.BloodPressureId = updateModel.BloodPressureId;
            }

            await postnatalVisit.save();

            return PostnatalVisitMapper.toDto(postnatalVisit);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {
            const result = await PostnatalVisit.destroy({ where: { id: id } });
            return result === 1;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
