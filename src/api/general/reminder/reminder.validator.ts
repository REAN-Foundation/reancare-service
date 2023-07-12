import express from 'express';
import {
    ReminderDomainModel,
    ReminderSearchFilters,
} from '../../../domain.types/general/reminder/reminder.domain.model';
import { BaseValidator, Where } from '../../base.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class ReminderValidator extends BaseValidator {

    constructor() {
        super();
    }

    getCreateDomainModel = (requestBody: any): ReminderDomainModel => {

        const createModel: ReminderDomainModel = {
            UserId               : requestBody.UserId ?? null,
            Name                 : requestBody.Name ?? null,
            ReminderType         : requestBody.ReminderType ?? null,
            FrequencyType        : requestBody.FrequencyType ?? null,
            FrequencyCount       : requestBody.FrequencyCount ?? null,
            DateAndTime          : requestBody.DateAndTime ?? null,
            StartDate            : requestBody.StartDate ?? null,
            EndDate              : requestBody.EndDate ?? null,
            EndAfterNRepetitions : requestBody.EndAfterNRepetitions ?? null,
            RepeatList           : requestBody.RepeatList ?? null,
            HookUrl              : requestBody.HookUrl ?? null,
        };

        return createModel;
    };

    getUpdateDomainModel = (requestBody: any): ReminderDomainModel => {

        const updateModel: ReminderDomainModel = {
            UserId               : requestBody.UserId ?? null,
            Name                 : requestBody.Name ?? null,
            ReminderType         : requestBody.ReminderType ?? null,
            FrequencyType        : requestBody.FrequencyType ?? null,
            FrequencyCount       : requestBody.FrequencyCount ?? null,
            DateAndTime          : requestBody.DateAndTime ?? null,
            StartDate            : requestBody.StartDate ?? null,
            EndDate              : requestBody.EndDate ?? null,
            EndAfterNRepetitions : requestBody.EndAfterNRepetitions ?? null,
            RepeatList           : requestBody.RepeatList ?? null,
            HookUrl              : requestBody.HookUrl ?? null,
        };

        return updateModel;
    };

    create = async (request: express.Request): Promise<ReminderDomainModel> => {
        await this.validateCreateBody(request);
        return this.getCreateDomainModel(request.body);
    };

    search = async (request: express.Request): Promise<ReminderSearchFilters> => {

        await this.validateUuid(request, 'userId', Where.Query, false, false);
        await this.validateString(request, 'name', Where.Query, false, false);
        await this.validateString(request, 'reminderType', Where.Query, false, false);
        await this.validateString(request, 'frequencyType', Where.Query, false, false);
        await this.validateBaseSearchFilters(request);

        this.validateRequest(request);

        return this.getFilter(request);
    };

    update = async (request: express.Request): Promise<ReminderDomainModel> => {
        await this.validateUpdateBody(request);
        const domainModel = this.getUpdateDomainModel(request.body);
        domainModel.id = await this.getParamUuid(request, 'id');
        return domainModel;
    };

    private async validateCreateBody(request) {
        await this.validateString(request, 'UserId', Where.Body, true, false);
        await this.validateString(request, 'Name', Where.Body, true, false);
        await this.validateString(request, 'ReminderType', Where.Body, true, false);
        await this.validateString(request, 'FrequencyType', Where.Body, false, true);
        await this.validateInt(request, 'FrequencyCount', Where.Body, false, true);
        await this.validateDate(request, 'DateAndTime', Where.Body, false, true);
        await this.validateDate(request, 'StartDate', Where.Body, false, true);
        await this.validateDate(request, 'EndDate', Where.Body, false, true);
        await this.validateInt(request, 'EndAfterNRepetitions', Where.Body, false, true);
        await this.validateArray(request, 'RepeatList', Where.Body, false, true);
        await this.validateString(request, 'HookUrl', Where.Body, false, true);

        await this.validateRequest(request);
    }

    private async validateUpdateBody(request) {
        await this.validateString(request, 'Name', Where.Body, false, false);
        await this.validateString(request, 'ReminderType', Where.Body, false, false);
        await this.validateString(request, 'FrequencyType', Where.Body, false, true);
        await this.validateInt(request, 'FrequencyCount', Where.Body, false, true);
        await this.validateDate(request, 'DateAndTime', Where.Body, false, true);
        await this.validateDate(request, 'StartDate', Where.Body, false, true);
        await this.validateDate(request, 'EndDate', Where.Body, false, true);
        await this.validateInt(request, 'EndAfterNRepetitions', Where.Body, false, true);
        await this.validateArray(request, 'RepeatList', Where.Body, false, true);
        await this.validateString(request, 'HookUrl', Where.Body, false, true);

        await this.validateRequest(request);
    }

    private getFilter(request): ReminderSearchFilters {

        const filters: ReminderSearchFilters = {
            UserId        : request.query.userId ?? null,
            Name          : request.query.name ?? null,
            ReminderType  : request.query.reminderType ?? null,
            FrequencyType : request.query.frequencyType ?? null,
        };

        return this.updateBaseSearchFilters(request, filters);
    }

}
