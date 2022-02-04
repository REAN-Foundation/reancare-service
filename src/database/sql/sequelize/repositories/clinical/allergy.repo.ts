import { Op } from 'sequelize';
import { ApiError } from '../../../../../common/api.error';
import { Logger } from '../../../../../common/logger';
import { AllergyDomainModel } from '../../../../../domain.types/clinical/allergy/allergy.domain.model';
import { AllergyDto } from '../../../../../domain.types/clinical/allergy/allergy.dto';
import { AllergySearchFilters, AllergySearchResults } from '../../../../../domain.types/clinical/allergy/allergy.search.types';
import { IAllergyRepo } from '../../../../repository.interfaces/clinical/allergy.repo.interface';
import { AllergyMapper } from '../../mappers/clinical/allergy.mapper';
import Allergy from '../../models/clinical/allergy.model';

///////////////////////////////////////////////////////////////////////

export class AllergyRepo implements IAllergyRepo {

    create = async (allergyDomainModel: AllergyDomainModel): Promise<AllergyDto> => {
        try {
            const entity = {
                PatientUserId         : allergyDomainModel.PatientUserId ?? null,
                Allergy               : allergyDomainModel.Allergy ?? null,
                AllergenCategory      : allergyDomainModel.AllergenCategory ?? null,
                AllergenExposureRoute : allergyDomainModel.AllergenExposureRoute ?? null,
                Severity              : allergyDomainModel.Severity ?? null,
                Reaction              : allergyDomainModel.Reaction ?? null,
                OtherInformation      : allergyDomainModel.OtherInformation ?? null,
                LastOccurrence        : allergyDomainModel.LastOccurrence ?? null,
            };
            const allergy = await Allergy.create(entity);
            return await AllergyMapper.toDto(allergy);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<AllergyDto> => {
        try {
            const allergy = await Allergy.findByPk(id);
            return await AllergyMapper.toDto(allergy);
            
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getForPatient = async (id: string): Promise<AllergyDto[]> => {
        try {
            const search = { where: {} };

            search.where['PatientUserId'] = { [Op.eq]: id };

            const foundResults = await Allergy.findAll(search);

            const dtos: AllergyDto[] = [];
            for (const allergy of foundResults) {
                const dto = await AllergyMapper.toDto(allergy);
                dtos.push(dto);
            }

            return dtos;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    update = async (id: string, updateModel: AllergyDomainModel): Promise<AllergyDto> => {
        try {
            const allergy = await Allergy.findByPk(id);

            if (updateModel.PatientUserId != null) {
                allergy.PatientUserId = updateModel.PatientUserId;
            }
            if (updateModel.Allergy != null) {
                allergy.Allergy = updateModel.Allergy;
            }
            if (updateModel.AllergenCategory != null) {
                allergy.AllergenCategory = updateModel.AllergenCategory;
            }
            if (updateModel.AllergenExposureRoute != null) {
                allergy.AllergenExposureRoute = updateModel.AllergenExposureRoute;
            }
            if (updateModel.Severity != null) {
                allergy.Severity = updateModel.Severity;
            }
            if (updateModel.Reaction != null) {
                allergy.Reaction = updateModel.Reaction;
            }
            if (updateModel.OtherInformation != null) {
                allergy.OtherInformation = updateModel.OtherInformation;
            }
            if (updateModel.LastOccurrence != null) {
                allergy.LastOccurrence = updateModel.LastOccurrence;
            }
            await allergy.save();

            return await AllergyMapper.toDto(allergy);
            
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };
    
    search = async (filters: AllergySearchFilters): Promise<AllergySearchResults> => {

        try {
            const search = { where: {} };

            if (filters.PatientUserId != null) {
                search.where['PatientUserId'] = filters.PatientUserId;
            }
            if (filters.Allergy != null) {
                search.where['Allergy'] = { [Op.like]: '%' + filters.Allergy + '%' };
            }
            if (filters.AllergenCategory != null) {
                search.where['AllergenCategory'] = { [Op.like]: '%' + filters.AllergenCategory + '%' };
            }
            if (filters.AllergenExposureRoute != null) {
                search.where['AllergenExposureRoute'] = { [Op.like]: '%' + filters.AllergenExposureRoute + '%' };
            }
            if (filters.Severity != null) {
                search.where['Severity'] = { [Op.like]: '%' + filters.Severity + '%' };
            }
            if (filters.Reaction != null) {
                search.where['Reaction'] = { [Op.like]: '%' + filters.Reaction + '%' };
            }
            
            let orderByColum = 'Allergy';
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

            const foundResults = await Allergy.findAndCountAll(search);

            const dtos: AllergyDto[] = [];
            for (const doctorNote of foundResults.rows) {
                const dto = await AllergyMapper.toDto(doctorNote);
                dtos.push(dto);
            }

            const searchResults: AllergySearchResults = {
                TotalCount     : foundResults.count,
                RetrievedCount : dtos.length,
                PageIndex      : pageIndex,
                ItemsPerPage   : limit,
                Order          : order === 'DESC' ? 'descending' : 'ascending',
                OrderedBy      : orderByColum,
                Items          : dtos
            };
            return searchResults;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {
            await Allergy.destroy({ where: { id: id } });
            return true;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
