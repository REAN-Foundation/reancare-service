import express from 'express';
import { body, param, validationResult, query } from 'express-validator';

import { Helper } from '../../../../common/helper';
import { SymptomTypeDomainModel } from '../../../../domain.types/clinical/symptom/symptom.type/symptom.type.domain.model';
import { SymptomTypeSearchFilters } from '../../../../domain.types/clinical/symptom/symptom.type/symptom.type.search.types';

///////////////////////////////////////////////////////////////////////////////////////

export class SymptomTypeValidator {

    static getDomainModel = (request: express.Request): SymptomTypeDomainModel => {

        const addressModel: SymptomTypeDomainModel = {
            Type           : request.body.Type ?? 'Home',
            PersonId       : request.body.PersonId ?? null,
            OrganizationId : request.body.OrganizationId ?? null,
            SymptomTypeLine    : request.body.SymptomTypeLine,
            City           : request.body.City ?? null,
            District       : request.body.District ?? null,
            State          : request.body.State ?? null,
            Country        : request.body.Country ?? null,
            PostalCode     : request.body.PostalCode ?? null,
            Longitude      : request.body.Longitude ?? null,
            Lattitude      : request.body.Lattitude ?? null,
        };

        return addressModel;
    };

    static create = async (request: express.Request): Promise<SymptomTypeDomainModel> => {
        await SymptomTypeValidator.validateBody(request);
        return SymptomTypeValidator.getDomainModel(request);
    };

    static getById = async (request: express.Request): Promise<string> => {
        return await SymptomTypeValidator.getParamId(request);
    };
    
    static getByOrganizationId = async (request: express.Request): Promise<string> => {

        await param('organizationId').trim()
            .escape()
            .isUUID()
            .run(request);

        const result = validationResult(request);

        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }
        
        return request.params.organizationId;
    };
    
    static getByPersonId = async (request: express.Request): Promise<string> => {

        await param('personId').trim()
            .escape()
            .isUUID()
            .run(request);

        const result = validationResult(request);

        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }
        
        return request.params.personId;
    };

    static delete = async (request: express.Request): Promise<string> => {
        return await SymptomTypeValidator.getParamId(request);
    };

    static search = async (request: express.Request): Promise<SymptomTypeSearchFilters> => {

        await query('personId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await query('organizationId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await query('type').optional()
            .trim()
            .escape()
            .run(request);

        await query('addressLine').optional()
            .trim()
            .run(request);

        await query('city').optional()
            .trim()
            .escape()
            .run(request);

        await query('district').optional()
            .trim()
            .escape()
            .run(request);

        await query('state').optional()
            .trim()
            .escape()
            .run(request);

        await query('country').optional()
            .trim()
            .escape()
            .run(request);

        await query('postalCode').optional()
            .trim()
            .escape()
            .run(request);

        await query('longitudeFrom').optional()
            .trim()
            .escape()
            .isDecimal()
            .run(request);

        await query('longitudeTo').optional()
            .trim()
            .escape()
            .isDecimal()
            .run(request);

        await query('lattitudeFrom').optional()
            .trim()
            .escape()
            .isDecimal()
            .run(request);

        await query('lattitudeTo').optional()
            .trim()
            .escape()
            .isDecimal()
            .run(request);

        await query('createdDateFrom').optional()
            .trim()
            .escape()
            .toDate()
            .run(request);

        await query('createdDateTo').optional()
            .trim()
            .escape()
            .toDate()
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

        return SymptomTypeValidator.getFilter(request);
    };

    static update = async (request: express.Request): Promise<SymptomTypeDomainModel> => {

        const id = await SymptomTypeValidator.getParamId(request);
        await SymptomTypeValidator.validateBody(request);

        const domainModel = SymptomTypeValidator.getDomainModel(request);
        domainModel.id = id;

        return domainModel;
    };

    private static async validateBody(request) {

        await body('PersonId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await body('OrganizationId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await body('Type').optional()
            .trim()
            .escape()
            .run(request);

        await body('SymptomTypeLine').exists()
            .trim()
            .run(request);

        await body('City').optional()
            .trim()
            .escape()
            .run(request);

        await body('District').optional()
            .trim()
            .escape()
            .run(request);

        await body('State').optional()
            .trim()
            .escape()
            .run(request);

        await body('Country').optional()
            .trim()
            .escape()
            .run(request);

        await body('PostalCode').optional()
            .trim()
            .escape()
            .run(request);

        await body('Longitude').optional()
            .trim()
            .escape()
            .isDecimal()
            .run(request);

        await body('Lattitude').optional()
            .trim()
            .escape()
            .isDecimal()
            .run(request);

        const result = validationResult(request);
        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }
    }

    private static getFilter(request): SymptomTypeSearchFilters {
        const pageIndex = request.query.pageIndex !== 'undefined' ? parseInt(request.query.pageIndex as string, 10) : 0;

        const itemsPerPage =
            request.query.itemsPerPage !== 'undefined' ? parseInt(request.query.itemsPerPage as string, 10) : 25;

        const filters: SymptomTypeSearchFilters = {
            Type            : request.query.type ?? null,
            PersonId        : request.query.personId ?? null,
            OrganizationId  : request.query.organizationId ?? null,
            SymptomTypeLine     : request.query.addressLine ?? null,
            City            : request.query.city ?? null,
            District        : request.query.district ?? null,
            State           : request.query.state ?? null,
            Country         : request.query.country ?? null,
            PostalCode      : request.query.postalCode ?? null,
            LongitudeFrom   : request.query.longitudeFrom ?? null,
            LongitudeTo     : request.query.longitudeTo ?? null,
            LattitudeFrom   : request.query.lattitudeFrom ?? null,
            LattitudeTo     : request.query.lattitudeTo ?? null,
            CreatedDateFrom : request.query.createdDateFrom ?? null,
            CreatedDateTo   : request.query.createdDateTo ?? null,
            OrderBy         : request.query.orderBy ?? 'CreatedAt',
            Order           : request.query.order ?? 'descending',
            PageIndex       : pageIndex,
            ItemsPerPage    : itemsPerPage,
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
