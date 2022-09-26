import express from 'express';
import { InputValidationError } from '../../../../common/input.validation.error';
import { DocumentDomainModel } from '../../../../domain.types/users/patient/document/document.domain.model';
import { DocumentSearchFilters } from '../../../../domain.types/users/patient/document/document.search.types';
import { Roles } from '../../../../domain.types/role/role.types';
import { UserService } from '../../../../services/users/user/user.service';
import { Loader } from '../../../../startup/loader';
import { BaseValidator, Where } from '../../../base.validator';
import { FileResourceValidator } from '../../../general/file.resource/file.resource.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class DocumentValidator  extends BaseValidator {

    _userService: UserService = null;

    constructor() {
        super();
        this._userService = Loader.container.resolve(UserService);
    }

    getDomainModel = async (request: express.Request): Promise<DocumentDomainModel> => {

        var fileResourceValidator = new FileResourceValidator();
        var fileMetadataList = fileResourceValidator.getFileMetadataList(request);
        if (fileMetadataList.length === 0) {
            throw new InputValidationError([`File metadata cannot be retrieved.`]);
        }
        var metadata = fileMetadataList[0];

        const currentUserId = request.currentUser.UserId;
        var patientUserId = null;
        if (request.body.PatientUserId === undefined || request.body.PatientUserId === null) {
            var roleName = await this._userService.getUserRoleName(currentUserId);
            if (roleName === Roles.Patient) {
                patientUserId = currentUserId;
            }
        }
        else {
            patientUserId = request.body.PatientUserId;
        }

        const model: DocumentDomainModel = {
            DocumentType              : request.body.DocumentType,
            PatientUserId             : patientUserId,
            MedicalPractitionerUserId : request.body.MedicalPractitionerUserId ?? null,
            MedicalPractionerRole     : request.body.MedicalPractionerRole ?? null,
            UploadedByUserId          : currentUserId,
            AssociatedVisitId         : request.body.AssociatedVisitId ?? null,
            AssociatedVisitType       : request.body.AssociatedVisitType ?? null,
            AssociatedOrderId         : request.body.AssociatedOrderId ?? null,
            AssociatedOrderType       : request.body.AssociatedOrderType ?? null,
            FileMetaData              : metadata,
            RecordDate                : request.body.RecordDate ?? new Date(),
            UploadedDate              : new Date(),
        };

        return model;
    };

    upload = async (request: express.Request): Promise<DocumentDomainModel> => {
        await this.validateUploadBody(request);
        return this.getDomainModel(request);
    };

    update = async (request: express.Request): Promise<DocumentDomainModel> => {

        const id: string = await this.getParamUuid(request, 'id');

        await this.validateUpdateBody(request);

        const model: DocumentDomainModel = {
            DocumentType              : request.body.DocumentType ?? null,
            PatientUserId             : request.body.PatientUserId ?? null,
            MedicalPractitionerUserId : request.body.MedicalPractitionerUserId ?? null,
            MedicalPractionerRole     : request.body.MedicalPractionerRole ?? null,
            AssociatedVisitId         : request.body.AssociatedVisitId ?? null,
            AssociatedVisitType       : request.body.AssociatedVisitType ?? null,
            AssociatedOrderId         : request.body.AssociatedOrderId ?? null,
            AssociatedOrderType       : request.body.AssociatedOrderType ?? null,
            RecordDate                : request.body.RecordDate ?? new Date(),
        };
        model.id = id;

        return model;
    };

    rename = async (request: express.Request): Promise<string> => {
        await this.validateString(request, 'NewName', Where.Body, true, false, false, 4, 64);
        this.validateRequest(request);
        return request.body.NewName;
    };

    search = async (request: express.Request): Promise<DocumentSearchFilters> => {

        await this.validateUuid(request, 'medicalPractitionerUserId', Where.Query, false, false);
        await this.validateString(request, 'documentType', Where.Query, false, false, true);
        await this.validateUuid(request, 'associatedOrderId', Where.Query, false, false);
        await this.validateUuid(request, 'associatedVisitId', Where.Query, false, false);
        await this.validateDate(request, 'uploadedDateFrom', Where.Query, false, false);
        await this.validateDate(request, 'uploadedDateTo', Where.Query, false, false);

        await this.validateBaseSearchFilters(request);

        this.validateRequest(request);

        return this.getFilter(request);
    };

    private  getFilter(request): DocumentSearchFilters {

        var filters: DocumentSearchFilters = {
            PatientUserId             : request.currentUser.UserId, //Currently only allow patients to search their own documents
            MedicalPractitionerUserId : request.query.medicalPractitionerUserId,
            DocumentType              : request.query.documentType,
            AssociatedOrderId         : request.query.associatedOrderId,
            AssociatedVisitId         : request.query.associatedVisitId,
            CreatedDateFrom           : request.query.uploadedDateFrom,
            CreatedDateTo             : request.query.uploadedDateTo
        };

        return this.updateBaseSearchFilters(request, filters);
    }

    private async validateUploadBody(request) {
        await this.validateString(request, 'DocumentType', Where.Body, true, false, true);
        await this.validateUuid(request, 'PatientUserId', Where.Body, false, false);
        await this.validateCommonBodyParams(request);
        this.validateRequest(request);
    }

    private async validateUpdateBody(request) {
        await this.validateString(request, 'DocumentType', Where.Body, false, false, true);
        await this.validateUuid(request, 'PatientUserId', Where.Body, false, false);
        await this.validateCommonBodyParams(request);
        this.validateRequest(request);
    }

    private async validateCommonBodyParams(request: any) {
        await this.validateUuid(request, 'MedicalPractitionerUserId', Where.Body, false, true);
        await this.validateUuid(request, 'AssociatedVisitId', Where.Body, false, true);
        await this.validateUuid(request, 'AssociatedOrderId', Where.Body, false, true);
        await this.validateString(request, 'MedicalPractionerRole', Where.Body, false, false);
        await this.validateString(request, 'AssociatedVisitType', Where.Body, false, false);
        await this.validateString(request, 'AssociatedOrderType', Where.Body, false, false);
        await this.validateDate(request, 'RecordDate', Where.Body, false, false);
    }

}
