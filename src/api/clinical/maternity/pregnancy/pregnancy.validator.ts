import express from 'express';
import { PregnancyDomainModel } from '../../../../domain.types/clinical/maternity/pregnancy/pregnancy.domain.model';
import { PregnancySearchFilters } from '../../../../domain.types/clinical/maternity/pregnancy/pregnancy.search.type';
import { BaseValidator, Where } from '../../../base.validator';
import { AntenatalVisitDomainModel } from '../../../../domain.types/clinical/maternity/antenatal.visit/antenatal.visit.domain.type';
import { AntenatalMedicationDomainModel } from '../../../../domain.types/clinical/maternity/antenatal.medication/antenatal.medication.domain.model';
import { TestDomainModel } from '../../../../domain.types/clinical/maternity/test/test.domain.model';

///////////////////////////////////////////////////////////////////////////////////////

export class PregnancyValidator extends BaseValidator {

    constructor() {
        super();
    }

    getDomainModel = (request: express.Request): PregnancyDomainModel => {

        const PregnancyModel: PregnancyDomainModel = {
            PatientUserId             : request.body.PatientUserId,
            ExternalPregnancyId       : request.body.ExternalPregnancyId,
            DateOfLastMenstrualPeriod : request.body.DateOfLastMenstrualPeriod,
            EstimatedDateOfChildBirth : request.body.EstimatedDateOfChildBirth,
            Gravidity                 : request.body.Gravidity,
            Parity                    : request.body.Parity,
        };

        return PregnancyModel;
    };

    create = async (request: express.Request): Promise<PregnancyDomainModel> => {
        await this.validateCreateBody(request);
        return this.getDomainModel(request);
    };

    search = async (request: express.Request): Promise<PregnancySearchFilters> => {

        await this.validateDate(request, 'DateOfLastMenstrualPeriod', Where.Query, false, false);
        await this.validateDate(request, 'EstimatedDateOfChildBirth', Where.Query, false, false);
        await this.validateInt(request, 'Gravidity', Where.Query, false, false);
        await this.validateInt(request, 'Parity', Where.Query, false, false);

        await this.validateBaseSearchFilters(request);

        this.validateRequest(request);

        return PregnancyValidator.getFilter(request);

    };

    update = async (request: express.Request): Promise<PregnancyDomainModel> => {

        await this.validateUpdateBody(request);
        const domainModel = this.getDomainModel(request);
        domainModel.id = await this.getParamUuid(request, 'id');
        return domainModel;
    };

    private async validateCreateBody(request: express.Request) {

        await this.validateUuid(request, 'PatientUserId', Where.Body, true, false);
        await this.validateUuid(request, 'ExternalPregnancyId', Where.Body, true, false);
        await this.validateDate(request, 'DateOfLastMenstrualPeriod', Where.Body, true, false);
        await this.validateDate(request, 'EstimatedDateOfChildBirth', Where.Body, true, false);
        await this.validateInt(request, 'Gravidity', Where.Body, true, false);
        await this.validateInt(request, 'Parity', Where.Body, true, false);

        this.validateRequest(request);
    }

    private async validateUpdateBody(request: express.Request) {

        await this.validateUuid(request, 'PatientUserId', Where.Body, false, false);
        await this.validateDate(request, 'DateOfLastMenstrualPeriod', Where.Body, false, false);
        await this.validateDate(request, 'EstimatedDateOfChildBirth', Where.Body, false, false);
        await this.validateInt(request, 'Gravidity', Where.Body, false, false);
        await this.validateInt(request, 'Parity', Where.Body, false, false);

        this.validateRequest(request);
    }

    private static getFilter(request): PregnancySearchFilters {

        const filters: PregnancySearchFilters = { 
            DateOfLastMenstrualPeriod : request.query.DateOfLastMenstrualPeriod ?? null,
            EstimatedDateOfChildBirth : request.query.EstimatedDateOfChildBirth ?? null,
            Gravidity                 : request.query.Gravidity ? parseInt(request.query.Gravidity as string) : null,
            Parity                    : request.query.Parity ? parseInt(request.query.Parity as string) : null,
        };
        return filters;
    }

    createAntenatalVisit = async (request: express.Request): Promise<AntenatalVisitDomainModel> => {
        await this.validateUuid(request, 'VisitId', Where.Body, true, false);
        await this.validateUuid(request, 'PregnancyId', Where.Body, true, false);
        await this.validateUuid(request, 'PatientUserId', Where.Body, true, false);
        await this.validateDate(request, 'DateOfVisit', Where.Body, true, false);
        await this.validateInt(request, 'GestationInWeeks', Where.Body, true, false);
        await this.validateInt(request, 'FetalHeartRateBPM', Where.Body, true, false);
        await this.validateObject(request, 'FundalHeight', Where.Body, true, false);
        await this.validateDate(request, 'DateOfNextVisit', Where.Body, true, false);
        
        this.validateRequest(request);
        return request.body;
    };

    updateAntenatalVisit = async (request: express.Request): Promise<AntenatalVisitDomainModel> => {
        await this.validateUuid(request, 'VisitId', Where.Body, false, false);
        await this.validateUuid(request, 'PregnancyId', Where.Body, false, false);
        await this.validateUuid(request, 'PatientUserId', Where.Body, false, false);
        await this.validateDate(request, 'DateOfVisit', Where.Body, false, false);
        await this.validateInt(request, 'GestationInWeeks', Where.Body, false, false);
        await this.validateInt(request, 'FetalHeartRateBPM', Where.Body, false, false);
        await this.validateObject(request, 'FundalHeight', Where.Body, false, false);
        await this.validateDate(request, 'DateOfNextVisit', Where.Body, false, false);
        
        this.validateRequest(request);
        return request.body;
    };

    createAntenatalMedication = async (request: express.Request): Promise<AntenatalMedicationDomainModel> => {
        await this.validateUuid(request, 'AnteNatalVisitId', Where.Body, true, false);
        await this.validateUuid(request, 'PregnancyId', Where.Body, true, false);
        await this.validateString(request, 'Name', Where.Body, true, false);
        await this.validateUuid(request, 'VisitId', Where.Body, false, false);
        await this.validateString(request, 'Given', Where.Body, false, false);
        await this.validateUuid(request, 'MedicationId', Where.Body, false, false);

        this.validateRequest(request);
        return request.body;
    };

    updateAntenatalMedication = async (request: express.Request): Promise<AntenatalMedicationDomainModel> => {
        await this.validateUuid(request, 'AnteNatalVisitId', Where.Body, false, false);
        await this.validateUuid(request, 'PregnancyId', Where.Body, false, false);
        await this.validateUuid(request, 'VisitId', Where.Body, false, false);
        await this.validateString(request, 'Name', Where.Body, false, false);
        await this.validateString(request, 'Given', Where.Body, false, false);
        await this.validateUuid(request, 'MedicationId', Where.Body, false, false);

        this.validateRequest(request);
        return request.body;
    };

    getTestDomainModel = (request: express.Request): TestDomainModel => {
        const TestModel: TestDomainModel = {
            PregnancyId  : request.body.PregnancyId,
            TestName     : request.body.TestName,
            Type         : request.body.Type,
            Impression   : request.body.Impression,
            Parameters   : request.body.Parameters,
            DateOfTest   : request.body.DateOfTest,
        };
        return TestModel;
    }

    createTest = async (request: express.Request): Promise<TestDomainModel> => {
        await this.validateTestCreateBody(request);
        return this.getTestDomainModel(request);
    };

    private async validateTestCreateBody (request: express.Request) {
        await this.validateUuid(request, "PregnancyId", Where.Body, true, false);
        await this.validateString(request, "TestName", Where.Body, true, false);
        await this.validateString(request, "Type", Where.Body, false, false);
        await this.validateString(request, "Impression", Where.Body, false, false);
        await this.validateObject(request, "Parameters", Where.Body, false, false);
        await this.validateDate(request, "DateOfTest", Where.Body, false, false);

        this.validateRequest(request);
    }

    updateTest = async (request: express.Request): Promise<TestDomainModel> => {
        await this.validateUuid(request, "PregnancyId", Where.Body, false, false);
        await this.validateString(request, "TestName", Where.Body, false, false);
        await this.validateString(request, "Type", Where.Body, false, false);
        await this.validateString(request, "Impression", Where.Body, false, false);
        await this.validateObject(request, "Parameters", Where.Body, false, false);
        await this.validateDate(request, "DateOfTest", Where.Body, false, false);

        this.validateRequest(request);
        return request.body;
    };
}
