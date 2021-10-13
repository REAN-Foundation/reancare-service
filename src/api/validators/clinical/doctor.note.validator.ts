import express from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { Helper } from '../../../common/helper';
import { DoctorNoteDomainModel } from '../../../domain.types/clinical/doctor.note/doctor.note.domain.model';
import { DoctorNoteSearchFilters } from '../../../domain.types/clinical/doctor.note/doctor.note.search.types';

///////////////////////////////////////////////////////////////////////////////////////

export class DoctorNoteValidator {

    static getDomainModel = (request: express.Request): DoctorNoteDomainModel => {

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

    static create = async (request: express.Request): Promise<DoctorNoteDomainModel> => {
        await DoctorNoteValidator.validateBody(request);
        return DoctorNoteValidator.getDomainModel(request);
    };

    static getById = async (request: express.Request): Promise<string> => {
        return await DoctorNoteValidator.getParamId(request);
    };

    static delete = async (request: express.Request): Promise<string> => {
        return await DoctorNoteValidator.getParamId(request);
    };

    static search = async (request: express.Request): Promise<DoctorNoteSearchFilters> => {

        await query('patientUserId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);
        
        await query('visitId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await query('medicalPractitionerUserId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);
        
        await query('notes').optional()
            .trim()
            .escape()
            .run(request);

        await query('recordDateFrom').optional()
            .trim()
            .escape()
            .isDate()
            .run(request);

        await query('recordDateTo').optional()
            .trim()
            .escape()
            .isDate()
            .run(request);
        
        await query('orderBy').optional()
            .trim()
            .escape()
            .run(request);

        await query('order').optional()
            .trim()
            .escape()
            .run(request);

        await query('pageIndex').optional()
            .trim()
            .escape()
            .isInt()
            .run(request);

        await query('itemsPerPage').optional()
            .trim()
            .escape()
            .isInt()
            .run(request);
        
        const result = validationResult(request);
        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }

        return DoctorNoteValidator.getFilter(request);
    };

    static update = async (request: express.Request): Promise<DoctorNoteDomainModel> => {

        const id = await DoctorNoteValidator.getParamId(request);
        await DoctorNoteValidator.validateBody(request);

        const domainModel = DoctorNoteValidator.getDomainModel(request);
        domainModel.id = id;

        return domainModel;
    };

    private static async validateBody(request) {

        await body('PatientUserId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await body('EhrId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await body('MedicalPractitionerUserId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await body('VisitId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await body('Notes').optional()
            .trim()
            .escape()
            .run(request);

        await body('ValidationStatus').optional()
            .trim()
            .escape()
            .run(request);

        await body('RecordDate').optional()
            .trim()
            .escape()
            .isDate()
            .run(request);
        
        const result = validationResult(request);
        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }
    }

    private static getFilter(request): DoctorNoteSearchFilters {
        const pageIndex = request.query.pageIndex !== 'undefined' ? parseInt(request.query.pageIndex as string, 10) : 0;

        const itemsPerPage =
            request.query.itemsPerPage !== 'undefined' ? parseInt(request.query.itemsPerPage as string, 10) : 25;

        const filters: DoctorNoteSearchFilters = {
            PatientUserId             : request.query.PatientUserId ?? null,
            MedicalPractitionerUserId : request.query.MedicalPractitionerUserId ?? null,
            VisitId                   : request.query.VisitId ?? null,
            Notes                     : request.query.Notes ?? null,
            RecordDateFrom            : request.query.recordDateFrom ?? null,
            RecordDateTo              : request.query.recordDateTo ?? null,
            OrderBy                   : request.query.orderBy ?? 'CreatedAt',
            Order                     : request.query.order ?? 'descending',
            PageIndex                 : pageIndex,
            ItemsPerPage              : itemsPerPage,
        };
        return filters;
    }

    private static async getParamId(request) {

        await param('id').trim()
            .escape()
            .isUUID()
            .run(request);

        const result = validationResult(request);

        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }
        return request.params.id;
    }

}
