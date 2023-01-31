import express from 'express';
import { MeditationDomainModel } from '../../../../domain.types/wellness/exercise/meditation/meditation.domain.model';
import { MeditationSearchFilters } from '../../../../domain.types/wellness/exercise/meditation/meditation.search.types';
import { BaseValidator, Where } from '../../../base.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class MeditationValidator extends BaseValidator{

    getDomainModel = (request: express.Request): MeditationDomainModel => {

        const MeditationModel: MeditationDomainModel = {
            PatientUserId  : request.body.PatientUserId ?? null,
            Meditation     : request.body.Meditation ?? null,
            Description    : request.body.Description ?? null,
            Category       : request.body.Category,
            DurationInMins : request.body.DurationInMins ?? null,
            StartTime      : request.body.StartTime ?? new Date(),
            EndTime        : request.body.EndTime ?? null,

        };

        return MeditationModel;
    };

    create = async (request: express.Request): Promise<MeditationDomainModel> => {
        await this.validateCreateBody(request);
        return this.getDomainModel(request);
    };

    search = async (request: express.Request): Promise<MeditationSearchFilters> => {

        await this.validateUuid(request, 'patientUserId', Where.Query, false, false);
        await this.validateString(request, 'meditation', Where.Query, false, false);
        await this.validateDecimal(request, 'durationInMins', Where.Query, false, false);

        await this.validateBaseSearchFilters(request);

        this.validateRequest(request);

        return this.getFilter(request);
    };

    update = async (request: express.Request): Promise<MeditationDomainModel> => {

        await this.validateUpdateBody(request);
        const domainModel = this.getDomainModel(request);
        domainModel.id = await this.getParamUuid(request, 'id');
        return domainModel;
    };

    private  async validateCreateBody(request) {

        await this.validateUuid(request, 'PatientUserId', Where.Body, true, false);
        await this.validateString(request, 'Meditation', Where.Body, false, true);
        await this.validateString(request, 'Description', Where.Body, true, false);
        await this.validateString(request, 'Category', Where.Body, false, true);
        await this.validateDecimal(request, 'DurationInMins', Where.Body, false, true);
        await this.validateDate(request, 'StartTime', Where.Body, false, true);
        await this.validateDate(request, 'EndTime', Where.Body, false, true);

        this.validateRequest(request);
    }

    private  async validateUpdateBody(request) {

        await this.validateUuid(request, 'PatientUserId', Where.Body, false, false);
        await this.validateString(request, 'Meditation', Where.Body, false, false);
        await this.validateString(request, 'Description', Where.Body, false, false);
        await this.validateString(request, 'Category', Where.Body, false, false);
        await this.validateDecimal(request, 'DurationInMins', Where.Body, false, false);
        await this.validateDate(request, 'StartTime', Where.Body, false, false);
        await this.validateDate(request, 'EndTime', Where.Body, false, false);

        this.validateRequest(request);
    }

    private getFilter(request): MeditationSearchFilters {

        var filters: MeditationSearchFilters = {
            PatientUserId  : request.query.patientUserId ?? null,
            Meditation     : request.query.meditation ?? null,
            DurationInMins : request.query.durationInMins ?? null,

        };

        return this.updateBaseSearchFilters(request, filters);
    }

}
