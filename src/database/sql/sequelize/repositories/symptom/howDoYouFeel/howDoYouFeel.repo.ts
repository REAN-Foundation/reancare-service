import { IHowDoYouFeelRepo } from '../../../../../repository.interfaces/symptom/howDoYouFeel/howDoYouFeel.repo.interface';
import HowDoYouFeel from '../../../models/clinical/symptom/how.do.you.feel.model';
import { Op } from 'sequelize';
import { HowDoYouFeelMapper } from '../../../mappers/symptom/howDoYouFeel/howDoYouFeel.mapper';
import { Logger } from '../../../../../../common/logger';
import { ApiError } from '../../../../../../common/api.error';
import { HowDoYouFeelDomainModel } from '../../../../../../domain.types/clinical/symptom/how.do.you.feel/how.do.you.feel.domain.model';
import { HowDoYouFeelDto } from '../../../../../../domain.types/clinical/symptom/how.do.you.feel/how.do.you.feel.dto';
import { HowDoYouFeelSearchFilters, HowDoYouFeelSearchResults } from '../../../../../../domain.types/clinical/symptom/how.do.you.feel/how.do.you.feel.search.types';

///////////////////////////////////////////////////////////////////////

export class HowDoYouFeelRepo implements IHowDoYouFeelRepo {

    create = async (howDoYouFeelDomainModel: HowDoYouFeelDomainModel): Promise<HowDoYouFeelDto> => {
        try {
            const entity = {
                EhrId         : howDoYouFeelDomainModel.EhrId,
                PatientUserId : howDoYouFeelDomainModel.PatientUserId ?? null,
                Feeling       : howDoYouFeelDomainModel.Feeling ?? null,
                Comments      : howDoYouFeelDomainModel.Comments ?? null,
                RecordDate    : howDoYouFeelDomainModel.RecordDate ?? null,
            };
            const howDoYouFeel = await HowDoYouFeel.create(entity);
            const dto = await HowDoYouFeelMapper.toDto(howDoYouFeel);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<HowDoYouFeelDto> => {
        try {
            const howDoYouFeel = await HowDoYouFeel.findByPk(id);
            const dto = await HowDoYouFeelMapper.toDto(howDoYouFeel);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: HowDoYouFeelSearchFilters): Promise<HowDoYouFeelSearchResults> => {
        try {
            const search = { where: {} };

            if (filters.Feeling != null) {
                search.where['Feeling'] = { [Op.eq]: filters.Feeling };
            }
            if (filters.PatientUserId != null) {
                search.where['PatientUserId'] = { [Op.eq]: filters.PatientUserId };
            }
            if (filters.DateFrom != null && filters.DateTo != null) {
                search.where['RecordDate'] = {
                    [Op.gte] : filters.DateFrom,
                    [Op.lte] : filters.DateTo,
                };
            }

            let orderByColum = 'RecordDate';
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

            const foundResults = await HowDoYouFeel.findAndCountAll(search);

            const dtos: HowDoYouFeelDto[] = [];
            for (const howDoYouFeel of foundResults.rows) {
                const dto = await HowDoYouFeelMapper.toDto(howDoYouFeel);
                dtos.push(dto);
            }

            const searchResults: HowDoYouFeelSearchResults = {
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

    update = async (id: string, howDoYouFeelDomainModel: HowDoYouFeelDomainModel): Promise<HowDoYouFeelDto> => {
        try {
            const howDoYouFeel = await HowDoYouFeel.findByPk(id);

            if (howDoYouFeelDomainModel.EhrId != null) {
                howDoYouFeel.EhrId = howDoYouFeelDomainModel.EhrId;
            }
            if (howDoYouFeelDomainModel.PatientUserId != null) {
                howDoYouFeel.PatientUserId = howDoYouFeelDomainModel.PatientUserId;
            }
            if (howDoYouFeelDomainModel.Feeling != null) {
                howDoYouFeel.Feeling = howDoYouFeelDomainModel.Feeling;
            }
            if (howDoYouFeelDomainModel.Comments != null) {
                howDoYouFeel.Comments = howDoYouFeelDomainModel.Comments;
            }
            if (howDoYouFeelDomainModel.RecordDate != null) {
                howDoYouFeel.RecordDate = new Date(howDoYouFeelDomainModel.RecordDate).toISOString();
            }
            await howDoYouFeel.save();

            const dto = await HowDoYouFeelMapper.toDto(howDoYouFeel);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {
            await HowDoYouFeel.destroy({ where: { id: id } });
            return true;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
