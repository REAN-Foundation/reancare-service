import { Op } from 'sequelize';
import { ApiError } from '../../../../../../common/api.error';
import { Logger } from '../../../../../../common/logger';
import { PregnancyDomainModel } from "../../../../../../domain.types/clinical/maternity/pregnancy/pregnancy.domain.model";
import { PregnancyDto } from "../../../../../../domain.types/clinical/maternity/pregnancy/pregnancy.dto";
import { PregnancySearchFilters, PregnancySearchResults } from "../../../../../../domain.types/clinical/maternity/pregnancy/pregnancy.search.type";
import { IPregnancyRepo } from '../../../../../repository.interfaces/clinical/maternity/pregnancy.repo.interface';
import { PregnancyMapper } from '../../../mappers/clinical/maternity/pregnancy.mapper';
import Pregnancy from '../../../models/clinical/maternity/pregnancy.model';

///////////////////////////////////////////////////////////////////////

export class PregnancyRepo implements IPregnancyRepo {

    totalCount = async (): Promise<number> => {
        try {
            return await Pregnancy.count();
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    create = async (createModel: PregnancyDomainModel): Promise<PregnancyDto> => {
        try {
            const entity = {
                PatientUserId             : createModel.PatientUserId,
                ExternalPregnancyId       : createModel.ExternalPregnancyId,
                DateOfLastMenstrualPeriod : createModel.DateOfLastMenstrualPeriod,
                EstimatedDateOfChildBirth : createModel.EstimatedDateOfChildBirth,
                Gravidity                 : createModel.Gravidity,
                Parity                    : createModel.Parity
            };

            const pregnancy = await Pregnancy.create(entity);
            return PregnancyMapper.toDto(pregnancy);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<PregnancyDto> => {
        try {
            const pregnancy = await Pregnancy.findByPk(id);
            return PregnancyMapper.toDto(pregnancy);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: PregnancySearchFilters): Promise<PregnancySearchResults> => {
        try {
            const search = { where: {} };
            
            if (filters.DateOfLastMenstrualPeriod != null) {
                search.where['DateOfLastMenstrualPeriod'] = { [Op.eq]: filters.DateOfLastMenstrualPeriod };
            }
            if (filters.EstimatedDateOfChildBirth != null) {
                search.where['EstimatedDateOfChildBirth'] = { [Op.eq]: filters.EstimatedDateOfChildBirth };
            }
            if (filters.Gravidity != null) {
                search.where['Gravidity'] = filters.Gravidity;
            }
            if (filters.Parity != null) {
                search.where['Parity'] = filters.Parity;
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

            const foundResults = await Pregnancy.findAndCountAll(search);

            const dtos: PregnancyDto[] = [];
            for (const pregnancy of foundResults.rows) {
                const dto = PregnancyMapper.toDto(pregnancy);
                dtos.push(dto);
            }

            const searchResults: PregnancySearchResults = {
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

    update = async (id: string, updateModel: PregnancyDomainModel): Promise<PregnancyDto> => {
        try {
            const pregnancy = await Pregnancy.findByPk(id);

            if (updateModel.DateOfLastMenstrualPeriod != null) {
                pregnancy.DateOfLastMenstrualPeriod = updateModel.DateOfLastMenstrualPeriod;
            }
            if (updateModel.EstimatedDateOfChildBirth != null) {
                pregnancy.EstimatedDateOfChildBirth = updateModel.EstimatedDateOfChildBirth;
            }
            if (updateModel.Gravidity != null) {
                pregnancy.Gravidity = updateModel.Gravidity;
            }
            if (updateModel.Parity != null) {
                pregnancy.Parity = updateModel.Parity;
            }

            await pregnancy.save();

            return PregnancyMapper.toDto(pregnancy);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {
            const result = await Pregnancy.destroy({ where: { id: id } });
            return result === 1;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
