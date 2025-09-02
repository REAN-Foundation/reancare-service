import express from 'express';
import { DeliveryDomainModel } from '../../../../domain.types/clinical/maternity/delivery/delivery.domain.model';
import { DeliverySearchFilters } from '../../../../domain.types/clinical/maternity/delivery/delivery.search.type';
import { BaseValidator, Where } from '../../../base.validator';
import { PostnatalVisitDomainModel } from '../../../../domain.types/clinical/maternity/postnatal.visit/postnatal.visit.domain.model';
import { PostnatalVisitSearchFilters } from '../../../../domain.types/clinical/maternity/postnatal.visit/postnatal.visit.search type';
import { PostnatalMedicationDomainModel } from '../../../../domain.types/clinical/maternity/postnatal.medication/postnatal.medication.domain.model';
import { ComplicationDomainModel } from '../../../../domain.types/clinical/maternity/complication/complication.domain.model';
import { ComplicationSearchFilter } from '../../../../domain.types/clinical/maternity/complication/complication.search.type';
import { BabyDomainModel } from '../../../../domain.types/clinical/maternity/baby/baby.domain.model';
import { BreastfeedingDomainModel } from '../../../../domain.types/clinical/maternity/breastfeeding/breastfeeding.domain.model';

///////////////////////////////////////////////////////////////////////////////////////

export class DeliveryValidator extends BaseValidator {

    constructor() {
        super();
    }

    //#region Delivery

    getDomainModel = (request: express.Request): DeliveryDomainModel => {

        const DeliveryModel: DeliveryDomainModel = {
            PregnancyId     : request.body.PregnancyId ?? null,
            Pregnancy         : request.body.Pregnancy ?? null,
            PatientUserId   : request.body.PatientUserId ?? null,
            DeliveryDate    : request.body.DeliveryDate ?? new Date,
            DeliveryTime    : request.body.DeliveryTime ?? new Date().toTimeString(),
            GestationAtBirth: request.body.GestationAtBirth ?? null,
            DeliveryMode    : request.body.DeliveryMode?? null,
            DeliveryPlace   : request.body.DeliveryPlace?? null,
            DeliveryOutcome : request.body.DeliveryOutcome ?? null,
            DateOfDischarge : request.body.DateOfDischarge ?? null,
            OverallDiagnosis: request.body.OverallDiagnosis ?? null
        };

        return DeliveryModel;
    };

    create = async (request: express.Request): Promise<DeliveryDomainModel> => {
        await this.validateCreateBody(request);
        return this.getDomainModel(request);
    };

    search = async (request: express.Request): Promise<DeliverySearchFilters> => {

        await this.validateDate(request, 'DeliveryDate', Where.Query, false, false);
        // await this.validateTime(request, 'DeliveryTime', Where.Query, false, false);
        await this.validateInt(request, 'GestationAtBirth', Where.Query, false, false);
        await this.validateString(request, 'DeliveryMode', Where.Body, false, false);
        await this.validateString(request, 'DeliveryOutcome', Where.Body, false, false);

        await this.validateBaseSearchFilters(request);

        this.validateRequest(request);

        return DeliveryValidator.getFilter(request);

    };

    update = async (request: express.Request): Promise<DeliveryDomainModel> => {

        await this.validateUpdateBody(request);
        const domainModel = this.getDomainModel(request);
        domainModel.id = await this.getParamUuid(request, 'id');
        return domainModel;
    };

    private async validateCreateBody(request: express.Request) {

        await this.validateUuid(request, 'PregnancyId', Where.Body, true, false);
        await this.validateUuid(request, 'PatientUserId', Where.Body, true, false);
        await this.validateDate(request, 'DeliveryDate', Where.Body, true, false);
        await this.validateDate(request, 'DeliveryTime', Where.Body, true, false);
        await this.validateInt(request, 'GestationAtBirth', Where.Body, true, false);
        await this.validateString(request, 'DeliveryMode', Where.Body, true, false);
        await this.validateString(request, 'DeliveryOutcome', Where.Body, true, false);

        this.validateRequest(request);
    }
    private async validateUpdateBody(request: express.Request) {

        await this.validateUuid(request, 'PregnancyId', Where.Body, false, false);
        await this.validateDate(request, 'DeliveryDate', Where.Body, false, false);
        await this.validateDate(request, 'DeliveryTime', Where.Body, false, false);
        await this.validateInt(request, 'GestationAtBirth', Where.Body, false, false);
        await this.validateString(request, 'DeliveryMode', Where.Body, false, false);
        await this.validateString(request, 'DeliveryOutcome', Where.Body, false, false);

        this.validateRequest(request);
    }

    private static getFilter(request): DeliverySearchFilters {

        const filters: DeliverySearchFilters = { 
            DeliveryDate    : request.query.DeliveryDate ?? null,
            DeliveryTime    : request.query.DeliveryTime ?? null,
            GestationAtBirth: request.query.GestationAtBirth ? parseInt(request.query.GestationAtBirth as string) : null,
            DeliveryMode    : request.query.DeliveryMode ?? null,
            DeliveryOutcome : request.query.DeliveryOutcome ?? null,
        };

        return filters;
    }

    //#endregion

    //#region Postnatal visit

    getPostnatalVisitDomainModel = (request: express.Request): PostnatalVisitDomainModel => {

        const PostnatalVisitModel: PostnatalVisitDomainModel = {
            DeliveryId        : request.body.DeliveryId ?? null,
            Delivery          : request.body.Delivery ?? null,
            PatientUserId     : request.body.PatientUserId ?? null,
            DateOfVisit       : request.body.DateOfVisit ?? new Date(),
            BodyWeightId      : request.body.BodyWeightId ?? null,
            ComplicationId    : request.body.ComplicationId ?? null,
            BodyTemperatureId : request.body.BodyTemperatureId ?? null,
            BloodPressureId   : request.body.BloodPressureId ?? null,
        };

        return PostnatalVisitModel;
    };

    createPostnatalVisit = async (request: express.Request): Promise<PostnatalVisitDomainModel> => {
        await this.validatePostnatalVisitCreateBody(request);
        return this.getPostnatalVisitDomainModel(request);
    };

    searchPostnatalVisits = async (request: express.Request): Promise<PostnatalVisitSearchFilters> => {

        await this.validateDate(request, 'DateOfVisit', Where.Query, false, false);
        await this.validateUuid(request, 'DeliveryId', Where.Query, false, false);
        await this.validateUuid(request, 'PatientUserId', Where.Query, false, false);
        await this.validateUuid(request, 'BodyWeightId', Where.Query, false, false);
        await this.validateUuid(request, 'ComplicationId', Where.Query, false, false);
        await this.validateUuid(request, 'BodyTemperatureId', Where.Query, false, false);
        await this.validateUuid(request, 'BloodPressureId', Where.Query, false, false);

        await this.validateBaseSearchFilters(request);

        this.validateRequest(request);

        return DeliveryValidator.getPostnatalVisitFilter(request);
    };

    updatePostnatalVisit = async (request: express.Request): Promise<PostnatalVisitDomainModel> => {

        await this.validatePostnatalVisitUpdateBody(request);
        const domainModel = this.getPostnatalVisitDomainModel(request);
        // domainModel.id = await this.getParamUuid(request, 'id');
        return domainModel;
    };

    private async validatePostnatalVisitCreateBody(request: express.Request) {

        await this.validateUuid(request, 'DeliveryId', Where.Body, true, false);
        await this.validateUuid(request, 'PatientUserId', Where.Body, true, false);
        await this.validateDate(request, 'DateOfVisit', Where.Body, true, false);
        await this.validateUuid(request, 'BodyWeightId', Where.Body, false, false);
        await this.validateUuid(request, 'ComplicationId', Where.Body, false, false);
        await this.validateUuid(request, 'BodyTemperatureId', Where.Body, false, false);
        await this.validateUuid(request, 'BloodPressureId', Where.Body, false, false);

        this.validateRequest(request);
    }

    private async validatePostnatalVisitUpdateBody(request: express.Request) {

        await this.validateUuid(request, 'DeliveryId', Where.Body, false, false);
        await this.validateDate(request, 'DateOfVisit', Where.Body, false, false);
        await this.validateUuid(request, 'BodyWeightId', Where.Body, false, false);
        await this.validateUuid(request, 'ComplicationId', Where.Body, false, false);
        await this.validateUuid(request, 'BodyTemperatureId', Where.Body, false, false);
        await this.validateUuid(request, 'BloodPressureId', Where.Body, false, false);

        this.validateRequest(request);
    }

    private static getPostnatalVisitFilter(request): PostnatalVisitSearchFilters {

        const pageIndex = request.query.pageIndex !== 'undefined' ? parseInt(request.query.pageIndex as string, 10) : 0;
        const itemsPerPage = request.query.itemsPerPage !== 'undefined' ? parseInt(request.query.itemsPerPage as string, 10) : 25;

        const filters: PostnatalVisitSearchFilters = {
            DeliveryId        : request.query.DeliveryId ?? null,
            PatientUserId     : request.query.PatientUserId ?? null,
            DateOfVisit       : request.query.DateOfVisit ?? null,
            BodyWeightId      : request.query.BodyWeightId ?? null,
            ComplicationId    : request.query.ComplicationId ?? null,
            BodyTemperatureId : request.query.BodyTemperatureId ?? null,
            BloodPressureId   : request.query.BloodPressureId ?? null,
        };

        return filters;
    }

    //#endregion

    //#region Postnatal Medication

    getPostnatalMedicationDomainModel = (request: express.Request): PostnatalMedicationDomainModel => {
        const PostnatalMedicationModel: PostnatalMedicationDomainModel = {
            PostNatalVisitId : request.body.PostNatalVisitId ?? null,
            DeliveryId       : request.body.DeliveryId ?? null,
            VisitId          : request.body.VisitId ?? null,
            Name             : request.body.Name ?? null,
            Given            : request.body.Given ?? null,
            MedicationId     : request.body.MedicationId ?? null,
        };
        return PostnatalMedicationModel;
    };

    createPostnatalMedication = async (request: express.Request): Promise<PostnatalMedicationDomainModel> => {
        await this.validatePostnatalMedicationCreateBody(request);
        return this.getPostnatalMedicationDomainModel(request);
    };

    updatePostnatalMedication = async (request: express.Request): Promise<PostnatalMedicationDomainModel> => {
        await this.validatePostnatalMedicationUpdateBody(request);
        return this.getPostnatalMedicationDomainModel(request);
    };

    private async validatePostnatalMedicationCreateBody(request: express.Request) {
        await this.validateUuid(request, 'PostNatalVisitId', Where.Body, true, false);
        await this.validateUuid(request, 'DeliveryId', Where.Body, true, false);
        await this.validateUuid(request, 'VisitId', Where.Body, true, false);
        await this.validateString(request, 'Name', Where.Body, true, false);
        await this.validateString(request, 'Given', Where.Body, true, false);
        await this.validateUuid(request, 'MedicationId', Where.Body, true, false);

        this.validateRequest(request);
    }

    private async validatePostnatalMedicationUpdateBody(request: express.Request) {
        await this.validateUuid(request, 'PostNatalVisitId', Where.Body, false, false);
        await this.validateUuid(request, 'DeliveryId', Where.Body, false, false);
        await this.validateUuid(request, 'VisitId', Where.Body, false, false);
        await this.validateString(request, 'Name', Where.Body, false, false);
        await this.validateString(request, 'Given', Where.Body, false, false);
        await this.validateUuid(request, 'MedicationId', Where.Body, false, false);

        this.validateRequest(request);
    }
    //#endregion

    //#region Complication

    getComplicationDomainModel = (request: express.Request): ComplicationDomainModel => {
        const complicationModel: ComplicationDomainModel = {
            DeliveryId        : request.body.DeliveryId ?? null,
            BabyId1           : request.body.BabyId1 ?? null,
            BabyId2           : request.body.BabyId2 ?? null,
            BabyId3           : request.body.BabyId3 ?? null,
            Name              : request.body.Name ?? null,
            Status            : request.body.Status ?? null,
            Severity          : request.body.Severity ?? null,
            MedicalConditionId: request.body.MedicalConditionId ?? null,
        };
        return complicationModel;
    };

    createComplication = async (request: express.Request): Promise<ComplicationDomainModel> => {
        await this.validateComplicationCreateBody(request);
        return this.getComplicationDomainModel(request);
    };

    searchComplications = async (request: express.Request): Promise<ComplicationSearchFilter> => {
        await this.validateUuid(request, 'DeliveryId', Where.Body, false, false);
        await this.validateUuid(request, 'BabyId1', Where.Body, false, false);
        await this.validateUuid(request, 'BabyId2', Where.Body, false, false);
        await this.validateUuid(request, 'BabyId3', Where.Body, false, false);
        await this.validateString(request, 'Name', Where.Query, false, false);
        await this.validateString(request, 'Status', Where.Query, false, false);
        await this.validateString(request, 'Severity', Where.Query, false, false);
        await this.validateUuid(request, 'MedicalConditionId', Where.Query, false, false);

        await this.validateBaseSearchFilters(request);

        this.validateRequest(request);

        return DeliveryValidator.getComplicationFilter(request);
    };

    updateComplication = async (request: express.Request): Promise<ComplicationDomainModel> => {
        await this.validateComplicationUpdateBody(request);
        const domainModel = this.getComplicationDomainModel(request);
        domainModel.id = await this.getParamUuid(request, 'id');
        return domainModel;
    };

    private async validateComplicationCreateBody(request: express.Request) {
        await this.validateUuid(request, 'DeliveryId', Where.Body, true, false);
        await this.validateString(request, 'Name', Where.Body, true, false);
        await this.validateString(request, 'Status', Where.Body, false, false);
        await this.validateString(request, 'Severity', Where.Body, false, false);
        await this.validateUuid(request, 'MedicalConditionId', Where.Body, false, false);
        this.validateRequest(request);
    }

    private async validateComplicationUpdateBody(request: express.Request) {
        await this.validateUuid(request, 'DeliveryId', Where.Body, false, false);
        await this.validateString(request, 'Name', Where.Body, false, false);
        await this.validateString(request, 'Status', Where.Body, false, false);
        await this.validateString(request, 'Severity', Where.Body, false, false);
        await this.validateUuid(request, 'MedicalConditionId', Where.Body, false, false);
        this.validateRequest(request);
    }

    private static getComplicationFilter(request): ComplicationSearchFilter {
        const pageIndex = request.query.pageIndex !== 'undefined' ? parseInt(request.query.pageIndex as string, 10) : 0;
        const itemsPerPage = request.query.itemsPerPage !== 'undefined' ? parseInt(request.query.itemsPerPage as string, 10) : 25;

        const filters: ComplicationSearchFilter = {
            DeliveryId        : request.query.DeliveryId ?? null,
            BabyId1           : request.query.BabyId1 ?? null,
            BabyId2           : request.query.BabyId2 ?? null,
            BabyId3           : request.query.BabyId3 ?? null,
            Name              : request.query.Name ?? null,
            Status            : request.query.Status ?? null,
            Severity          : request.query.Severity ?? null,
            MedicalConditionId: request.query.MedicalConditionId ?? null,
        };
        return filters;
    }
    //#endregion

    //#region Baby

    getBabyDomainModel = (request: express.Request): BabyDomainModel => {
        const babyModel: BabyDomainModel = {
            DeliveryId        : request.body.DeliveryId ?? null,
            PatientUserId     : request.body.PatientUserId ?? null,
            WeightAtBirthGrams : request.body.WeightAtBirthGrams ?? null,
            Gender            : request.body.Gender ?? null,
            Status            : request.body.Status ?? null,
            ComplicationId    : request.body.ComplicationId ?? null,
        };
        return babyModel;
    };

    createBaby = async (request: express.Request): Promise<BabyDomainModel> => {
        await this.validateBabyCreateBody(request);
        return this.getBabyDomainModel(request);
    };

    private async validateBabyCreateBody(request: express.Request) {
        await this.validateUuid(request, 'DeliveryId', Where.Body, true, false);
        await this.validateUuid(request, 'PatientUserId', Where.Body, true, false);
        await this.validateInt(request, 'WeightAtBirthGrams', Where.Body, true, false);
        await this.validateString(request, 'Gender', Where.Body, true, false);
        await this.validateString(request, 'Status', Where.Body, false, false);
        await this.validateUuid(request, 'ComplicationId', Where.Body, false, false);
        this.validateRequest(request);
    }

    //#endregion

    //#region Breastfeeding

    getBreastfeedingDomainModel = (request: express.Request): BreastfeedingDomainModel => {

        const breastfeedingModel: BreastfeedingDomainModel = {
            VisitId               : request.body.VisitId ?? null,
            PostNatalVisitId      : request.body.PostNatalVisitId ?? null,
            BreastFeedingStatus   : request.body.BreastFeedingStatus ?? null,
            BreastfeedingFrequency: request.body.BreastfeedingFrequency ?? null,
            AdditionalNotes       : request.body.AdditionalNotes ?? null,
        };

        return breastfeedingModel;
    };

    createBreastfeeding = async (request: express.Request): Promise<BreastfeedingDomainModel> => {
        await this.validateBreastfeedingCreateBody(request);
        return this.getBreastfeedingDomainModel(request);
    };

    updateBreastfeeding = async (request: express.Request): Promise<BreastfeedingDomainModel> => {

        await this.validateBreastfeedingUpdateBody(request);
        const domainModel = this.getBreastfeedingDomainModel(request);
        // domainModel.id = await this.getParamUuid(request, 'id');
        return domainModel;
    };

    private async validateBreastfeedingCreateBody(request: express.Request) {

        await this.validateUuid(request, 'VisitId', Where.Body, true, false);
        await this.validateUuid(request, 'PostNatalVisitId', Where.Body, true, false);
        await this.validateString(request, 'BreastFeedingStatus', Where.Body, true, false);
        await this.validateString(request, 'BreastfeedingFrequency', Where.Body, false, false);
        await this.validateString(request, 'AdditionalNotes', Where.Body, false, false);

        this.validateRequest(request);
    }

    private async validateBreastfeedingUpdateBody(request: express.Request) {

        await this.validateUuid(request, 'VisitId', Where.Body, false, false);
        await this.validateUuid(request, 'PostNatalVisitId', Where.Body, false, false);
        await this.validateString(request, 'BreastFeedingStatus', Where.Body, false, false);
        await this.validateString(request, 'BreastfeedingFrequency', Where.Body, false, false);
        await this.validateString(request, 'AdditionalNotes', Where.Body, false, false);

        this.validateRequest(request);
    }

}
