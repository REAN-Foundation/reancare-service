import express from 'express';
import { BaseValidator, Where } from '../../base.validator';
import { ThirdpartyApiCredentialsDomainModel } from '../../../../domain.types/thirdparty/thirdparty.api.credentials';

///////////////////////////////////////////////////////////////////////////////////////

export class FormsValidator extends BaseValidator {

    constructor() {
        super();
    }
    
    connect = async (request: express.Request): Promise<ThirdpartyApiCredentialsDomainModel> => {

        await this.validateString(request, 'providerCode', Where.Param, true, false);
        await this.validateString(request, 'BaseUrl', Where.Body, false, false);
        await this.validateString(request, 'SecondaryUrl', Where.Body, false, false);
        await this.validateString(request, 'Token', Where.Body, false, false, false, 3);
        await this.validateDateString(request, 'ValidTill', Where.Body, false, false);

        this.validateRequest(request);

        const connectionModel: ThirdpartyApiCredentialsDomainModel = {
            Provider     : request.params.providerCode,
            BaseUrl      : request.body.BaseUrl ?? null,
            SecondaryUrl : request.body.SecondaryUrl ?? null,
            Token        : request.body.Token ?? null,
            ValidTill    : request.body.ValidTill ?? null
        };

        return connectionModel;
    };

    // getDomainModel = (request: express.Request): AssessmentDomainModel => {

    //     const patientAssessmentModel: AssessmentDomainModel = {
    //         PatientUserId          : request.body.PatientUserId ?? null,
    //         Title                  : request.body.Title ?? null,
    //         Type                   : request.body.Type ?? null,
    //         AssessmentTemplateId   : request.body.AssessmentTemplateId ?? null,
    //         ProviderEnrollmentId   : request.body.ProviderEnrollmentId ?? null,
    //         ProviderAssessmentCode : request.body.ProviderAssessmentCode ?? null,
    //         Provider               : request.body.Provider ?? null,
    //         Status                 : request.body.Status ?? null,
    //     };

    //     return patientAssessmentModel;
    // };

    // search = async (
    //     request: express.Request
    // ): Promise<AssessmentSearchFilters> => {

    //     await this.validateUuid(request, 'patientUserId', Where.Query, false, false);
    //     await this.validateString(request, 'title', Where.Query, false, false, true);
    //     await this.validateString(request, 'type', Where.Query, false, false, true);

    //     await this.validateBaseSearchFilters(request);
        
    //     this.validateRequest(request);

    //     return this.getFilter(request);

    // };
        
    // private getFilter(request): AssessmentSearchFilters {

    //     var filters: AssessmentSearchFilters = {
    //         PatientUserId : request.query.patientUserId ?? null,
    //         Title         : request.query.title ?? null,
    //         Type          : request.query.type ?? null,
    //     };

    //     return this.updateBaseSearchFilters(request, filters);
    // }

    // update = async (request: express.Request): Promise<AssessmentDomainModel> => {

    //     await this.validateUpdateBody(request);
    //     const domainModel = this.getDomainModel(request);
    //     domainModel.id = await this.getParamUuid(request, 'id');

    //     return domainModel;
    // };

    // private async validateCreateBody(request) {

    //     await this.validateUuid(request, 'PatientUserId', Where.Body, true, false);
    //     await this.validateString(request, 'Title', Where.Body, true, false);
    //     await this.validateString(request, 'Type', Where.Body, true, false);
    //     await this.validateString(request, 'AssessmentTemplateId', Where.Body, true, false);
    //     await this.validateString(request, 'ProviderEnrollmentId', Where.Body, false, false);
    //     await this.validateString(request, 'ProviderAssessmentCode', Where.Body, false, false);
    //     await this.validateString(request, 'Provider', Where.Body, false, false);

    //     this.validateRequest(request);

    // }

    // private async validateUpdateBody(request) {

    //     await this.validateUuid(request, 'PatientUserId', Where.Body, false, false);
    //     await this.validateString(request, 'Title', Where.Body, false, false);
    //     await this.validateString(request, 'Type', Where.Body, false, false);
    //     await this.validateString(request, 'AssessmentTemplateId', Where.Body, false, false);
    //     await this.validateString(request, 'ProviderEnrollmentId', Where.Body, false, false);
    //     await this.validateString(request, 'ProviderAssessmentCode', Where.Body, false, false);
    //     await this.validateString(request, 'Provider', Where.Body, false, false);

    //     this.validateRequest(request);
        
    // }

}
