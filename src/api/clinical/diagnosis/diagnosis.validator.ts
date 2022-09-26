import express from 'express';
import { DiagnosisDomainModel } from '../../../domain.types/clinical/diagnosis/diagnosis.domain.model';
import { DiagnosisSearchFilters } from '../../../domain.types/clinical/diagnosis/diagnosis.search.types';
import { BaseValidator, Where } from '../../base.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class DiagnosisValidator extends BaseValidator {

    getDomainModel = (request: express.Request): DiagnosisDomainModel => {

        const diagnosisDomainModel: DiagnosisDomainModel = {

            PatientUserId             : request.body.PatientUserId ?? null,
            EhrId                     : request.body.EhrId ?? null,
            MedicalPractitionerUserId : request.body.MedicalPractitionerUserId ?? null,
            VisitId                   : request.body.VisitId ?? null,
            MedicalConditionId        : request.body.MedicalConditionId ?? null,
            Comments                  : request.body.Comments ?? null,
            IsClinicallyActive        : request.body.IsClinicallyActive ?? null,
            ValidationStatus          : request.body.ValidationStatus ?? null,
            Interpretation            : request.body.Interpretation ?? null,
            OnsetDate                 : request.body.OnsetDate,
            EndDate                   : request.body.EndDate,
        };

        return diagnosisDomainModel;
    };

    create = async (
        request: express.Request
    ): Promise<DiagnosisDomainModel> => {
        await this.validateCreateBody(request);
        return this.getDomainModel(request);
    };

    search = async (
        request: express.Request
    ): Promise<DiagnosisSearchFilters> => {

        await this.validateUuid(request, 'patientUserId', Where.Query, false, false);
        await this.validateUuid(request, 'medicalPractitionerUserId', Where.Query, false, false);
        await this.validateUuid(request, 'visitId', Where.Query, false, false);
        await this.validateUuid(request, 'medicalConditionId', Where.Query, false, false);
        await this.validateUuid(request, 'fulfilledByOrganizationId', Where.Query, false, false);
        await this.validateBoolean(request, 'isClinicallyActive', Where.Query, false, false);
        await this.validateString(request, 'validationStatus', Where.Query, false, false, true);
        await this.validateString(request, 'interpretation', Where.Query, false, false, true);
        await this.validateString(request, 'type', Where.Query, false, false, true);
        await this.validateDate(request, 'onSetDateFrom', Where.Query, false, false);
        await this.validateDate(request, 'onSetDateTo', Where.Query, false, false);

        await this.validateBaseSearchFilters(request);

        this.validateRequest(request);

        return this.getFilter(request);

    };

    update = async (request: express.Request): Promise<DiagnosisDomainModel> => {

        await this.validateUpdateBody(request);

        const domainModel = this.getDomainModel(request);
        domainModel.id = await this.getParamUuid(request, 'id');

        return domainModel;
    };

    private async validateCreateBody(request) {

        await this.validateUuid(request, 'PatientUserId', Where.Body, true, false);
        await this.validateUuid(request, 'MedicalPractitionerUserId', Where.Body, false, true);
        await this.validateUuid(request, 'VisitId', Where.Body, false, true);
        await this.validateUuid(request, 'MedicalConditionId', Where.Body, false, true);
        await this.validateString(request, 'Comments', Where.Body, true, false);
        await this.validateString(request, 'ValidationStatus', Where.Body, true, false);
        await this.validateString(request, 'Interpretation', Where.Body, true, false);
        await this.validateBoolean(request, 'IsClinicallyActive', Where.Body, false, true);
        await this.validateDate(request, 'OnsetDate', Where.Body, true, false);
        await this.validateDate(request, 'EndDate', Where.Body, true, false);

        this.validateRequest(request);

    }

    private  async validateUpdateBody(request) {

        await this.validateUuid(request, 'PatientUserId', Where.Body, false, false);
        await this.validateUuid(request, 'EhrId', Where.Body, false, false);
        await this.validateUuid(request, 'MedicalPractitionerUserId', Where.Body, false, false);
        await this.validateUuid(request, 'VisitId', Where.Body, false, false);
        await this.validateUuid(request, 'MedicalConditionId', Where.Body, false, false);
        await this.validateString(request, 'Comments', Where.Body, false, false);
        await this.validateString(request, 'ValidationStatus', Where.Body, false, false);
        await this.validateString(request, 'Interpretation', Where.Body, false, false);
        await this.validateBoolean(request, 'IsClinicallyActive', Where.Body, false, true);
        await this.validateDate(request, 'OnsetDate', Where.Body, false, false);
        await this.validateDate(request, 'EndDate', Where.Body, false, false);

        this.validateRequest(request);
    }

    private getFilter(request): DiagnosisSearchFilters {

        var filters: DiagnosisSearchFilters = {
            Type                      : request.query.type ?? null,
            PatientUserId             : request.query.patientUserId ?? null,
            MedicalPractitionerUserId : request.query.medicalPractitionerUserId ?? null,
            VisitId                   : request.query.visitId ?? null,
            MedicalConditionId        : request.query.medicalConditionId ?? null,
            IsClinicallyActive        : request.query.isClinicallyActive ?? null,
            FulfilledByOrganizationId : request.query.fulfilledByOrganizationId ?? null,
            ValidationStatus          : request.query.validationStatus ?? null,
            Interpretation            : request.query.interpretation ?? null,
            OnsetDateFrom             : request.query.onsetDateFrom ?? null,
            OnsetDateTo               : request.query.onsetDateTo ?? null,
        };

        return this.updateBaseSearchFilters(request, filters);
    }

}
