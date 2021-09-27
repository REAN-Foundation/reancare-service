import express from 'express';
import { body, param, validationResult, query } from 'express-validator';
import { ClinicalInterpretation, ClinicalValidationStatus } from '../../../../domain.types/miscellaneous/clinical.types';
import { Helper } from '../../../../common/helper';
import { SymptomDomainModel } from '../../../../domain.types/clinical/symptom/symptom/symptom.domain.model';
import { SymptomSearchFilters } from '../../../../domain.types/clinical/symptom/symptom/symptom.search.types';
import { Severity } from '../../../../domain.types/miscellaneous/system.types';
import { SymptomTypeService } from '../../../../services/clinical/symptom/symptom.type.service';
import { SymptomAssessmentService } from '../../../../services/clinical/symptom/symptom.assessment.service';
import { Loader } from '../../../../startup/loader';

///////////////////////////////////////////////////////////////////////////////////////

export class SymptomValidator {

    static getDomainModel = async (request: express.Request, create = true): Promise<SymptomDomainModel> => {

        if (create) {
            var symptomTypeName = null;
            var symptomTypeService = Loader.container.resolve(SymptomTypeService);
            var symptomType = await symptomTypeService.getById(request.body.SymptomTypeId);
            if (symptomType !== null) {
                symptomTypeName = symptomType.Symptom;
            }
    
            var templateId = null;
            if (request.body.AssessmentId !== undefined) {
                var symptomAssessmentService = Loader.container.resolve(SymptomAssessmentService);
                var assessment = await symptomAssessmentService.getById(request.body.AssessmentId);
                if (assessment !== null) {
                    templateId = assessment.AssessmentTemplateId;
                }
            }
        }

        const model: SymptomDomainModel = {
            id                        : request.body.id ?? null,
            PatientUserId             : request.body.PatientUserId ?? null,
            MedicalPractitionerUserId : request.body.MedicalPractitionerUserId ?? null,
            VisitId                   : request.body.VisitId,
            AssessmentId              : request.body.AssessmentId ?? null,
            AssessmentTemplateId      : request.body.AssessmentTemplateId ?? templateId,
            SymptomTypeId             : request.body.SymptomTypeId ?? null,
            Symptom                   : request.body.Symptom ?? symptomTypeName,
            IsPresent                 : request.body.IsPresent ?? true,
            Severity                  : request.body.Severity ?? Severity.Unknown,
            ValidationStatus          : request.body.ValidationStatus ?? ClinicalValidationStatus.Preliminary,
            Interpretation            : request.body.Interpretation ?? ClinicalInterpretation.Normal,
            Comments                  : request.body.Comments ?? null,
            RecordDate                : request.body.RecordDate ?? new Date(),
        };

        return model;
    };

    static create = async (request: express.Request): Promise<SymptomDomainModel> => {

        await body('PatientUserId').exists()
            .trim()
            .isUUID()
            .run(request);

        await body('SymptomTypeId').exists()
            .trim()
            .isUUID()
            .run(request);

        await SymptomValidator.validateBody(request);

        return await SymptomValidator.getDomainModel(request);
    };

    static getById = async (request: express.Request): Promise<string> => {
        return await SymptomValidator.getParamId(request);
    };
    
    static delete = async (request: express.Request): Promise<string> => {
        return await SymptomValidator.getParamId(request);
    };

    static search = async (request: express.Request): Promise<SymptomSearchFilters> => {

        await query('patientUserId').optional()
            .trim()
            .isUUID()
            .run(request);

        await query('visitId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await query('assessmentId').optional()
            .trim()
            .isUUID()
            .run(request);

        await query('assessmentTemplateId').optional()
            .trim()
            .isUUID()
            .run(request);

        await query('dateFrom').optional()
            .trim()
            .escape()
            .toDate()
            .run(request);

        await query('dateTo').optional()
            .trim()
            .escape()
            .toDate()
            .run(request);

        await query('orderBy').optional()
            .trim()
            .escape()
            .run(request);

        await query('order').optional()
            .trim()
            .escape()
            .run(request);

        await query('pageIndex').optional()
            .trim()
            .escape()
            .isInt()
            .run(request);

        await query('itemsPerPage').optional()
            .trim()
            .escape()
            .isInt()
            .run(request);

        const result = validationResult(request);

        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }

        return SymptomValidator.getFilter(request);
    };

    static update = async (request: express.Request): Promise<SymptomDomainModel> => {

        await body('PatientUserId').optional()
            .trim()
            .isUUID()
            .run(request);

        await body('SymptomTypeId').optional()
            .trim()
            .isUUID()
            .run(request);

        await SymptomValidator.validateBody(request);

        const id = await SymptomValidator.getParamId(request);
        const domainModel = await SymptomValidator.getDomainModel(request, false);
        domainModel.id = id;

        return domainModel;
    };

    private static async validateBody(request) {

        await body('MedicalPractitionerUserId').optional()
            .trim()
            .isUUID()
            .run(request);

        await body('VisitId').optional()
            .trim()
            .isUUID()
            .run(request);

        await body('AssessmentId').optional()
            .trim()
            .isUUID()
            .run(request);

        await body('AssessmentTemplateId').optional()
            .trim()
            .isUUID()
            .run(request);

        await body('Symptom').optional()
            .trim()
            .run(request);

        await body('IsPresent').optional()
            .trim()
            .isBoolean()
            .run(request);

        await body('Severity').optional()
            .trim()
            .run(request);

        await body('ValidationStatus').optional()
            .trim()
            .run(request);

        await body('Interpretation').optional()
            .trim()
            .run(request);

        await body('Comments').optional()
            .trim()
            .run(request);

        await body('RecordDate').optional()
            .trim()
            .isDate()
            .run(request);

        const result = validationResult(request);

        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }
    }

    private static getFilter(request): SymptomSearchFilters {

        const pageIndex = request.query.pageIndex !== 'undefined' ?
            parseInt(request.query.pageIndex as string, 10) : 0;

        const itemsPerPage = request.query.itemsPerPage !== 'undefined' ?
            parseInt(request.query.itemsPerPage as string, 10) : 25;

        const filters: SymptomSearchFilters = {
            Symptom              : request.query.symptom ?? null,
            SymptomTypeId        : request.query.symptomTypeId ?? null,
            PatientUserId        : request.query.patientUserId ?? null,
            AssessmentId         : request.query.assessmentId ?? null,
            AssessmentTemplateId : request.query.assessmentTemplateId ?? null,
            VisitId              : request.query.visitId ?? null,
            DateFrom             : request.query.dateFrom ?? null,
            DateTo               : request.query.dateTo ?? null,
            OrderBy              : request.query.orderBy ?? 'CreatedAt',
            Order                : request.query.order ?? 'descending',
            PageIndex            : pageIndex,
            ItemsPerPage         : itemsPerPage,
        };
        return filters;
    }

    private static async getParamId(request) {

        await param('id').trim()
            .escape()
            .isUUID()
            .run(request);

        const result = validationResult(request);

        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }
        return request.params.id;
    }

}
