import { ISymptomRepo } from '../../../../../repository.interfaces/clinical/symptom/symptom.repo.interface';
import Symptom from '../../../models/clinical/symptom/symptom.model';
import { Op } from 'sequelize';
import { SymptomMapper } from '../../../mappers/clinical/symptom/symptom.mapper';
import { Logger } from '../../../../../../common/logger';
import { ApiError } from '../../../../../../common/api.error';
import { SymptomDomainModel } from '../../../../../../domain.types/clinical/symptom/symptom/symptom.domain.model';
import { SymptomDto } from '../../../../../../domain.types/clinical/symptom/symptom/symptom.dto';
import { SymptomSearchFilters, SymptomSearchResults } from '../../../../../../domain.types/clinical/symptom/symptom/symptom.search.types';
import { Severity, uuid } from '../../../../../../domain.types/miscellaneous/system.types';
import { ClinicalValidationStatus } from '../../../../../../domain.types/miscellaneous/clinical.types';
import { ClinicalInterpretation } from '../../../../../../domain.types/miscellaneous/clinical.types';
import { TimeHelper } from '../../../../../../common/time.helper';
import { DurationType } from '../../../../../../domain.types/miscellaneous/time.types';

///////////////////////////////////////////////////////////////////////

export class SymptomRepo implements ISymptomRepo {

    create = async (model: SymptomDomainModel): Promise<SymptomDto> => {
        try {
            const entity = {
                PatientUserId             : model.PatientUserId,
                MedicalPractitionerUserId : model.MedicalPractitionerUserId ?? null,
                VisitId                   : model.VisitId ?? null,
                AssessmentId              : model.AssessmentId ?? null,
                AssessmentTemplateId      : model.AssessmentTemplateId ?? null,
                SymptomTypeId             : model.SymptomTypeId,
                Symptom                   : model.Symptom ?? null,
                Severity                  : model.Severity ?? Severity.Low,
                ValidationStatus          : model.ValidationStatus ?? ClinicalValidationStatus.Preliminary,
                Interpretation            : model.Interpretation ?? ClinicalInterpretation.Normal,
                Comments                  : model.Comments ?? null,
                RecordDate                : model.RecordDate ?? null,
            };
            const symptom = await Symptom.create(entity);
            return await SymptomMapper.toDto(symptom);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<SymptomDto> => {
        try {
            const symptom = await Symptom.findByPk(id);
            return await SymptomMapper.toDto(symptom);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: SymptomSearchFilters): Promise<SymptomSearchResults> => {
        try {
            const search = { where: {} };

            if (filters.Symptom != null) {
                search.where['Symptom'] = { [Op.like]: '%' + filters.Symptom + '%' };
            }
            if (filters.SymptomTypeId != null) {
                search.where['SymptomTypeId'] = filters.SymptomTypeId;
            }
            if (filters.PatientUserId != null) {
                search.where['PatientUserId'] = filters.PatientUserId;
            }
            if (filters.AssessmentId != null) {
                search.where['AssessmentId'] = filters.AssessmentId;
            }
            if (filters.AssessmentTemplateId != null) {
                search.where['AssessmentTemplateId'] = filters.AssessmentTemplateId;
            }
            if (filters.VisitId != null) {
                search.where['VisitId'] = filters.VisitId;
            }
            if (filters.DateFrom != null && filters.DateTo != null) {
                search.where['CreatedAt'] = {
                    [Op.gte] : filters.DateFrom,
                    [Op.lte] : filters.DateTo,
                };
            } else if (filters.DateFrom === null && filters.DateTo !== null) {
                search.where['CreatedAt'] = {
                    [Op.lte] : filters.DateTo,
                };
            } else if (filters.DateFrom !== null && filters.DateTo === null) {
                search.where['CreatedAt'] = {
                    [Op.gte] : filters.DateFrom,
                };
            }
            let orderByColum = 'Symptom';
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

            const foundResults = await Symptom.findAndCountAll(search);

            const dtos: SymptomDto[] = foundResults.rows.map(x => SymptomMapper.toDto(x));

            const searchResults: SymptomSearchResults = {
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

    update = async (id: string, updateModel: SymptomDomainModel): Promise<SymptomDto> => {
        try {
            const symptom = await Symptom.findByPk(id);

            // eslint-disable-next-line max-len
            symptom.MedicalPractitionerUserId = updateModel.MedicalPractitionerUserId ?? symptom.MedicalPractitionerUserId,
            symptom.VisitId                   = updateModel.VisitId ?? symptom.VisitId,
            symptom.AssessmentId              = updateModel.AssessmentId ?? symptom.AssessmentId,
            symptom.AssessmentTemplateId      = updateModel.AssessmentTemplateId ?? symptom.AssessmentTemplateId,
            symptom.Symptom                   = updateModel.Symptom ?? symptom.Symptom,
            symptom.Severity                  = updateModel.Severity ?? symptom.Severity,
            symptom.ValidationStatus          = updateModel.ValidationStatus ?? symptom.ValidationStatus,
            symptom.Interpretation            = updateModel.Interpretation ?? symptom.Interpretation,
            symptom.Comments                  = updateModel.Comments ?? symptom.Comments,
            symptom.RecordDate                = updateModel.RecordDate ?? symptom.RecordDate,

            await symptom.save();
            return await SymptomMapper.toDto(symptom);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {
            await Symptom.destroy({ where: { id: id } });
            return true;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getStats = async (patientUserId: uuid, numMonths: number): Promise<any> => {
        try {
            const records = await this.getRecords(patientUserId, numMonths);
            return records.map(x => {
                const dayStr = x.RecordDate.toISOString()
                    .split('T')[0];
                return {
                    Symptom          : x.Symptom,
                    Severity         : x.Severity,
                    ValidationStatus : x.ValidationStatus,
                    Interpretation   : x.Interpretation,
                    DayStr           : dayStr,
                };
            });
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    private async getRecords(patientUserId: string, months: number) {
        const today = new Date();
        const from = TimeHelper.subtractDuration(new Date(), months, DurationType.Month);
        const result = await Symptom.findAll({
            where : {
                PatientUserId : patientUserId,
                CreatedAt     : {
                    [Op.gte] : from,
                    [Op.lte] : today,
                }
            }
        });
        let records = result.map(x => {
            return {
                Symptom          : x.Symptom,
                Severity         : x.Severity,
                ValidationStatus : x.ValidationStatus,
                Interpretation   : x.Interpretation,
                RecordDate       : x.RecordDate,
            };
        });
        records = records.sort((a, b) => b.RecordDate.getTime() - a.RecordDate.getTime());
        return records;
    }

}
