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

    create = async (createModel: DiagnosisDomainModel): Promise<DiagnosisDto> => {

        try {
            const entity = {
                PatientUserId             : createModel.PatientUserId,
                EhrId                     : createModel.EhrId,
                MedicalPractitionerUserId : createModel.MedicalPractitionerUserId,
                VisitId                   : createModel.VisitId,
                MedicalConditionId        : createModel.MedicalConditionId,
                Comments                  : createModel.Comments,
                IsClinicallyActive        : createModel.IsClinicallyActive,
                ValidationStatus          : createModel.ValidationStatus,
                Interpretation            : createModel.Interpretation,
                OnsetDate                 : createModel.OnsetDate,
                EndDate                   : createModel.EndDate
            };

            const diagnosis = await Diagnosis.create(entity);
            return await DiagnosisMapper.toDto(diagnosis);
            
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<DiagnosisDto> => {
        try {
            const diagnosis = await Diagnosis.findOne({ where: { id: id } });
            return await DiagnosisMapper.toDto(diagnosis);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    update = async (id: string, updateModel: DiagnosisDomainModel): Promise<DiagnosisDto> => {
        try {
            const diagnosis = await Diagnosis.findOne({ where: { id: id } });
            
            if (updateModel.PatientUserId != null) {
                diagnosis.PatientUserId = updateModel.PatientUserId;
            }
            if (updateModel.EhrId != null) {
                diagnosis.EhrId = updateModel.EhrId;
            }
            if (updateModel.MedicalPractitionerUserId != null) {
                diagnosis.MedicalPractitionerUserId = updateModel.MedicalPractitionerUserId;
            }
            if (updateModel.VisitId != null) {
                diagnosis.VisitId = updateModel.VisitId;
            }
            if (updateModel.MedicalConditionId != null) {
                diagnosis.MedicalConditionId = updateModel.MedicalConditionId;
            }
            if (updateModel.Comments != null) {
                diagnosis.Comments = updateModel.Comments;
            }
            if (updateModel.IsClinicallyActive != null) {
                diagnosis.IsClinicallyActive = updateModel.IsClinicallyActive;
            }
            if (updateModel.ValidationStatus != null) {
                diagnosis.ValidationStatus = updateModel.ValidationStatus;
            }
            if (updateModel.Interpretation != null) {
                diagnosis.Interpretation = updateModel.Interpretation;
            }
            if (updateModel.OnsetDate != null) {
                diagnosis.OnsetDate = updateModel.OnsetDate;
            }
            if (updateModel.EndDate != null) {
                diagnosis.EndDate = updateModel.EndDate;
            }

            await diagnosis.save();

            return await DiagnosisMapper.toDto(diagnosis);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: DiagnosisSearchFilters): Promise<DiagnosisSearchResults> => {
        try {

            const search: any = { where: {} };

            if (filters.Type != null) {
                search.where['Type'] = { [Op.like]: '%' + filters.Type + '%' };
            }
            if (filters.PatientUserId != null) {
                search.where['PatientUserId'] = filters.PatientUserId;
            }
            if (filters.MedicalPractitionerUserId != null) {
                search.where['MedicalPractitionerUserId'] = filters.MedicalPractitionerUserId;
            }
            if (filters.VisitId != null) {
                search.where['VisitId'] = filters.VisitId;
            }
            if (filters.MedicalConditionId != null) {
                search.where['MedicalConditionId'] = filters.MedicalConditionId;
            }
            if (filters.IsClinicallyActive != null) {
                search.where['IsClinicallyActive'] = { [Op.like]: '%' + filters.IsClinicallyActive + '%' };
            }
            if (filters.FulfilledByOrganizationId != null) {
                search.where['FulfilledByOrganizationId'] = filters.FulfilledByOrganizationId;
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
            const count = foundResults.count;
            const totalCount = typeof count === "number" ? count : count[0];

            const searchResults: DiagnosisSearchResults = {
                TotalCount     : totalCount,
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
            await Diagnosis.destroy({ where: { id: id } });
            return true;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
