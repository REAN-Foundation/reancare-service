import { Op } from 'sequelize';
import { ApiError } from "../../../../../common/api.error";
import { Logger } from "../../../../../common/logger";
import { DiagnosisDomainModel } from '../../../../../domain.types/clinical/diagnosis/diagnosis.domain.model';
import { DiagnosisDto } from '../../../../../domain.types/clinical/diagnosis/diagnosis.dto';
import { DiagnosisSearchFilters, DiagnosisSearchResults } from '../../../../../domain.types/clinical/diagnosis/diagnosis.search.types';
import { IDiagnosisRepo } from "../../../../repository.interfaces/clinical/diagnosis.repo.interface";
import { DiagnosisMapper } from "../../mappers/clinical/diagnosis.mapper";
import Diagnosis from "../../models/clinical/diagnosis.model";

///////////////////////////////////////////////////////////////////////////////////

export class DiagnosisRepo implements IDiagnosisRepo {

    create = async (diagnosisDomainModel: DiagnosisDomainModel): Promise<DiagnosisDto> => {

        try {
            const entity = {
                PatientUserId             : diagnosisDomainModel.PatientUserId,
                EhrId                     : diagnosisDomainModel.EhrId,
                MedicalPractitionerUserId : diagnosisDomainModel.MedicalPractitionerUserId,
                VisitId                   : diagnosisDomainModel.VisitId,
                MedicalConditionId        : diagnosisDomainModel.MedicalConditionId,
                Comments                  : diagnosisDomainModel.Comments,
                IsClinicallyActive        : diagnosisDomainModel.IsClinicallyActive,
                ValidationStatus          : diagnosisDomainModel.ValidationStatus,
                Interpretation            : diagnosisDomainModel.Interpretation,
                OnsetDate                 : diagnosisDomainModel.OnsetDate,
                EndDate                   : diagnosisDomainModel.EndDate
            };

            const diagnosis = await Diagnosis.create(entity);
            const dto = await DiagnosisMapper.toDto(diagnosis);

            return dto;
            
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<DiagnosisDto> => {
        try {
            const diagnosis = await Diagnosis.findOne({ where: { id: id } });
            const dto = await DiagnosisMapper.toDto(diagnosis);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    update = async (id: string, model: DiagnosisDomainModel): Promise<DiagnosisDto> => {
        try {
            const diagnosis = await Diagnosis.findOne({ where: { id: id } });
            
            if (model.PatientUserId != null) {
                diagnosis.PatientUserId = model.PatientUserId;
            }
            if (model.EhrId != null) {
                diagnosis.EhrId = model.EhrId;
            }
            if (model.MedicalPractitionerUserId != null) {
                diagnosis.MedicalPractitionerUserId = model.MedicalPractitionerUserId;
            }
            if (model.VisitId != null) {
                diagnosis.VisitId = model.VisitId;
            }
            if (model.MedicalConditionId != null) {
                diagnosis.MedicalConditionId = model.MedicalConditionId;
            }
            if (model.Comments != null) {
                diagnosis.Comments = model.Comments;
            }
            if (model.IsClinicallyActive != null) {
                diagnosis.IsClinicallyActive = model.IsClinicallyActive;
            }
            if (model.ValidationStatus != null) {
                diagnosis.ValidationStatus = model.ValidationStatus;
            }
            if (model.Interpretation != null) {
                diagnosis.Interpretation = model.Interpretation;
            }
            if (model.OnsetDate != null) {
                diagnosis.OnsetDate = model.OnsetDate;
            }
            if (model.EndDate != null) {
                diagnosis.EndDate = model.EndDate;
            }

            await diagnosis.save();

            const dto = await DiagnosisMapper.toDto(diagnosis);

            return dto;

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    }

    search = async (filters: DiagnosisSearchFilters): Promise<DiagnosisSearchResults> => {
        try {

            const search: any = { where: {} };

            if (filters.Type != null) {
                search.where['Type'] = { [Op.like]: '%' + filters.Type + '%' };
            }
            if (filters.PatientUserId != null) {
                search.where['PatientUserId'] = { [Op.like]: '%' + filters.PatientUserId + '%' };
            }
            if (filters.MedicalPractitionerUserId != null) {
                search.where['MedicalPractitionerUserId'] = filters.MedicalPractitionerUserId;
            }
            if (filters.VisitId != null) {
                search.where['VisitId'] = { [Op.like]: '%' + filters.VisitId + '%' };
            }
            if (filters.MedicalConditionId != null) {
                search.where['MedicalConditionId'] = { [Op.like]: '%' + filters.MedicalConditionId + '%' };
            }
            if (filters.IsClinicallyActive != null) {
                search.where['IsClinicallyActive'] = { [Op.like]: '%' + filters.IsClinicallyActive + '%' };
            }
            if (filters.FulfilledByOrganizationId != null) {
                search.where['FulfilledByOrganizationId'] = { [Op.like]: '%' + filters.FulfilledByOrganizationId + '%' };
            }
            if (filters.ValidationStatus != null) {
                search.where['ValidationStatus'] = { [Op.like]: '%' + filters.ValidationStatus + '%' };
            }
            if (filters.Interpretation != null) {
                search.where['Interpretation'] = { [Op.like]: '%' + filters.Interpretation + '%' };
            }

            if (filters.OnsetDateFrom != null && filters.OnsetDateTo != null) {
                search.where['CreatedAt'] = {
                    [Op.gte] : filters.OnsetDateFrom,
                    [Op.lte] : filters.OnsetDateTo,
                };
            }
            else if (filters.OnsetDateFrom == null && filters.OnsetDateTo != null) {
                search.where['CreatedAt'] = {
                    [Op.lte] : filters.OnsetDateTo,
                };
            }
            else if (filters.OnsetDateFrom != null && filters.OnsetDateTo == null) {
                search.where['CreatedAt'] = {
                    [Op.gte] : filters.OnsetDateFrom,
                };
            }

            //Reference: https://sequelize.org/v5/manual/querying.html#ordering
            const orderByColum = 'CreatedAt';
            let order = 'ASC';
            if (filters.Order === 'descending') {
                order = 'DESC';
            }
            search['order'] = [[orderByColum, order]];
            if (filters.OrderBy) {
                const personAttributes = ['FirstName', 'LastName', 'BirthDate', 'Gender', 'Phone', 'Email'];
                const isPersonColumn = personAttributes.includes(filters.OrderBy);
                if (isPersonColumn) {
                    search['order'] = [[ 'Person', filters.OrderBy, order]];
                }
            }

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

            const foundResults = await Diagnosis.findAndCountAll(search);
            
            const dtos: DiagnosisDto[] = [];
            for (const diagnosis of foundResults.rows) {
                const dto = await DiagnosisMapper.toDto(diagnosis);
                dtos.push(dto);
            }

            const searchResults: DiagnosisSearchResults = {
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
    }

    delete = async (id: string): Promise<boolean> => {
        try {
            await Diagnosis.destroy({ where: { id: id } });
            return true;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    }

}
