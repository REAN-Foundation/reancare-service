import { ApiError } from '../../../../../common/api.error';
import { Logger } from '../../../../../common/logger';
import { VisitDto } from '../../../../../domain.types/clinical/visit/visit.dto';
import { VisitSearchFilters, VisitSearchResults } from '../../../../../domain.types/clinical/visit/visit.search.type';
import { IVisitRepo } from '../../../../repository.interfaces/clinical/visit.repo.interface';
import { VisitMapper } from '../../mappers/clinical/visit.mapper';
import VisitModel from '../../models/clinical/visit.model';
import { VisitDomainModel } from '../../../../../domain.types/clinical/visit/visit.domain.model';

///////////////////////////////////////////////////////////////////////

export class VisitRepo implements IVisitRepo {

    create = async (createModel: any): Promise<VisitDto> => {
        try {
            const entity = {
                VisitType                 : createModel.VisitType,
                EhrId                     : createModel.EhrId,
                DisplayId                 : createModel.DisplayId,
                PatientUserId             : createModel.PatientUserId,
                MedicalPractitionerUserId : createModel.MedicalPractitionerUserId,
                ReferenceVisitId          : createModel.ReferenceVisitId,
                CurrentState              : createModel.CurrentState,
                StartDate                 : createModel.StartDate,
                EndDate                   : createModel.EndDate,
                FulfilledAtOrganizationId : createModel.FulfilledAtOrganizationId,
                AdditionalInformation     : createModel.AdditionalInformation,
            };

            const visit = await VisitModel.create(entity);
            return VisitMapper.toDto(visit);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<VisitDto> => {
        try {
            const visit = await VisitModel.findByPk(id);
            return VisitMapper.toDto(visit);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: VisitSearchFilters): Promise<VisitSearchResults> => {
        try {
            const search = { where: {} };

            if (filters.VisitType) {
                search.where['VisitType'] = filters.VisitType;
            }
            if (filters.PatientUserId) {
                search.where['PatientUserId'] = filters.PatientUserId;
            }
            if (filters.MedicalPractitionerUserId) {
                search.where['MedicalPractitionerUserId'] = filters.MedicalPractitionerUserId;
            }
            if (filters.ReferenceVisitId) {
                search.where['ReferenceVisitId'] = filters.ReferenceVisitId;
            }
            if (filters.CurrentState) {
                search.where['CurrentState'] = filters.CurrentState;
            }
            if (filters.StartDate) {
                search.where['StartDate'] = filters.StartDate;
            }
            if (filters.EndDate) {
                search.where['EndDate'] = filters.EndDate;
            }

            let orderByColumn = 'CreatedAt';
            if (filters.OrderBy) {
                orderByColumn = filters.OrderBy;
            }
            const order = filters.Order === 'descending' ? 'DESC' : 'ASC';
            search['order'] = [[orderByColumn, order]];

            const limit = filters.ItemsPerPage || 25;
            let offset = 0;
            if (filters.PageIndex) {
                offset = filters.PageIndex * limit;
            }
            search['limit'] = limit;
            search['offset'] = offset;

            const foundResults = await VisitModel.findAndCountAll(search);
            const dtos = await Promise.all(foundResults.rows.map(visit => VisitMapper.toDto(visit)));

            return {
                TotalCount     : foundResults.count,
                RetrievedCount : dtos.length,
                PageIndex      : filters.PageIndex || 0,
                ItemsPerPage   : limit,
                Order          : order,
                OrderedBy      : orderByColumn,
                Items          : dtos,
            };
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    update = async (id: string, updateModel: VisitDomainModel): Promise<VisitDto> => {
        try {
            const visit = await VisitModel.findByPk(id);
            if (updateModel.VisitType != null) {
                visit.VisitType = updateModel.VisitType;
            }
            if (updateModel.EhrId != null) {
                visit.EhrId = updateModel.EhrId;
            }
            if (updateModel.DisplayId != null) {
                visit.DisplayId = updateModel.DisplayId;
            }
            if (updateModel.PatientUserId != null) {
                visit.PatientUserId = updateModel.PatientUserId;
            }
            if (updateModel.MedicalPractitionerUserId != null) {
                visit.MedicalPractitionerUserId = updateModel.MedicalPractitionerUserId;
            }
            if (updateModel.ReferenceVisitId != null) {
                visit.ReferenceVisitId = updateModel.ReferenceVisitId;
            }
            if (updateModel.CurrentState != null) {
                visit.CurrentState = updateModel.CurrentState;
            }
            if (updateModel.StartDate != null) {
                visit.StartDate = updateModel.StartDate;
            }
            if (updateModel.EndDate != null) {
                visit.EndDate = updateModel.EndDate;
            }
            if (updateModel.FulfilledAtOrganizationId != null) {
                visit.FulfilledAtOrganizationId = updateModel.FulfilledAtOrganizationId;
            }
            if (updateModel.AdditionalInformation != null) {
                visit.AdditionalInformation = updateModel.AdditionalInformation;
            }
            await visit.save();
            return VisitMapper.toDto(visit);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {
            const result = await VisitModel.destroy({ where: { id } });
            return result === 1;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
