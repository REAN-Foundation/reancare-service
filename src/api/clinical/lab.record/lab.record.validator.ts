import express from 'express';
import { LabRecordDomainModel } from '../../../domain.types/clinical/lab.record/lab.record/lab.record.domain.model';
import { LabRecordSearchFilters } from '../../../domain.types/clinical/lab.record/lab.record/lab.record.search.types';
import { BaseValidator, Where } from '../../base.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class LabRecordValidator extends BaseValidator {

    constructor() {
        super();
    }

    getDomainModel = (request: express.Request): LabRecordDomainModel => {

        const labRecordDomainModel: LabRecordDomainModel = {
            PatientUserId  : request.body.PatientUserId,
            TypeName       : request.body.TypeName,
            DisplayName    : request.body.DisplayName,
            PrimaryValue   : request.body.PrimaryValue,
            SecondaryValue : request.body.SecondaryValue,
            Unit           : request.body.Unit,
            ReportId       : request.body.ReportId,
            OrderId        : request.body.OrderId,
            RecordedAt     : request.body.RecordedAt ?? new Date()
        };

        return labRecordDomainModel;
    };

    create = async (request: express.Request): Promise<LabRecordDomainModel> => {
        await this.validateCreateBody(request);
        return this.getDomainModel(request);
    };

    search = async (request: express.Request): Promise<LabRecordSearchFilters> => {

        await this.validateUuid(request, 'patientUserId', Where.Query, false, false);
        await this.validateUuid(request, 'typeId', Where.Query, false, false);
        await this.validateString(request, 'typeName', Where.Query, false, false);
        await this.validateString(request, 'displayName', Where.Query, false, false);
        await this.validateDate(request, 'dateFrom', Where.Query, false, false);
        await this.validateDate(request, 'dateTo', Where.Query, false, false);

        await this.validateBaseSearchFilters(request);

        this.validateRequest(request);

        return this.getFilter(request);
    };

    update = async (request: express.Request): Promise<LabRecordDomainModel> => {

        await this.validateUpdateBody(request);
        const domainModel = this.getDomainModel(request);
        domainModel.id = await this.getParamUuid(request, 'id');

        return domainModel;
    };

    private async validateCreateBody(request) {

        await this.validateUuid(request, 'PatientUserId', Where.Body, true, false);
        await this.validateDecimal(request, 'PrimaryValue', Where.Body, true, false);
        await this.validateDecimal(request, 'SecondaryValue', Where.Body, false, false);
        await this.validateString(request, 'TypeName', Where.Body, false, true);
        await this.validateString(request, 'DisplayName', Where.Body, true, true);
        await this.validateString(request, 'Unit', Where.Body, false, true);
        await this.validateString(request, 'ReportId', Where.Body, false, true);
        await this.validateString(request, 'OrderId', Where.Body, false, true);
        await this.validateDate(request, 'RecordedAt', Where.Body, false, false);

        this.validateRequest(request);

    }

    private  async validateUpdateBody(request) {

        await this.validateUuid(request, 'PatientUserId', Where.Body, false, false);
        await this.validateDecimal(request, 'PrimaryValue', Where.Body, false, false);
        await this.validateDecimal(request, 'SecondaryValue', Where.Body, false, false);
        await this.validateString(request, 'TypeName', Where.Body, false, false);
        await this.validateString(request, 'DisplayName', Where.Body, false, false);
        await this.validateString(request, 'Unit', Where.Body, false, false);
        await this.validateString(request, 'ReportId', Where.Body, false, false);
        await this.validateString(request, 'OrderId', Where.Body, false, false);
        await this.validateDate(request, 'RecordedAt', Where.Body, false, false);

        this.validateRequest(request);
    }

    private getFilter(request): LabRecordSearchFilters {

        const filters: LabRecordSearchFilters = {
            PatientUserId : request.query.patientUserId ?? null,
            TypeId        : request.query.typeId ?? null,
            TypeName      : request.query.typeName ?? null,
            DisplayName   : request.query.displayName ?? null,
            DateFrom      : request.query.dateFrom ?? null,
            DateTo        : request.query.dateTo ?? null

        };
        return this.updateBaseSearchFilters(request, filters);
    }

}
