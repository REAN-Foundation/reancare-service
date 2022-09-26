import express from 'express';
import { BloodPressureDomainModel } from '../../../../domain.types/clinical/biometrics/blood.pressure/blood.pressure.domain.model';
import { BloodPressureSearchFilters } from '../../../../domain.types/clinical/biometrics/blood.pressure/blood.pressure.search.types';
import { BaseValidator, Where } from '../../../base.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class BloodPressureValidator extends BaseValidator {

    constructor() {
        super();
    }

    getDomainModel = (request: express.Request): BloodPressureDomainModel => {

        const BloodPressureModel: BloodPressureDomainModel = {
            PatientUserId    : request.body.PatientUserId,
            Systolic         : request.body.Systolic,
            Diastolic        : request.body.Diastolic,
            Unit             : request.body.Unit,
            RecordDate       : request.body.RecordDate ?? new Date(),
            RecordedByUserId : request.body.RecordedByUserId ?? request.currentUser.UserId,
        };

        return BloodPressureModel;
    };

    create = async (request: express.Request): Promise<BloodPressureDomainModel> => {
        await this.validateCreateBody(request);
        return this.getDomainModel(request);
    };

    search = async (request: express.Request): Promise<BloodPressureSearchFilters> => {

        await this.validateUuid(request, 'patientUserId', Where.Query, false, false);
        await this.validateInt(request, 'minSystolicValue', Where.Query, false, false);
        await this.validateInt(request, 'maxSystolicValue', Where.Query, false, false);
        await this.validateInt(request, 'minDiastolicValue', Where.Query, false, false);
        await this.validateInt(request, 'maxDiastolicValue', Where.Query, false, false);
        await this.validateDate(request, 'createdDateFrom', Where.Query, false, false);
        await this.validateDate(request, 'createdDateTo', Where.Query, false, false);
        await this.validateUuid(request, 'RecordedByUserId', Where.Query, false, false);

        await this.validateBaseSearchFilters(request);

        this.validateRequest(request);

        return this.getFilter(request);
    };

    update = async (request: express.Request): Promise<BloodPressureDomainModel> => {

        await this.validateUpdateBody(request);
        const domainModel = this.getDomainModel(request);
        domainModel.id = await this.getParamUuid(request, 'id');
        return domainModel;
    };

    private  async validateCreateBody(request) {

        await this.validateUuid(request, 'PatientUserId', Where.Body, true, false);
        await this.validateInt(request, 'Systolic', Where.Body, true, false);
        await this.validateInt(request, 'Diastolic', Where.Body, true, false);
        await this.validateString(request, 'Unit', Where.Body, false, true);
        await this.validateDate(request, 'RecordDate', Where.Body, false, false);
        await this.validateUuid(request, 'RecordedByUserId', Where.Body, false, true);

        this.validateRequest(request);
    }

    private  async validateUpdateBody(request) {

        await this.validateUuid(request, 'PatientUserId', Where.Body, false, false);
        await this.validateInt(request, 'Systolic', Where.Body, false, false);
        await this.validateInt(request, 'Diastolic', Where.Body, false, false);
        await this.validateString(request, 'Unit', Where.Body, false, false);
        await this.validateDate(request, 'RecordDate', Where.Body, false, false);
        await this.validateUuid(request, 'RecordedByUserId', Where.Body, false, false);

        this.validateRequest(request);
    }

    private getFilter(request): BloodPressureSearchFilters {

        var filters: BloodPressureSearchFilters = {
            PatientUserId     : request.query.patientUserId ?? null,
            MinSystolicValue  : request.query.minSystolicValue ?? null,
            MaxSystolicValue  : request.query.maxSystolicValue ?? null,
            MinDiastolicValue : request.query.minDiastolicValue ?? null,
            MaxDiastolicValue : request.query.maxDiastolicValue ?? null,
            CreatedDateFrom   : request.query.createdDateFrom ?? null,
            CreatedDateTo     : request.query.createdDateTo ?? null,
            RecordedByUserId  : request.query.recordedByUserId ?? null,

        };

        return this.updateBaseSearchFilters(request, filters);
    }

}
