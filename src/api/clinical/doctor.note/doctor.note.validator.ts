import express from 'express';
import { DoctorNoteDomainModel } from '../../../domain.types/clinical/doctor.note/doctor.note.domain.model';
import { DoctorNoteSearchFilters } from '../../../domain.types/clinical/doctor.note/doctor.note.search.types';
import { BaseValidator, Where } from '../../base.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class DoctorNoteValidator extends BaseValidator {

    constructor() {
        super();
    }

    getDomainModel = (request: express.Request): DoctorNoteDomainModel => {

        const doctorNoteModel: DoctorNoteDomainModel = {
            PatientUserId             : request.body.PatientUserId ?? null,
            EhrId                     : request.body.EhrId ?? null,
            MedicalPractitionerUserId : request.body.MedicalPractitionerUserId ?? null,
            VisitId                   : request.body.VisitId ?? null,
            Notes                     : request.body.Notes ?? null,
            ValidationStatus          : request.body.ValidationStatus ?? null,
            RecordDate                : request.body.RecordDate ?? null,
        };

        return doctorNoteModel;
    };

    create = async (request: express.Request): Promise<DoctorNoteDomainModel> => {
        await this.validateCreateBody(request);
        return this.getDomainModel(request);
    };

    search = async (request: express.Request): Promise<DoctorNoteSearchFilters> => {

        await this.validateUuid(request, 'patientUserId', Where.Query, false, false);
        await this.validateUuid(request, 'visitId', Where.Query, false, false);
        await this.validateUuid(request, 'medicalPractitionerUserId', Where.Query, false, false);
        await this.validateString(request, 'notes', Where.Query, false, false);
        await this.validateDate(request, 'recordDateFrom', Where.Query, false, false);
        await this.validateDate(request, 'recordDateTo', Where.Query, false, false);

        await this.validateBaseSearchFilters(request);

        this.validateRequest(request);

        return this.getFilter(request);
    };

    update = async (request: express.Request): Promise<DoctorNoteDomainModel> => {

        await this.validateUpdateBody(request);
        const domainModel = this.getDomainModel(request);
        domainModel.id = await this.getParamUuid(request, 'id');

        return domainModel;
    };

    private  async validateCreateBody(request) {

        await this.validateUuid(request, 'PatientUserId', Where.Body, true, false);
        await this.validateUuid(request, 'EhrId', Where.Body, false, false);
        await this.validateUuid(request, 'MedicalPractitionerUserId', Where.Body, false, false);
        await this.validateUuid(request, 'VisitId', Where.Body, true, false);
        await this.validateString(request, 'Notes', Where.Body, true, true);
        await this.validateString(request, 'ValidationStatus', Where.Body, true, false);
        await this.validateDate(request, 'RecordDate', Where.Body, true, false);

        this.validateRequest(request);
    }

    private  async validateUpdateBody(request) {

        await this.validateUuid(request, 'PatientUserId', Where.Body, false, false);
        await this.validateUuid(request, 'EhrId', Where.Body, false, false);
        await this.validateUuid(request, 'MedicalPractitionerUserId', Where.Body, false, false);
        await this.validateUuid(request, 'VisitId', Where.Body, false, false);
        await this.validateString(request, 'Notes', Where.Body, false, true);
        await this.validateString(request, 'ValidationStatus', Where.Body, false, false);
        await this.validateDate(request, 'RecordDate', Where.Body, false, false);

        this.validateRequest(request);
    }

    private getFilter(request): DoctorNoteSearchFilters {

        var filters: DoctorNoteSearchFilters = {
            PatientUserId             : request.query.patientUserId ?? null,
            MedicalPractitionerUserId : request.query.medicalPractitionerUserId ?? null,
            VisitId                   : request.query.visitId ?? null,
            Notes                     : request.query.notes ?? null,
            RecordDateFrom            : request.query.recordDateFrom ?? null,
            RecordDateTo              : request.query.recordDateTo ?? null,

        };
        return this.updateBaseSearchFilters(request, filters);
    }

}
