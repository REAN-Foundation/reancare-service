import express from 'express';
import { DailyStatisticsSearchFilters } from '../../../domain.types/statistics/daily.statistics/daily.statistics.search.types';
import { DailyStatisticsDomainModel } from '../../../domain.types/statistics/daily.statistics/daily.statistics.domain.model';
import { BaseValidator, Where } from '../../../api/base.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class DailyStatisticsValidator extends BaseValidator {

    constructor() {
        super();
    }

    getCreateDomainModel = (requestBody: any): DailyStatisticsDomainModel => {

        const createModel: DailyStatisticsDomainModel = {
            StatisticsReportedDate : requestBody.StatisticsReportedDate ?? new Date(),
            CronSchedulerTime      : requestBody.CronSchedulerTime ?? new Date(),
            StatisticsData         : JSON.stringify(requestBody.StatisticsData) ?? null
        };

        return createModel;
    };

    create = async (request: express.Request): Promise<DailyStatisticsDomainModel> => {
        await this.validateCreateBody(request);
        return this.getCreateDomainModel(request.body);
    };

    search = async (request: express.Request): Promise<DailyStatisticsSearchFilters> => {

        await this.validateUuid(request, 'id', Where.Query, false, false);
        await this.validateDate(request,'StatisticsReportedDate',Where.Query,false,false);
        await this.validateDate(request,'CronSchedulerTime',Where.Query,false,false);

        await this.validateBaseSearchFilters(request);

        this.validateRequest(request);

        return this.getFilter(request);
    };

    private async validateCreateBody(request) {
        await this.validateDate(request,'StatisticsReportedDate',Where.Body,false,false);
        await this.validateDate(request,'CronSchedulerTime',Where.Body,false,false);
        await this.validateString(request,'StatisticsData',Where.Body,true,false);
        await this.validateRequest(request);
    }

    private getFilter(request): DailyStatisticsSearchFilters {

        const filters: DailyStatisticsSearchFilters = {
            id                     : request.query.id ?? null,
            StatisticsReportedDate : request.query.statisticsReportedDate ?? null,
            CronSchedulerTime      : request.query.cronSchedulerTime ?? null,
        };

        return this.updateBaseSearchFilters(request, filters);
    }

}
