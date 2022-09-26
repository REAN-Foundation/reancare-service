import express from 'express';
import { BloodCholesterolDomainModel } from '../../../../domain.types/clinical/biometrics/blood.cholesterol/blood.cholesterol.domain.model';
import { BloodCholesterolSearchFilters } from '../../../../domain.types/clinical/biometrics/blood.cholesterol/blood.cholesterol.search.types';
import { BaseValidator, Where } from '../../../base.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class BloodCholesterolValidator extends BaseValidator {

    constructor() {
        super();
    }

    getDomainModel = (request: express.Request): BloodCholesterolDomainModel => {

        const BloodCholesterolModel: BloodCholesterolDomainModel = {
            PatientUserId     : request.body.PatientUserId,
            TotalCholesterol  : request.body.TotalCholesterol,
            HDL               : request.body.HDL,
            LDL               : request.body.LDL,
            TriglycerideLevel : request.body.TriglycerideLevel,
            Ratio             : request.body.Ratio,
            A1CLevel          : request.body.A1CLevel,
            Unit              : request.body.Unit,
            RecordDate        : request.body.RecordDate ?? new Date(),
            RecordedByUserId  : request.body.RecordedByUserId ?? request.currentUser.UserId,
        };

        return BloodCholesterolModel;
    };

    create = async (request: express.Request): Promise<BloodCholesterolDomainModel> => {
        await this.validateCreateBody(request);
        return this.getDomainModel(request);
    };

    search = async (request: express.Request): Promise<BloodCholesterolSearchFilters> => {

        await this.validateUuid(request, 'patientUserId', Where.Query, false, false);
        await this.validateDecimal(request, 'minTotalCholesterol', Where.Query, false, false);
        await this.validateDecimal(request, 'maxTotalCholesterol', Where.Query, false, false);
        await this.validateDecimal(request, 'minRatio', Where.Query, false, false);
        await this.validateDecimal(request, 'maxRatio', Where.Query, false, false);
        await this.validateDecimal(request, 'minHDL', Where.Query, false, false);
        await this.validateDecimal(request, 'maxHDL', Where.Query, false, false);
        await this.validateDecimal(request, 'minLDL', Where.Query, false, false);
        await this.validateDecimal(request, 'maxLDL', Where.Query, false, false);
        await this.validateDecimal(request, 'minA1CLevel', Where.Query, false, false);
        await this.validateDecimal(request, 'maxA1CLevel', Where.Query, false, false);
        await this.validateDate(request, 'createdDateFrom', Where.Query, false, false);
        await this.validateDate(request, 'createdDateTo', Where.Query, false, false);
        await this.validateUuid(request, 'recordedByUserId', Where.Query, false, false);

        await this.validateBaseSearchFilters(request);

        this.validateRequest(request);

        return this.getFilter(request);
    };

    update = async (request: express.Request): Promise<BloodCholesterolDomainModel> => {

        await this.validateUpdateBody(request);
        const domainModel = this.getDomainModel(request);
        domainModel.id = await this.getParamUuid(request, 'id');
        return domainModel;
    };

    private  async validateCreateBody(request) {

        await this.validateUuid(request, 'PatientUserId', Where.Body, true, false);
        await this.validateDecimal(request, 'TotalCholesterol', Where.Body, false, true);
        await this.validateDecimal(request, 'HDL', Where.Body, false, true);
        await this.validateDecimal(request, 'LDL', Where.Body, false, true);
        await this.validateDecimal(request, 'TriglycerideLevel', Where.Body, false, true);
        await this.validateDecimal(request, 'Ratio', Where.Body, false, true);
        await this.validateDecimal(request, 'A1CLevel', Where.Body, false, true);
        await this.validateString(request, 'Unit', Where.Body, false, true);
        await this.validateDate(request, 'RecordDate', Where.Body, false, true);
        await this.validateUuid(request, 'RecordedByUserId', Where.Body, false, true);

        this.validateRequest(request);
    }

    private  async validateUpdateBody(request) {

        await this.validateUuid(request, 'PatientUserId', Where.Body, false, false);
        await this.validateDecimal(request, 'TotalCholesterol', Where.Body, false, false);
        await this.validateDecimal(request, 'HDL', Where.Body, false, false);
        await this.validateDecimal(request, 'LDL', Where.Body, false, false);
        await this.validateDecimal(request, 'TriglycerideLevel', Where.Body, false, false);
        await this.validateDecimal(request, 'Ratio', Where.Body, false, false);
        await this.validateDecimal(request, 'A1CLevel', Where.Body, false, false);
        await this.validateString(request, 'Unit', Where.Body, false, false);
        await this.validateDate(request, 'RecordDate', Where.Body, false, false);
        await this.validateUuid(request, 'RecordedByUserId', Where.Body, false, false);

        this.validateRequest(request);
    }

    private getFilter(request): BloodCholesterolSearchFilters {

        var filters: BloodCholesterolSearchFilters = {
            PatientUserId       : request.query.patientUserId ?? null,
            MinTotalCholesterol : request.query.minTotalCholesterol ?? null,
            MaxTotalCholesterol : request.query.maxTotalCholesterol ?? null,
            MinRatio            : request.query.minRatio ?? null,
            MaxRatio            : request.query.maxRatio ?? null,
            MinHDL              : request.query.minHDL ?? null,
            MaxHDL              : request.query.maxHDL ?? null,
            MinLDL              : request.query.minLDL ?? null,
            MaxLDL              : request.query.maxLDL ?? null,
            MinA1CLevel         : request.query.minA1CLevel ?? null,
            MaxA1CLevel         : request.query.maxA1CLevel ?? null,
            CreatedDateFrom     : request.query.createdDateFrom ?? null,
            CreatedDateTo       : request.query.createdDateTo ?? null,
            RecordedByUserId    : request.query.recordedByUserId ?? null,

        };

        return this.updateBaseSearchFilters(request, filters);
    }

}
