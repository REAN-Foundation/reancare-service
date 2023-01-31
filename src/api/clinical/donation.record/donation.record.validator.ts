import express from 'express';
import { DonationRecordSearchFilters } from '../../../domain.types/clinical/donation.record/donation.record.search.types';
import { DonationRecordDomainModel } from '../../../domain.types/clinical/donation.record/donation.record.domain.model';
import { BaseValidator, Where } from '../../base.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class DonationRecordValidator extends BaseValidator {

    constructor() {
        super();
    }

    getDomainModel = (request: express.Request): DonationRecordDomainModel => {

        const doctorNoteModel: DonationRecordDomainModel = {
            PatientUserId             : request.body.PatientUserId ?? null,
            NetworkId                 : request.body.NetworkId ?? null,
            EmergencyDonor            : request.body.EmergencyDonor ?? null,
            VolunteerOfEmergencyDonor : request.body.VolunteerOfEmergencyDonor ?? null,
            RequestedQuantity         : request.body.RequestedQuantity ?? null,
            RequestedDate             : request.body.RequestedDate ?? null,
            DonorAcceptedDate         : request.body.DonorAcceptedDate ?? null,
            DonorRejectedDate         : request.body.DonorRejectedDate ?? null,
            DonationDate              : request.body.DonationDate ?? null,
            DonatedQuantity           : request.body.DonatedQuantity ?? null,
            DonationType              : request.body.DonationType ?? null,
        };

        return doctorNoteModel;
    };

    create = async (request: express.Request): Promise<DonationRecordDomainModel> => {
        await this.validateCreateBody(request);
        return this.getDomainModel(request);
    };

    search = async (request: express.Request): Promise<DonationRecordSearchFilters> => {

        await this.validateUuid(request, 'patientUserId', Where.Query, false, false);
        await this.validateUuid(request, 'donorUserId', Where.Query, false, false);
        await this.validateUuid(request, 'volunteerUserId', Where.Query, false, false);
        await this.validateUuid(request, 'networkId', Where.Query, false, false);
        await this.validateUuid(request, 'emergencyDonor', Where.Query, false, false);
        await this.validateUuid(request, 'volunteerOfEmergencyDonor', Where.Query, false, false);
        await this.validateString(request, 'name', Where.Query, false, false);
        await this.validateString(request, 'bloodGroup', Where.Query, false, false);
        await this.validateString(request, 'status', Where.Query, false, false);
        await this.validateDate(request, 'requestedDateFrom', Where.Query, false, false);
        await this.validateDate(request, 'requestedDateTo', Where.Query, false, false);
        await this.validateDate(request, 'donationDateFrom', Where.Query, false, false);
        await this.validateDate(request, 'donationDateTo', Where.Query, false, false);

        await this.validateBaseSearchFilters(request);

        this.validateRequest(request);

        return this.getFilter(request);
    };

    update = async (request: express.Request): Promise<DonationRecordDomainModel> => {

        await this.validateUpdateBody(request);
        const domainModel = this.getDomainModel(request);
        domainModel.id = await this.getParamUuid(request, 'id');

        return domainModel;
    };

    private  async validateCreateBody(request) {

        await this.validateUuid(request, 'PatientUserId', Where.Body, false, false);
        await this.validateUuid(request, 'NetworkId', Where.Body, false, false);
        await this.validateUuid(request, 'EmergencyDonor', Where.Body, false, false);
        await this.validateUuid(request, 'VolunteerOfEmergencyDonor', Where.Body, false, false);
        await this.validateInt(request, 'RequestedQuantity', Where.Body, true, false);
        await this.validateDate(request, 'RequestedDate', Where.Body, false, false);
        await this.validateDate(request, 'DonationDate', Where.Body, false, false);
        await this.validateInt(request, 'DonatedQuantity', Where.Body, false, false);
        await this.validateString(request, 'DonationType', Where.Body, false, false);

        this.validateRequest(request);
    }

    private  async validateUpdateBody(request) {

        await this.validateUuid(request, 'PatientUserId', Where.Body, false, false);
        await this.validateUuid(request, 'NetworkId', Where.Body, false, false);
        await this.validateUuid(request, 'EmergencyDonor', Where.Body, false, false);
        await this.validateUuid(request, 'VolunteerOfEmergencyDonor', Where.Body, false, false);
        await this.validateInt(request, 'RequestedQuantity', Where.Body, false, false);
        await this.validateDate(request, 'RequestedDate', Where.Body, false, false);
        await this.validateDate(request, 'DonorAcceptedDate', Where.Body, false, false);
        await this.validateDate(request, 'DonorRejectedDate', Where.Body, false, false);
        await this.validateDate(request, 'DonationDate', Where.Body, false, false);
        await this.validateInt(request, 'DonatedQuantity', Where.Body, false, false);
        await this.validateString(request, 'DonationType', Where.Body, false, false);

        this.validateRequest(request);
    }

    private getFilter(request): DonationRecordSearchFilters {

        var filters: DonationRecordSearchFilters = {
            PatientUserId             : request.query.patientUserId ?? null,
            VolunteerUserId           : request.query.volunteerUserId ?? null,
            EmergencyDonor            : request.query.emergencyDonor ?? null,
            VolunteerOfEmergencyDonor : request.query.volunteerOfEmergencyDonor ?? null,
            NetworkId                 : request.query.networkId ?? null,
            BloodGroup                : request.query.bloodGroup ?? null,
            Name                      : request.query.name ?? null,
            Status                    : request.query.status ?? null,
            RequestedDateFrom         : request.query.requestedDateFrom ?? null,
            RequestedDateTo           : request.query.requestedDateTo ?? null,
            DonationDateFrom          : request.query.donationDateFrom ?? null,
            DonationDateTo            : request.query.donationDateTo ?? null,

        };
        return this.updateBaseSearchFilters(request, filters);
    }

}
