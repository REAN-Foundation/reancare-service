import express from 'express';
import { PregnancyDomainModel } from '../../../../domain.types/clinical/maternity/pregnancy/pregnancy.domain.model';
import { PregnancySearchFilters } from '../../../../domain.types/clinical/maternity/pregnancy/pregnancy.search.type';
import { BaseValidator, Where } from '../../../base.validator';
import { VaccinationSearchFilters } from '../../../../domain.types/clinical/maternity/vaccination/vaccination.search.type';
import { VaccinationDomainModel } from '../../../../domain.types/clinical/maternity/vaccination/vaccination.domain.model';
import { AntenatalVisitDomainModel } from '../../../../domain.types/clinical/maternity/antenatal.visit/antenatal.visit.domain.type';
import { AntenatalMedicationDomainModel } from '../../../../domain.types/clinical/maternity/antenatal.medication/antenatal.medication.domain.model';
import { TestDomainModel } from '../../../../domain.types/clinical/maternity/test/test.domain.model';

///////////////////////////////////////////////////////////////////////////////////////

export class PregnancyValidator extends BaseValidator {

    constructor() {
        super();
    }

    //#region Pregnancy

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

    //#endregion

    //#region Vaccination validation

     getVaccinationDomainModel = (request: express.Request): VaccinationDomainModel => {
         const VaccinationModel: VaccinationDomainModel = {
             PregnancyId             : request.body.PregnancyId,
             VaccineName             : request.body.VaccineName,
             DoseNumber              : request.body.DoseNumber,
             DateAdministered        : new Date(request.body.DateAdministered),
             MedicationId            : request.body.MedicationId ?? null,
             MedicationConsumptionId : request.body.MedicationConsumptionId ?? null,
         };
         return VaccinationModel;
     };

    createVaccination = async (request: express.Request): Promise<VaccinationDomainModel> => {
        await this.validateVaccinationCreateBody(request);
        return this.getVaccinationDomainModel(request);
    };

    searchVaccinations = async (request: express.Request): Promise<VaccinationSearchFilters> => {
        await this.validateUuid(request, 'PregnancyId', Where.Query, false, false);
        await this.validateString(request, 'VaccineName', Where.Query, false, false);
        await this.validateInt(request, 'DoseNumber', Where.Query, false, false);
        await this.validateDate(request, 'DateAdministered', Where.Query, false, false);

        await this.validateBaseSearchFilters(request);
        this.validateRequest(request);
        return PregnancyValidator.getVaccinationSearchFilters(request);

    };

    updateVaccination = async (request: express.Request): Promise<VaccinationDomainModel> => {

        await this.validateVaccinationUpdateBody(request);
        const domainModel = this.getVaccinationDomainModel(request);
        domainModel.id = await this.getParamUuid(request, 'vaccinationId');
        return domainModel;
    };

    private async validateVaccinationCreateBody(request: express.Request) {
        await this.validateUuid(request, 'PregnancyId', Where.Body, true, false);
        await this.validateString(request, 'VaccineName', Where.Body, true, false);
        await this.validateInt(request, 'DoseNumber', Where.Body, true, false);
        await this.validateDate(request, 'DateAdministered', Where.Body, true, false);
        await this.validateUuid(request, 'MedicationId', Where.Body, false, false);
        await this.validateUuid(request, 'MedicationConsumptionId', Where.Body, false, false);
        this.validateRequest(request);
    }

    private static getVaccinationSearchFilters(request): VaccinationSearchFilters {

        const pageIndex = request.query.pageIndex !== 'undefined' ? parseInt(request.query.pageIndex as string, 10) : 0;
        const itemsPerPage = request.query.itemsPerPage !== 'undefined' ? parseInt(request.query.itemsPerPage as string, 10) : 25;
        const filters: VaccinationSearchFilters = {
            PregnancyId      : request.query.PregnancyId ?? null,
            VaccineName      : request.query.VaccineName ?? null,
            DoseNumber       : request.query.DoseNumber ? parseInt(request.query.DoseNumber as string) : null,
            DateAdministered : request.query.DateAdministered ?
                new Date(request.query.DateAdministered as string) : null,
            MedicationId            : request.query.MedicationId ?? null,
            MedicationConsumptionId : request.query.MedicationConsumptionId ?? null,
        };
        return filters;
    }

    private async validateVaccinationUpdateBody(request: express.Request) {
        await this.validateUuid(request, 'PregnancyId', Where.Body, false, false);
        await this.validateString(request, 'VaccineName', Where.Body, false, false);
        await this.validateInt(request, 'DoseNumber', Where.Body, false, false);
        await this.validateDate(request, 'DateAdministered', Where.Body, false, false);
        await this.validateUuid(request, 'MedicationId', Where.Body, false, false);
        await this.validateUuid(request, 'MedicationConsumptionId', Where.Body, false, false);
        
        this.validateRequest(request);
    }

    //#endregion

    //#region Antenatal visit

    getAntenatalVisitDomainModel = (request: express.Request): AntenatalVisitDomainModel => {

        const antenatalVisitModel: AntenatalVisitDomainModel = {
            VisitId           : request.body.VisitId ?? null,
            Visit             : request.body.Visit ?? null,
            PregnancyId       : request.body.PregnancyId,
            Pregnancy         : request.body.Pregnancy ?? null,
            PatientUserId     : request.body.PatientUserId,
            DateOfVisit       : request.body.DateOfVisit,
            GestationInWeeks  : request.body.GestationInWeeks,
            FetalHeartRateBPM : request.body.FetalHeartRateBPM,
            FundalHeight      : request.body.FundalHeight,
            DateOfNextVisit   : request.body.DateOfNextVisit,
        };
    
        return antenatalVisitModel;
    };
    
    createAntenatalVisit = async (request: express.Request): Promise<AntenatalVisitDomainModel> => {
        await this.validateAntenatalVisitCreateBody(request);
        return this.getAntenatalVisitDomainModel(request);
    };
    
    updateAntenatalVisit = async (request: express.Request): Promise<AntenatalVisitDomainModel> => {
        await this.validateAntenatalVisitUpdateBody(request);
        const domainModel = this.getAntenatalVisitDomainModel(request);
        domainModel.id = await this.getParamUuid(request, 'id');
        return domainModel;
    };
    
    private async validateAntenatalVisitCreateBody(request: express.Request) {
    
        await this.validateUuid(request, 'VisitId', Where.Body, true, false);
        await this.validateUuid(request, 'PregnancyId', Where.Body, true, false);
        await this.validateUuid(request, 'PatientUserId', Where.Body, true, false);
        await this.validateDate(request, 'DateOfVisit', Where.Body, true, false);
        await this.validateInt(request, 'GestationInWeeks', Where.Body, true, false);
        await this.validateInt(request, 'FetalHeartRateBPM', Where.Body, true, false);
        await this.validateObject(request, 'FundalHeight', Where.Body, true, false);
        await this.validateDate(request, 'DateOfNextVisit', Where.Body, true, false);
    
        this.validateRequest(request);
    }
    
    private async validateAntenatalVisitUpdateBody(request: express.Request) {
    
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
    }
    //#endregion Antenatal visit

    //#region Antenatal Medication

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

    //#endregion

    //#region Test

    getTestDomainModel = (request: express.Request): TestDomainModel => {
        const TestModel: TestDomainModel = {
            PregnancyId : request.body.PregnancyId,
            TestName    : request.body.TestName,
            Type        : request.body.Type,
            Impression  : request.body.Impression,
            Parameters  : request.body.Parameters,
            DateOfTest  : request.body.DateOfTest,
        };
        return TestModel;
    };

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
function uuidv4() {
    throw new Error('Function not implemented.');
}

