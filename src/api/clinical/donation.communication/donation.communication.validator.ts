import express from 'express';
import { BaseValidator, Where } from '../../base.validator';
import { DonationCommunicationDomainModel } from '../../../domain.types/clinical/donation.communication/donation.communication.domain.model';
import { DonationCommunicationSearchFilters } from '../../../domain.types/clinical/donation.communication/donation.communication.search.types';

///////////////////////////////////////////////////////////////////////////////////////

export class DonationCommunicationValidator extends BaseValidator {

    constructor() {
        super();
    }

    getDomainModel = (request: express.Request): DonationCommunicationDomainModel => {

        const doctorNoteModel: DonationCommunicationDomainModel = {
            PatientUserId             : request.body.PatientUserId ?? null,
            DonorUserId               : request.body.DonorUserId ?? null,
            VolunteerUserId           : request.body.VolunteerUserId ?? null,
            FifthDayReminderFlag      : request.body.FifthDayReminderFlag ?? false,
            DonorNoResponseFirstFlag  : request.body.DonorNoResponseFirstFlag ?? false,
            DonorNoResponseSecondFlag : request.body.DonorNoResponseSecondFlag ?? false,
            DonorAcceptance           : request.body.DonorAcceptance ?? "NotSend",
            IsRemindersLoaded         : request.body.IsRemindersLoaded ?? false,
        };

        return doctorNoteModel;
    };

    create = async (request: express.Request): Promise<DonationCommunicationDomainModel> => {
        await this.validateCreateBody(request);
        return this.getDomainModel(request);
    };

    search = async (request: express.Request): Promise<DonationCommunicationSearchFilters> => {

        await this.validateUuid(request, 'patientUserId', Where.Query, false, false);
        await this.validateUuid(request, 'donorUserId', Where.Query, false, false);
        await this.validateUuid(request, 'volunteerUserId', Where.Query, false, false);
        await this.validateString(request, 'donorAcceptance', Where.Query, false, false);
        await this.validateBoolean(request, 'fifthDayReminderFlag', Where.Query, false, false);
        await this.validateBoolean(request, 'donorNoResponseFirstFlag', Where.Query, false, false);
        await this.validateBoolean(request, 'donorNoResponseSecondFlag', Where.Query, false, false);
        await this.validateBoolean(request, 'isRemindersLoaded', Where.Query, false, false);

        await this.validateBaseSearchFilters(request);

        this.validateRequest(request);

        return this.getFilter(request);
    };

    update = async (request: express.Request): Promise<DonationCommunicationDomainModel> => {

        await this.validateUpdateBody(request);
        const domainModel = this.getDomainModel(request);
        domainModel.id = await this.getParamUuid(request, 'id');

        return domainModel;
    };

    private  async validateCreateBody(request) {

        await this.validateUuid(request, 'PatientUserId', Where.Body, false, false);
        await this.validateUuid(request, 'DonorUserId', Where.Body, false, false);
        await this.validateUuid(request, 'VolunteerUserId', Where.Body, false, false);
        await this.validateBoolean(request, 'FifthDayReminderFlag', Where.Body, false, false);
        await this.validateBoolean(request, 'DonorNoResponseFirstFlag', Where.Body, false, false);
        await this.validateBoolean(request, 'DonorNoResponseSecondFlag', Where.Body, false, false);
        await this.validateBoolean(request, 'IsRemindersLoaded', Where.Body, false, false);
        await this.validateString(request, 'DonorAcceptance', Where.Body, false, false);

        this.validateRequest(request);
    }

    private  async validateUpdateBody(request) {

        await this.validateUuid(request, 'PatientUserId', Where.Body, false, false);
        await this.validateUuid(request, 'DonorUserId', Where.Body, false, false);
        await this.validateUuid(request, 'VolunteerUserId', Where.Body, false, false);
        await this.validateBoolean(request, 'FifthDayReminderFlag', Where.Body, false, false);
        await this.validateBoolean(request, 'DonorNoResponseFirstFlag', Where.Body, false, false);
        await this.validateBoolean(request, 'DonorNoResponseSecondFlag', Where.Body, false, false);
        await this.validateBoolean(request, 'IsRemindersLoaded', Where.Body, false, false);
        await this.validateString(request, 'DonorAcceptance', Where.Body, false, false);

        this.validateRequest(request);
    }

    private getFilter(request): DonationCommunicationSearchFilters {

        var filters: DonationCommunicationSearchFilters = {
            PatientUserId             : request.query.patientUserId ?? null,
            DonorUserId               : request.query.donorUserId ?? null,
            VolunteerUserId           : request.query.volunteerUserId ?? null,
            FifthDayReminderFlag      : request.query.fifthDayReminderFlag ?? null,
            DonorNoResponseFirstFlag  : request.query.donorNoResponseFirstFlag ?? null,
            DonorNoResponseSecondFlag : request.query.donorNoResponseSecondFlag ?? null,
            DonorAcceptance           : request.query.donorAcceptance ?? null,
            IsRemindersLoaded         : request.query.isRemindersLoaded ?? null,

        };
        return this.updateBaseSearchFilters(request, filters);
    }

}
