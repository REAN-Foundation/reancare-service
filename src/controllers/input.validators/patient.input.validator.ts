import express from 'express';
import { query, body, oneOf, validationResult, param } from 'express-validator';
import { ResponseHandler } from '../../common/response.handler';
import { Helper } from '../../common/helper';
import { PatientDomainModel, PatientSearchFilters } from '../../data/domain.types/patient.domain.types';
import { exists } from 'fs';

///////////////////////////////////////////////////////////////////////////////////////

export class PatientInputValidator {

    static getDomainModel = async (requestBody: any): Promise<PatientDomainModel> => {
        
    }

    static create = async (
        request: express.Request,
        response: express.Response
    ): Promise<PatientDomainModel> => {

        await oneOf([
            body('FirstName').optional().trim().escape(),
            body('LastName').optional().trim().escape(),
        ]).run(request);

        await oneOf([
            body('Phone').optional().trim().escape(),
            body('Email').optional().trim().escape(),
        ]).run(request);

        await body('Prefix').optional().trim().escape().run(request);
        await body('Gender').optional().trim().escape().run(request);
        await body('BirthDate').optional().trim().escape().isDate().run(request);
        await body('ImageResourceId').optional().trim().escape().isUUID().run(request);
        await body('LocationCoordsLongitude').optional().trim().escape().isDecimal().run(request);
        await body('LocationCoordsLattitude').optional().trim().escape().isDecimal().run(request);

        const result = validationResult(request);
        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }
        return PatientInputValidator.getDomainModel(request.body);
    };

    static getByUserId = async (
        request: express.Request,
        response: express.Response
    ): Promise<string> => {
        await param('id').trim().escape().isUUID().run(request);
        const result = validationResult(request);
        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }
        return request.params.id;
    };

    static search = async (
        request: express.Request,
        response: express.Response
    ): Promise<PatientSearchFilters> => {
        try {
            await query('phone').optional().trim().escape().run(request);
            await query('email').optional().trim().escape().run(request);
            await query('userId').optional().isUUID().trim().escape().run(request);
            await query('name').optional().trim().escape().run(request);
            await query('gender').optional().isAlpha().trim().escape().run(request);
            await query('birthdateFrom').optional().isDate().trim().escape().run(request);
            await query('birthdateTo').optional().isDate().trim().escape().run(request);
            await query('createdDateFrom').optional().isDate().trim().escape().run(request);
            await query('createdDateTo').optional().isDate().trim().escape().run(request);
            await query('orderBy').optional().trim().escape().run(request);
            await query('order').optional().trim().escape().run(request);
            await query('pageIndex').optional().isInt().trim().escape().run(request);
            await query('itemsPerPage').optional().isInt().trim().escape().run(request);

            await query('full').optional().isBoolean().run(request);

            const result = validationResult(request);
            if (!result.isEmpty()) {
                Helper.handleValidationError(result);
            }

            return PatientInputValidator.getFilter(request);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    private static getFilter(request): PatientSearchFilters {
        var pageIndex =
            request.query.pageIndex != 'undefined' ? parseInt(request.query.pageIndex as string, 10) : 0;
        var itemsPerPage =
            request.query.itemsPerPage != 'undefined'
                ? parseInt(request.query.itemsPerPage as string, 10)
                : 25;
        var filters: PatientSearchFilters = {
            Phone: request.query.phone ?? null,
            Email: request.query.email ?? null,
            UserId: request.query.userId ?? null,
            Name: request.query.name ?? null,
            Gender: request.query.gender ?? null,
            BirthdateFrom: request.query.birthdateFrom ?? null,
            BirthdateTo: request.query.birthdateTo ?? null,
            CreatedDateFrom: request.query.createdDateFrom ?? null,
            CreatedDateTo: request.query.createdDateTo ?? null,
            OrderBy: request.query.orderBy ?? 'CreateAt',
            Order: request.query.order ?? 'descending',
            PageIndex: pageIndex,
            ItemsPerPage: itemsPerPage,
        };
        return filters;
    }

    static updateByUserId = async (
        request: express.Request,
        response: express.Response
    ): Promise<PatientSearchFilters> => {
        try {
            await query('phone').optional().trim().escape().run(request);
            await query('email').optional().trim().escape().run(request);
            await query('userId').optional().isUUID().trim().escape().run(request);
            await query('name').optional().trim().escape().run(request);
            await query('gender').optional().isAlpha().trim().escape().run(request);
            await query('birthdateFrom').optional().isDate().trim().escape().run(request);
            await query('birthdateTo').optional().isDate().trim().escape().run(request);
            await query('createdDateFrom').optional().isDate().trim().escape().run(request);
            await query('createdDateTo').optional().isDate().trim().escape().run(request);
            await query('orderBy').optional().trim().escape().run(request);
            await query('order').optional().trim().escape().run(request);
            await query('pageIndex').optional().isInt().trim().escape().run(request);
            await query('itemsPerPage').optional().isInt().trim().escape().run(request);

            await query('full').optional().isBoolean().run(request);

            const result = validationResult(request);
            if (!result.isEmpty()) {
                Helper.handleValidationError(result);
            }

            return PatientInputValidator.getFilter(request);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };
}
