import express from 'express';
import { DailyAssessmentDomainModel } from '../../../domain.types/clinical/daily.assessment/daily.assessment.domain.model';
import { DailyAssessmentSearchFilters } from '../../../domain.types/clinical/daily.assessment/daily.assessment.search.types';
import { BaseValidator, Where } from '../../base.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class DailyAssessmentValidator extends BaseValidator{

    getDomainModel = (request: express.Request): DailyAssessmentDomainModel => {

        const dailyAssessmentModel: DailyAssessmentDomainModel = {
            PatientUserId : request.body.PatientUserId ?? null,
            Feeling       : request.body.Feeling,
            Mood          : request.body.Mood,
            EnergyLevels  : request.body.EnergyLevels,
            RecordDate    : request.body.RecordDate ?? new Date(),
        };

        return dailyAssessmentModel;
    };

    create = async (request: express.Request): Promise<DailyAssessmentDomainModel> => {
        await this.validateCreateBody(request);
        return this.getDomainModel(request);
    };

    search = async (request: express.Request): Promise<DailyAssessmentSearchFilters> => {

        await this.validateUuid(request, 'patientUserId', Where.Query, false, false);
        await this.validateString(request, 'feeling', Where.Query, false, false);
        await this.validateString(request, 'mood', Where.Query, false, false);
        await this.validateString(request, 'energyLevels', Where.Query, false, false);
        await this.validateDate(request, 'dateFrom', Where.Query, false, false);
        await this.validateDate(request, 'dateTo', Where.Query, false, false);

        await this.validateBaseSearchFilters(request);

        this.validateRequest(request);

        return this.getFilter(request);
    };

    private  async validateCreateBody(request) {

        await this.validateUuid(request, 'PatientUserId', Where.Body, true, false);
        await this.validateString(request, 'Feeling', Where.Body, false, true);
        await this.validateString(request, 'Mood', Where.Body, false, true);
        await this.validateArray(request, 'EnergyLevels', Where.Body, false, true);
        await this.validateDate(request, 'RecordDate', Where.Body, false, true);

        this.validateRequest(request);
    }

    private getFilter(request): DailyAssessmentSearchFilters {

        var filters: DailyAssessmentSearchFilters = {
            PatientUserId : request.query.patientUserId ?? null,
            Feeling       : request.query.feeling ?? null,
            Mood          : request.query.mood ?? null,
            EnergyLevels  : request.query.energyLevels ?? null,
            DateFrom      : request.query.dateFrom ?? null,
            DateTo        : request.query.dateTo ?? null,
        };

        return this.updateBaseSearchFilters(request, filters);
    }

}
