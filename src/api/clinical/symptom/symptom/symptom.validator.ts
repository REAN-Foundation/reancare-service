import express from 'express';
import { SymptomDomainModel } from '../../../../domain.types/clinical/symptom/symptom/symptom.domain.model';
import { SymptomSearchFilters } from '../../../../domain.types/clinical/symptom/symptom/symptom.search.types';
import { ClinicalInterpretation, ClinicalValidationStatus } from '../../../../domain.types/miscellaneous/clinical.types';
import { Severity } from '../../../../domain.types/miscellaneous/system.types';
import { SymptomAssessmentService } from '../../../../services/clinical/symptom/symptom.assessment.service';
import { SymptomTypeService } from '../../../../services/clinical/symptom/symptom.type.service';
import { Loader } from '../../../../startup/loader';
import { BaseValidator, Where } from '../../../base.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class SymptomValidator extends BaseValidator {

    constructor() {
        super();
    }

    getDomainModel = async (request: express.Request, create = true): Promise<SymptomDomainModel> => {

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

    create = async (request: express.Request): Promise<SymptomDomainModel> => {

        await this.validateCreateBody(request);
        return this.getDomainModel(request);
    };

    search = async (request: express.Request): Promise<SymptomSearchFilters> => {

        await this.validateUuid(request, 'patientUserId', Where.Query, false, false);
        await this.validateUuid(request, 'visitId', Where.Query, false, false);
        await this.validateUuid(request, 'assessmentId', Where.Query, false, false);
        await this.validateUuid(request, 'assessmentTemplateId', Where.Query, false, false);
        await this.validateUuid(request, 'symptomTypeId', Where.Query, false, false);
        await this.validateString(request, 'symptom', Where.Query, false, false, true);
        await this.validateDate(request, 'dateFrom', Where.Query, false, false);
        await this.validateDate(request, 'dateTo', Where.Query, false, false);

        await this.validateBaseSearchFilters(request);

        this.validateRequest(request);

        return this.getFilter(request);
    };

    update = async (request: express.Request): Promise<SymptomDomainModel> => {

        await this.validateUpdateBody(request);
        const domainModel = await this.getDomainModel(request);
        domainModel.id = await this.getParamUuid(request, 'id');

        return domainModel;
    };

    private async validateCreateBody(request) {

        await this.validateUuid(request, 'PatientUserId', Where.Body, true, false);
        await this.validateUuid(request, 'MedicalPractitionerUserId', Where.Body, false, false);
        await this.validateUuid(request, 'VisitId', Where.Body, false, false);
        await this.validateUuid(request, 'EhrId', Where.Body, false, false);
        await this.validateUuid(request, 'AssessmentId', Where.Body, false, false);
        await this.validateUuid(request, 'AssessmentTemplateId', Where.Body, false, false);
        await this.validateUuid(request, 'SymptomTypeId', Where.Body, false, false);
        await this.validateBoolean(request, 'IsPresent', Where.Body, true, false);
        await this.validateString(request, 'Severity', Where.Body, true, false);
        await this.validateString(request, 'ValidationStatus', Where.Body, true, false);
        await this.validateString(request, 'Interpretation', Where.Body, false, false);
        await this.validateString(request, 'Comments', Where.Body, false, false);
        await this.validateDate(request, 'RecordDate', Where.Body, false, false);

        this.validateRequest(request);
    }

    private async validateUpdateBody(request) {

        await this.validateUuid(request, 'PatientUserId', Where.Body, false, false);
        await this.validateUuid(request, 'MedicalPractitionerUserId', Where.Body, false, false);
        await this.validateUuid(request, 'VisitId', Where.Body, false, false);
        await this.validateUuid(request, 'EhrId', Where.Body, false, false);
        await this.validateUuid(request, 'AssessmentId', Where.Body, false, false);
        await this.validateUuid(request, 'AssessmentTemplateId', Where.Body, false, false);
        await this.validateUuid(request, 'SymptomTypeId', Where.Body, false, false);
        await this.validateBoolean(request, 'IsPresent', Where.Body, false, false);
        await this.validateString(request, 'Severity', Where.Body, false, false);
        await this.validateString(request, 'ValidationStatus', Where.Body, false, false);
        await this.validateString(request, 'Interpretation', Where.Body, false, false);
        await this.validateString(request, 'Comments', Where.Body, false, false);
        await this.validateDate(request, 'RecordDate', Where.Body, false, false);

        this.validateRequest(request);
    }

    private getFilter(request): SymptomSearchFilters {

        var filters: SymptomSearchFilters = {
            Symptom              : request.query.symptom ?? null,
            SymptomTypeId        : request.query.symptomTypeId ?? null,
            PatientUserId        : request.query.patientUserId ?? null,
            AssessmentId         : request.query.assessmentId ?? null,
            AssessmentTemplateId : request.query.assessmentTemplateId ?? null,
            VisitId              : request.query.visitId ?? null,
            DateFrom             : request.query.dateFrom ?? null,
            DateTo               : request.query.dateTo ?? null,
        };
        return this.updateBaseSearchFilters(request, filters);
    }

}
