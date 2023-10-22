import express from 'express';
import { BridgeDomainModel } from '../../../../domain.types/assorted/blood.donation/bridge/bridge.domain.model';
import { BridgeSearchFilters } from '../../../../domain.types/assorted/blood.donation/bridge/bridge.search.types';
import { BaseValidator, Where } from '../../../base.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class BridgeValidator extends BaseValidator {

    constructor() {
        super();
    }

    getDomainModel = (request: express.Request): BridgeDomainModel => {

        const model: BridgeDomainModel = {
            Name             : request.body.Name ?? null,
            PatientUserId    : request.body.PatientUserId ?? null,
            DonorUserId      : request.body.DonorUserId ?? null,
            DonorType        : request.body.DonorType ?? null,
            VolunteerUserId  : request.body.VolunteerUserId ?? null,
            BloodGroup       : request.body.BloodGroup ?? null,
            NextDonationDate : request.body.NextDonationDate ?? null,
            LastDonationDate : request.body.LastDonationDate ?? null,
            QuantityRequired : request.body.QuantityRequired ?? null,
            Status           : request.body.Status ?? null,
        };

        return model;
    };

    create = async (request: express.Request): Promise<BridgeDomainModel> => {
        await this.validateCreateBody(request);
        return this.getDomainModel(request);
    };

    search = async (request: express.Request): Promise<BridgeSearchFilters> => {

        await this.validateUuid(request, 'patientUserId', Where.Query, false, false);
        await this.validateUuid(request, 'donorUserId', Where.Query, false, false);
        await this.validateUuid(request, 'volunteerUserId', Where.Query, false, false);
        await this.validateString(request, 'name', Where.Query, false, false);
        await this.validateString(request, 'bloodGroup', Where.Query, false, false);
        await this.validateString(request, 'status', Where.Query, false, false);
        await this.validateDate(request, 'nextDonationDateFrom', Where.Query, false, false);
        await this.validateDate(request, 'nextDonationDateTo', Where.Query, false, false);
        await this.validateBoolean(request, 'onlyElligible', Where.Query, false, false);

        await this.validateBaseSearchFilters(request);

        this.validateRequest(request);

        return this.getFilter(request);
    };

    update = async (request: express.Request): Promise<BridgeDomainModel> => {

        await this.validateUpdateBody(request);
        const domainModel = this.getDomainModel(request);
        domainModel.id = await this.getParamUuid(request, 'id');

        return domainModel;
    };

    private  async validateCreateBody(request) {

        await this.validateUuid(request, 'PatientUserId', Where.Body, true, false);
        await this.validateUuid(request, 'DonorUserId', Where.Body, true, false);
        await this.validateUuid(request, 'VolunteerUserId', Where.Body, true, false);
        await this.validateString(request, 'Name', Where.Body, false, false);
        await this.validateString(request, 'BloodGroup', Where.Body, false, false);
        await this.validateString(request, 'DonorType', Where.Body, false, false);
        await this.validateDate(request, 'NextDonationDate', Where.Body, false, false);
        await this.validateDate(request, 'LastDonationDate', Where.Body, false, true);
        await this.validateInt(request, 'QuantityRequired', Where.Body, false, false);
        await this.validateString(request, 'Status', Where.Body, false, false);

        this.validateRequest(request);
    }

    private  async validateUpdateBody(request) {

        await this.validateUuid(request, 'PatientUserId', Where.Body, false, false);
        await this.validateUuid(request, 'DonorUserId', Where.Body, false, false);
        await this.validateUuid(request, 'VolunteerUserId', Where.Body, false, false);
        await this.validateString(request, 'Name', Where.Body, false, false);
        await this.validateString(request, 'BloodGroup', Where.Body, false, false);
        await this.validateString(request, 'DonorType', Where.Body, false, false);
        await this.validateDate(request, 'NextDonationDate', Where.Body, false, false);
        await this.validateDate(request, 'LastDonationDate', Where.Body, false, true);
        await this.validateInt(request, 'QuantityRequired', Where.Body, false, false);
        await this.validateString(request, 'Status', Where.Body, false, false);

        this.validateRequest(request);
    }

    private getFilter(request): BridgeSearchFilters {

        var filters: BridgeSearchFilters = {
            PatientUserId        : request.query.patientUserId ?? null,
            DonorUserId          : request.query.donorUserId ?? null,
            VolunteerUserId      : request.query.volunteerUserId ?? null,
            Name                 : request.query.name ?? null,
            BloodGroup           : request.query.bloodGroup ?? null,
            Status               : request.query.status ?? null,
            NextDonationDateFrom : request.query.nextDonationDateFrom ?? null,
            NextDonationDateTo   : request.query.nextDonationDateTo ?? null,
            OnlyElligible        : request.query.onlyElligible ?? null,

        };
        return this.updateBaseSearchFilters(request, filters);
    }

}
